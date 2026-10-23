+++
title = "Git Tutorial"
date = 2026-10-23T19:30:00+03:30
draft = false
layout = "git-tutorial"
container_class = "w-wide"
custom_js = ["git-tutorial"]
toc = true
+++

## 1. What is Git? The DVCS Foundation

**Git** is a free, open-source **Distributed Version Control System (DVCS)** created in 2005 by **Linus Torvalds** to manage development of the Linux kernel. 

To appreciate Git's architecture, contrast it with legacy **Centralized Version Control Systems (CVCS)** like SVN or CVS:

| Feature | Centralized VCS (SVN, CVS) | Distributed VCS (Git) |
| :--- | :--- | :--- |
| **Storage Architecture** | Single central server holds complete history. | Every clone contains a complete mirror of repository history. |
| **Offline Capability** | Impossible to commit, view logs, or branch without network. | 100% of operations (commit, log, diff, branch) execute locally and offline. |
| **Single Point of Failure** | If the central server crashes, collaboration halts completely. | Every collaborator's machine acts as a complete cryptographic backup. |
| **Performance** | Network round-trip latency on commits. | Instant local disk writes with cryptographic SHA-1 hashing. |

---

## 2. Git's Three States & The Internal Realms

Files in a Git working tree navigate across **Three Core States**:

```
+-------------------+       git add       +-------------------+      git commit      +--------------------+
| Working Directory | ------------------> |   Staging Area    | -------------------> |  Local Repository  |
|    [MODIFIED]     |                     |     [STAGED]      |                      |    [COMMITTED]     |
|   Files on Disk   | <------------------ |    The Index      |                      |    HEAD Snapshot   |
+-------------------+    git restore      +-------------------+                      +--------------------+
                               --staged
```

1. **Modified**: You have altered files in your local working directory, but have not flagged them to be included in the next snapshot.
2. **Staged (The Index)**: You have marked a modified file in its current snapshot state using `git add`. It is placed in `.git/index`.
3. **Committed**: Git has safely recorded the staged snapshot into its permanent object database under `.git/objects/`.

### What Lives Inside the `.git` Directory?

Everything Git knows about your project is stored right in your root directory inside a hidden folder called `.git/`:

* **`HEAD`**: A plain text file containing a reference to the branch currently checked out (`ref: refs/heads/main`).
* **`config`**: Project-specific configuration (remote URLs, branch mappings, author information).
* **`index`**: The binary cache representing the Staging Area.
* **`objects/`**: The content-addressable object store holding every Blob, Tree, and Commit.
* **`refs/heads/`**: Lightweight text files pointing to the tip commit of each local branch.
* **`refs/remotes/`**: Lightweight text files tracking the state of branches on remote repositories.

---

## 3. Snapshots, Not Diffs: Blobs, Trees, and Commits

Most version control systems prior to Git stored changes as a set of file diffs (deltas) layered on top of a base version. **Git does not work this way.**

Git records a stream of **compressed snapshots**. Whenever you commit, Git takes a picture of what all your files look like at that moment and stores a reference to that snapshot:

```
[Blob: main.go]  \
                  --> [Tree: root] ---> [Commit: c1 (Hash: 9e3d8f1)]
[Blob: README]   /                           ^
                                             | parent pointer
                                        [Commit: c2 (Hash: 4b2e61a)] (HEAD -> main)
```

1. **Blob (Binary Large Object)**: Stores only the compressed raw file contents, indexed by its SHA-1 checksum. (Filenames and permissions are NOT stored in blobs).
2. **Tree**: Represents a directory. It lists filenames, permissions, and maps each entry to a Blob SHA-1 or a sub-Tree SHA-1.
3. **Commit**: A small text header containing:
   - Top-level Tree SHA-1 hash.
   - Parent commit SHA-1 hash (or multiple parents in merge commits).
   - Author and committer metadata (name, email, timestamp).
   - The commit message.

Because every commit references its parent, commits form an immutable **Directed Acyclic Graph (DAG)**.

---

## 4. Branches & The "Detached HEAD" Mystery

### Branches Are Just 41-Byte Pointers
In Git, branching is instantaneous and virtually free. A branch is literally a 41-byte text file inside `.git/refs/heads/` that stores a 40-character commit hash followed by a newline:

