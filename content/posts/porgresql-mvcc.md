+++
date = '2026-05-25T19:15:47+03:30'
draft = false 
title = 'Everything is a transaction in PostgreSQL. So what?'
+++

Every statement you run in PostgreSQL is inside a transaction either explicitly or implicitly, and this may ring a bell. But, let's focus on this matter and see what is going on as this single architectural choice dictates why for example your COUNT(*) queries are slow, why your database disk space mysteriously balloons, and why dead rows might be haunting your storage.

# The question

First, I'd like to draw your attention to this section of PostgreSQL's official documentation on transactions.

> PostgreSQL actually treats every SQL statement as being executed within a transaction. If you do not issue a BEGIN command, then each individual statement has an implicit BEGIN and (if successful) COMMIT wrapped around it. A group of statements surrounded by BEGIN and COMMIT is sometimes called a transaction block. [(source)](https://www.postgresql.org/docs/current/tutorial-transactions.html#:~:text=PostgreSQL%20actually%20treats%20every%20SQL,sometimes%20called%20a%20transaction%20block.)

But, there are some questions to this matter. What does it mean and should we care about it? What effect does this have on the performance of our queries? What made genius PostgreSQL engineers to think of this?

# Transactions

Let's begin by defining what a transaction is though it may sound really obvious to you and you find this a pointless discussion, but I recommend to bear with me and stay around as we go deeper step by step. Transaction are considered as one the most fundamental features of many modern database. Transactions are used when you want to perform a series of operations like multiple updates, multiple deletions consisting of multiple reads and some logic, etc. in a atomic manner - that is either all of the operations in that transaction must completed successfully, or in case of any error or withdrawal all the operations must be rolled back as if nothing has happened. Now, let's consider how transactions are enforced?

# All rows are tuples

In PostgreSQL, every row is considered a tuple. Imagine we have a table named `bank_accounts`. Let's define this table as simple as we can:

```sql
CREATE TABLE bank_accounts (
    username TEXT PRIMARY KEY,
    balance REAL NOT NULL 
);
```

And its content:

| username | balance |
| --- | --- |
| alice | 400 |
| bob | 50 |

This table consists of only two tuples: (alice, 400) and (bob, 50).

# Tuples are immutable

In PostgreSQL you cannot edit a tuple. *Wait, what?* You cannot edit or replace tuples; you are only allowed to add or delete tuples. Actually, you yourself cannot perform deletion and insertion of tuples in reality. This operation is done by PostgreSQL internally.

At this moment you may wonder:

- *If rows are immutable, how can PostgreSQL do `UPDATE` statements...?*
- *Why all this information seems cluttered and useless?*
- *Why should I actually care?*

# MVCC

![Postgres MVCC](/images/posts/postgres-mvcc.webp)

This is where it gets interesting as we now focus on how does PostgreSQL handle transactions. PostgreSQL ensures transactions atomicity by a technique named **Multi-Version Concurrency Control** [^1] which we will refer to as **MVCC** from now on. Let's see how does this technique work in action. 

## Transaction id 

Any transaction you run in PostgreSQL, has a 32 bit transaction id which is referred as **xid**. You can get the id of current transaction in PostgreSQL using `txid_current()` function:

```sql
database=*# SELECT txid_current();
 txid_current
--------------
         9573
(1 row)
```

Keep in mind that this number is incremented sequentially. If you create another transaction at the same time, you will get 9574.

## xmin & xmax

Alongside each tuple in a table like `bank_accounts`, PostgreSQL also keeps two transaction ids as **xmin** and **xmax**. Every row has xmin (transaction that created it) and xmax (transaction that deleted/updated it). Readers never block writers and vice versa — they just see different versions of rows based on a snapshot of which transactions were committed at a given point. *Huh?*

Consider our previous table with xmin and xmax beside the tuple:

| xmin | xmax | username | balance |
| --- | --- | --- | --- |
| 2 | 0 | alice | 400 |
| 8 | 0 | bob | 50 |

Here, the value xmax=0 means that no one has deleted the corresponding tuple. xmin=2 means that corresponding row is created by a transaction with id equal to 2.

Now if you try to update Alice's balance by a transaction id (xid) equal to 12. Your table will look like this:

| xmin | xmax | username | balance |
| --- | --- | --- | --- |
| 2 | 12 | alice | 400 |
| 8 | 0 | bob | 50 |
| 12 | 0 | alice | 700 |

Also, let's delete Bob's account with xid = 23 and see what happens:

| xmin | xmax | username | balance |
| --- | --- | --- | --- |
| 2 | 12 | alice | 400 |
| 8 | 23 | bob | 50 |
| 12 | 0 | alice | 700 |


## You cannot read uncommitted data

Now let's see how does PostgreSQL use this information to decide on which row is visible for in a specific transaction. PostgreSQL always prohibits reading uncommitted data (rows that are created/modified/deleted by a transaction that is not committed, yet). The secret lies in xmin, xmax, and xid. In a specific transaction with transaction id = xid and a specific row PostgreSQL enforces following criteria for each row to decide if it's visible or not:

- If `xid < row.xmin`, that row is **NOT** visible, because these rows are added **after you started the transaction**.
- If transaction with id equal to `row.xmin` is rolled back, that row is **NOT** visible, because the insertion of new tuple was aborted.
- If `xid >= row.xmax` and transaction with id equal to row.xmax is committed, that row is **NOT** visible, because that row is already deleted.
- Any other row that does not fall into previous conditions, is therefore **visible**.

Let's see this in action with a python code snippet that overly simplifies the whole process:

```python
def is_row_visible(xid: int, row: row) -> bool:
    if xid < row.xmin or transaction_is_rolled_back(row.xmin):
        # You don't see tuples from later transaction that are added
        # You also don't see added tuples from later transaction that are never committed
        return False

    if xid >= row.xmax and transaction_is_committed(row.xmax):
        # You don't see tuples from past that are deleted
        return False

    return True
```

## Vacuuming

So, clearly this MVCC approach creates a lot of redundant tuples that need to be garbage collected. PostgreSQL deletes invalid and redundant rows (tuples) using a utility called VACUUM [^2]. By default PostgreSQL vacuums periodically which is called vacuuming process (autovacuum daemon [^3]).

# Why this matters?

Now that we know what is MVCC, let's see why it's good to know about and have a few considerations.

## Dead tuples accumulate

Every `UPDATE` and `DELETE` leaves the old tuple behind. It doesn't get cleaned up immediately. Over time this bloats your tables and indexes.
Vacuuming is the process that cleans these dead tuples up. If vacuum can't keep up (as of high write load, or a long running transaction pinning old rows), your table grows even if your actual data doesn't.

> As an engineer: never leave long running transactions open — they block vacuum from cleaning anything committed after them.

## Long running transactions are dangerous

A transaction that stays open for hours forces Postgres to keep every dead tuple from that point forward, because some other query might need to see the old version. **Keep transactions as short as possible.**

## SELECT FOR UPDATE is sometimes necessary

MVCC gives you a snapshot, but snapshots are point in time. Two transactions can both read the same row, both think they're the only one acting on it, and both write — last write wins.

> When you need to read-then-write, use `SELECT FOR UPDATE` to lock the row, or use serializable isolation.

## SELECT COUNT(*) is slow

You may want to think about this on your own, but basically counting all tuples in a table requires to keep track of all ongoing transactions before reporting a solid number as there are no single current number of rows in a table, so PostgreSQL will traverse your table one record at a time to make sure if it counts or not. This is the reason that such query is extremely slow on large databases.

# Quiz

If you want to make sure that you fully understand how does MVCC visibility work, let's have a quick review. Imagine we are querying `bank_accounts` table. For each question think if row is visible or not.

1. You see a row with xmin=5 and xmax=0. You know that transaction 1 through 5 are committed. Will you see the row? 

2. You encounter a row with xmin=5 and xmax=9. Transaction 5 is committed, but transaction 9 is in progress. Will you see the row?

3. You reach a row with xmin=5 and xmax=9. Transaction 9 is committed. What about now? Is it visible?

4. You see xmin=12 and xmax=0 for a row. Transaction 12 is still in progress. Do you see this row?

5. You find a row with xmin=12 and xmax=15. Transaction 12 is committed, but transaction 15 is rolled back. Will you see this row?

6. Tricky one: there is a row with xmin=20 and xmax=0. Transaction 20 is rolled back. Is this row visible in your query?

# Answer

1. Yes (assuming your transaction started after transaction 5 committed). Transaction 5 is already committed and therefore visible.

2. Yes. Transaction 9 is yet to be committed and we are not sure what will happen to this row. It is visible since in transaction 5 this row was committed.

3. No. Transaction 9 has deleted the row.

4. No. We would see it after transaction 12 was committed.

5. Yes. It's created in transaction 12, and it's not deleted in transaction 15.

6. No. Transaction 20 is rolled back. So there is no way to see this tuple.

[^1]: Read more: https://www.postgresql.org/docs/current/mvcc.html
[^2]: Read more: https://www.postgresql.org/docs/current/sql-vacuum.html
[^3]: Read more: https://www.postgresql.org/docs/current/routine-vacuuming.html



