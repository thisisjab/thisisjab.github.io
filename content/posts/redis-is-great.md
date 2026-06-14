+++
date = '2026-06-05T17:26:43+03:30'
draft = false 
title = 'Redis Is More Than A In-Memory KV Database'
tags = ["redis"]
+++

When it comes to Redis, everyone says: "Yeah, I use Redis for caching, and it's great." 
But is this your highest perception of Redis? If you only use Redis for caching, then why not use Memcached?

In this post, I will try to show that Redis is capable of so many things that make your engineering life way too easy.
In fact Redis is a masterpiece.

![Redis](/images/posts/redis-is-great.webp)

# What is Redis, btw?

Redis is a key-value database that stores its data in memory. Therefore, it is extremely fast and memory efficient. It is also worth mentioning that Redis's speed is not just about memory. Under the hood, Redis makes use of a number of different data structures to store and retrieve its data efficiently. I will try to cover a few of the life-saving data structures provided by Redis that have flown under the radar. 

# Streams

Many people use Redis as a message broker using its pub/sub feature. However, the problem with Redis pub/sub is that if the consumers (subscribers) are down or no consumer is listening, then the messages are sent into a black hole. You would never be able to recover lost messages, and this is bad.

Redis streams solve this problem by providing a way to store messages in a log-structured, append-only, and lightweight format. You can think of it as a tiny version of Apache Kafka. The beauty of streams is that they support consumer groups and track failing consumers out of the box. They can be used in scenarios such as event sourcing, activity feeds, and building robust distributed task queues without external dependencies like RabbitMQ. 

By the way, there are some trade-offs to consider when using Redis streams. For example, streams put some pressure on your processor and consume more memory. Redis streams do not support complex routing and filtering, and they are not optimal for long-term retention and replay requirements. Regardless, if you are already using Redis in your technical stack and you are not expecting an enormous amount of data flowing through your system, then maybe you should give Redis streams a try. 

# HyperLogLog

This one may sound familiar to some folks. HyperLogLog is a probabilistic data structure used to estimate the number of distinct elements in a set. Because it is a probabilistic data structure, it trades perfect accuracy for efficient space utilization, meaning it is not 100% accurate, but it is incredibly fast. Let's check out the documentation for HyperLogLog quickly:

> HyperLogLog is a probabilistic data structure that estimates the cardinality of a set, trading perfect accuracy for efficient space utilization. **The Redis implementation uses up to 12 KB of memory and provides a standard error rate of 0.81%.** [(Source)](http://redis.io/docs/latest/develop/data-types/probabilistic/hyperloglogs)

One of the great use cases for HyperLogLog is when you need to keep count of unique items (for example, visitors to a blog) where the exact number is not critical. If you want to save exact counts, you should make use of Redis sets instead. By the way, if you are interested in finding out how HyperLogLog works, you should check out this [answer on Stack Overflow](https://stackoverflow.com/a/35219704).

# Bloom Filters

Another powerful probabilistic data structure provided by Redis is the RedisBloom module. A Bloom filter is designed to solve a very specific problem: efficiently checking whether an item is definitely not a member of a set. *But why?* Imagine you want to check whether a chosen username for a new account is available or not. Even if you use database-level indexes and have a highly optimized query, the database still needs to head over to the disk to check if the username exists, which is obviously slower than reading from memory. However, you also cannot store all usernames in memory using something like a Redis set. *Why?* Because using a set would consume too much memory.

Bloom filters [^1] solve this problem by using a probabilistic data structure that is implemented as follows:

> To add an element, feed it to each of the k hash functions to get k array positions. Set the bits at all these positions to 1. 

In addition:

> To test whether an element is in the set, feed it to each of the k hash functions to get k array positions. If any of the bits at these positions is 0, the element is definitely not in the set; if it were, then all the bits would have been set to 1 when it was inserted. If all are 1, then either the element is in the set, or the bits have by chance been set to 1 during the insertion of other elements, resulting in a **false positive**.

So, as described above, bloom filters are prone to false positives, but they are also very fast. It's worth mentioning that using bloom filters with Redis is really straightforward and can be highly beneficial in many scenarios. Check out [the documentation](https://redis.io/docs/latest/develop/data-types/probabilistic/bloom-filter/) on Redis bloom filters to find more information.

# Cuckoo Filters

While a Bloom filter is a classic and reliable tool, a Cuckoo filter is a more modern alternative that fixes some of its key limitations. For instance, in a bloom filter, you cannot remove an item since bit values are distributed across many elements, so removing a single element would probably result in the accidental deletion of other elements.

A Cuckoo filter uses two hash functions and a "bucket" array. Each item is hashed to one of two possible bucket locations. If a bucket is full, it "kicks out" the existing item to its alternate location, repeating the process of [cuckoo hashing](https://en.wikipedia.org/wiki/Cuckoo_hashing). This allows each item to be uniquely identified and removed.

Cuckoo filters require only 2 hash functions, whereas a Bloom filter requires 7–10 hash function calls and memory accesses. A Bloom filter can continue accepting items beyond its planned capacity, though the false positive rate will slowly rise. A Cuckoo filter has a hard upper limit; once it's close to full, insertions can fail and return an error.

# Count-Min Sketch

According to the [documentation](https://redis.io/docs/latest/develop/data-types/probabilistic/count-min-sketch/), a count-min sketch is a probabilistic data structure that estimates the frequency of an element in a data stream. If you want to know how it works, you can check out [this video](https://youtu.be/lGoCslwItiU?si=2Rv40kF-MW9i44AS) on YouTube that clearly explains how this data structure works.

Essentially, it is similar to a bloom filter, with the difference being that you don't use a 1-D array; you use a 2-D array. When you want to store an element, you increment each corresponding cell in the array by 1. Anytime you need to get the frequency of an element, you choose the minimum value of all the corresponding cells. Using this approach, you will never underestimate the frequency of an element, though overestimation is possible in some cases.

This data structure can be used for scenarios such as getting the top 10 hottest tweet topics on a social media platform like X. Keep in mind that since the underlying data structure of a count-min sketch works similarly to a bloom filter, deletions are not possible.

# Top-K

Think of Top-K as a more efficient version of a count-min sketch that solves another similar problem. Top-K is a probabilistic data structure in Redis that tracks the K most frequent items in a stream of data (like the top 10 most searched keywords). Normally, you'd go with ZSETs (sorted sets) for scenarios in which you need to maintain a list of top K elements, but they consume a lot of RAM. Unlike a count-min sketch (which just estimates frequency), a Top-K sketch actively maintains a list of the current top items. 

A count-min sketch assists you in finding how many times item X has been seen. Top-K tells you what the top K items are overall right now, without you needing to query individual items. It’s worth clarifying that Top-K actually minimizes the massive O(log N) overhead of maintaining a standard Redis sorted set under heavy write loads.

For this data structure, I am not going too deep into the implementation details. You can read more about its algorithm in [this article](https://www.usenix.org/conference/atc18/presentation/gong). You can also check the [Redis documentation](http://redis.io/docs/latest/develop/data-types/probabilistic/top-k/) to understand how it is used.

# Important Note

Many of the data structures mentioned here are only available in Redis Stack.

# Conclusion

I am always amazed by the greatness of Redis, and I hope in this post I've shown why.

[^1]: https://en.wikipedia.org/wiki/Bloom_filter