```bash
$ cat .git/refs/heads/main
9e3d8f142b78a9c01824efb156d9821a48c12034
```

Creating a branch (`git branch feature` or `git switch -c feature`) does not duplicate your files; it merely creates this small reference file pointing to your current commit.

### Conquering the "Detached HEAD" State
When you check out a commit hash directly:
```
You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches.
```

**What it actually means**: Normally, `HEAD` points symbolically to a branch name (`HEAD -> main -> commit C2`). In a **Detached HEAD** state, you used `git checkout <commit-hash>`, so `HEAD` points directly to a commit object instead of a branch pointer (`HEAD -> commit C1`).

It is not an error. It simply means that if you make new commits here, no named branch pointer will advance with you. If you wish to save commits created while in detached HEAD, just attach a branch to it:

```bash
git switch -c my-saved-branch
```

---

## 5. Merging: Fast-Forward vs 3-Way Merge Commits

When integrating changes from a feature branch into `main` (`git merge feature`), Git chooses one of two strategies based on the DAG topology:

### 1. Fast-Forward Merge
Occurs when no new commits were added to `main` since you created `feature`. There is no divergence. Git simply slides the `main` pointer forward to match `feature`:

```
Before:
C0 <--- C1 (main) <--- C2 (feature)

After 'git merge feature' (Fast-Forward):
C0 <--- C1 <--- C2 (main, feature, HEAD)
```

### 2. 3-Way Merge Commit
Occurs when both `main` and `feature` received new commits independently. Git finds their **Best Common Ancestor**, combines their trees, and generates a new **Merge Commit** with two parents:

```
        C2 [feature]
       /            \
C0 <--- C1           C4 [Merge commit] (main, HEAD)
       \            /
        C3 [hotfix]
```

---

## 6. Remote Repositories & Distributed Collaboration

Git is fully distributed. Remotes are pointers to remote copies of your repository hosted on GitHub, GitLab, or a private server.

### Remotes Architecture
* `git remote add <name> <url>`: Establishes a named link to a remote server.
* `git remote -v`: Lists all configured remote connections with their fetch and push URLs.
* `git remote get-url <name>`: Retrieves the active URL for a remote.
* `git remote set-url <name> <newurl>`: Updates the URL for an existing remote.

### Synchronizing Snapshots
* `git push <remote> <branch>`: Transmits local commit objects to the remote server and advances the remote branch pointer.
* `git fetch <remote>`: Downloads new commits, files, and refs from the remote without altering your local working directory or local branches. Updates remote tracking branches like `origin/main`.
* `git pull <remote> <branch>`: Combines `git fetch` and `git merge` into a single operation, bringing your local branch up to date with upstream changes.

---

## 7. Command Reference

### Setup & Configuration
<table class="gt-code-table">
  <thead>
    <tr>
      <th>Command</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>git config --global user.name "[name]"</code></td>
      <td>Sets the author name attached to your commit transactions.</td>
    </tr>
    <tr>
      <td><code>git config --global user.email "[email]"</code></td>
      <td>Sets the author email attached to your commit transactions.</td>
    </tr>
    <tr>
      <td><code>git config --list</code></td>
      <td>Displays all active configuration key-value pairs.</td>
    </tr>
  </tbody>
</table>

### Setup Repositories
<table class="gt-code-table">
  <thead>
    <tr>
      <th>Command</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>git init [project-name]</code></td>
      <td>Creates a new local repository from scratch or converts an existing directory.</td>
    </tr>
    <tr>
      <td><code>git clone [url]</code></td>
      <td>Downloads a project and its entire version history from a remote repository.</td>
    </tr>
  </tbody>
</table>

### Stage & Snapshot
<table class="gt-code-table">
  <thead>
    <tr>
      <th>Command</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>git status</code></td>
      <td>Lists all new or modified files to be committed.</td>
    </tr>
    <tr>
      <td><code>git diff</code></td>
      <td>Shows file differences that are not yet staged in the index.</td>
    </tr>
    <tr>
      <td><code>git add [file]</code></td>
      <td>Snapshots the file in preparation for versioning.</td>
    </tr>
    <tr>
      <td><code>git diff --staged</code></td>
      <td>Shows file differences between staging and the latest commit snapshot.</td>
    </tr>
    <tr>
      <td><code>git reset [file]</code></td>
      <td>Unstages the file, but preserves its contents in the working directory.</td>
    </tr>
    <tr>
      <td><code>git commit -m "[descriptive message]"</code></td>
      <td>Records file snapshots permanently in the version history.</td>
    </tr>
  </tbody>
</table>

### Branch & Merge
<table class="gt-code-table">
  <thead>
    <tr>
      <th>Command</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>git branch</code></td>
      <td>Lists all local branches in the current repository.</td>
    </tr>
    <tr>
      <td><code>git branch [branch-name]</code></td>
      <td>Creates a new branch pointer at the current commit.</td>
    </tr>
    <tr>
      <td><code>git switch -c [branch-name]</code></td>
      <td>Creates and switches to the specified branch.</td>
    </tr>
    <tr>
      <td><code>git switch [branch-name]</code></td>
      <td>Switches to the specified branch and updates the working directory.</td>
    </tr>
    <tr>
      <td><code>git merge [branch]</code></td>
      <td>Combines the specified branch's history into the current branch.</td>
    </tr>
    <tr>
      <td><code>git branch -d [branch-name]</code></td>
      <td>Deletes the specified branch.</td>
    </tr>
  </tbody>
</table>

### Remote Repositories & Collaboration
<table class="gt-code-table">
  <thead>
    <tr>
      <th>Command</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>git remote add [name] [url]</code></td>
      <td>Registers a new remote repository connection.</td>
    </tr>
    <tr>
      <td><code>git remote -v</code></td>
      <td>Lists all configured remote repositories with their fetch and push URLs.</td>
    </tr>
    <tr>
      <td><code>git remote get-url [name]</code></td>
      <td>Displays the URL for the specified remote name.</td>
    </tr>
    <tr>
      <td><code>git remote set-url [name] [newurl]</code></td>
      <td>Updates the URL for an existing remote connection.</td>
    </tr>
    <tr>
      <td><code>git push -u [remote] [branch]</code></td>
      <td>Pushes local branch commits to the remote and configures upstream tracking.</td>
    </tr>
    <tr>
      <td><code>git fetch [remote]</code></td>
      <td>Downloads all commits and branches from the remote without modifying local files.</td>
    </tr>
    <tr>
      <td><code>git pull [remote] [branch]</code></td>
      <td>Fetches changes from the remote and merges them directly into the current branch.</td>
    </tr>
  </tbody>
</table>

### Temporary Commits: Stashing
<table class="gt-code-table">
  <thead>
    <tr>
      <th>Command</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>git stash</code></td>
      <td>Temporarily stores all modified tracked files in a stash stack.</td>
    </tr>
    <tr>
      <td><code>git stash pop</code></td>
      <td>Restores the most recently stashed files and drops them from the stack.</td>
    </tr>
    <tr>
      <td><code>git stash list</code></td>
      <td>Lists all stashed changesets.</td>
    </tr>
    <tr>
      <td><code>git stash drop</code></td>
      <td>Discards the most recently stashed changeset.</td>
    </tr>
  </tbody>
</table>

### Inspect & Compare
<table class="gt-code-table">
  <thead>
    <tr>
      <th>Command</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>git log</code></td>
      <td>Lists version history for the current branch.</td>
    </tr>
    <tr>
      <td><code>git log --oneline --graph</code></td>
      <td>Displays compact commit history with branch and merge topology.</td>
    </tr>
    <tr>
      <td><code>git show [commit]</code></td>
      <td>Outputs metadata and content changes of the specified commit.</td>
    </tr>
  </tbody>
</table>

### Rewriting History & Undoing
<table class="gt-code-table">
  <thead>
    <tr>
      <th>Command</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>git restore [file]</code></td>
      <td>Discards local uncommitted changes in your working tree.</td>
    </tr>
    <tr>
      <td><code>git restore --staged [file]</code></td>
      <td>Unstages a file from the index while keeping working edits intact.</td>
    </tr>
    <tr>
      <td><code>git reset --soft HEAD~1</code></td>
      <td>Undoes the last commit, leaving changes staged in the index.</td>
    </tr>
    <tr>
      <td><code>git reset --hard HEAD~1</code></td>
      <td>Obliterates the last commit and discards all changes in the working tree.</td>
    </tr>
  </tbody>
</table>
