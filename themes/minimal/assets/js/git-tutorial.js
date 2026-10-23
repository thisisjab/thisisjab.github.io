// ==============================================================================
// Git Interactive Workbench - Fullscreen 100vw 100vh Application Engine
// ==============================================================================
// Features:
// - Complete Git Curriculum: Genesis to Distributed Collaboration (18 Slides).
// - Interactive shell commands: touch, echo (> and >>), cat, ls, rm to edit files.
// - Clean horizontal 2D DAG: dot-and-arrow graphs with dynamic multi-branch lanes.
// - Full remote support: git remote add/get-url/set-url/-v, push, fetch, and pull.
// ==============================================================================

(function () {
    "use strict";

    const SLIDES = [
        // ======================================================================
        // SLIDE 1: ARCHITECTURE & GENESIS: DVCS, Three States & git init
        // ======================================================================
        {
            id: 0,
            num: "01 / 18",
            badge: "[Architecture & Genesis]",
            title: "The Birth of Git: DVCS, Three States & git init",
            bodyHtml: `
                <p>In 2005, after BitKeeper revoked its free license for the Linux kernel project, <strong>Linus Torvalds</strong> designed <strong>Git</strong> to create a decentralized, ultra-fast version control system.</p>
                <p>His core design breakthroughs revolutionized software engineering:</p>
                <ul>
                    <li><strong>Distributed (DVCS) over Centralized (CVCS):</strong> Every clone holds the entire project history locally. You can commit, branch, diff, and view logs completely offline.</li>
                    <li><strong>Snapshots over Diffs:</strong> Git doesn't save file deltas; it records full compressed snapshots indexed by cryptographic SHA-1 hashes.</li>
                </ul>
                <p>Files in your repository transition across <strong>Three States</strong>:</p>
                <ol>
                    <li><strong>Modified:</strong> Edited in your <em>Working Directory</em>.</li>
                    <li><strong>Staged:</strong> Added to the <em>Staging Area (Index)</em> for the next commit.</li>
                    <li><strong>Committed:</strong> Safely sealed into the <em>Repository (HEAD)</em>.</li>
                </ol>
                <p>To begin tracking any project, run <code>git init</code> to create a fresh <code>.git/</code> database.</p>
            `,
            goalText: "Run <code>git init</code> to initialize your empty repository.",
            tipText: "<strong>Shell Ready:</strong> You can run real terminal commands: <code>ls</code>, <code>touch</code>, <code>echo</code>, <code>cat</code>, and <code>git</code>.",
            chips: ["git init", "git status", "ls", "git help"],
            initialState: {
                config: { "user.name": "Jab", "user.email": "heythisisjab@gmail.com" },
                initialized: false,
                files: {},
                staged: {},
                commits: [],
                branches: {},
                head: { type: "branch", target: "main" },
                remotes: {},
                stash: []
            },
            validate: function (state, lastCmd) {
                return state.initialized === true;
            }
        },

        // ======================================================================
        // SLIDE 2: COMMAND: git config
        // ======================================================================
        {
            id: 1,
            num: "02 / 18",
            badge: "[Identity & Configuration]",
            title: "Command: git config",
            bodyHtml: `
                <p>Before recording your first snapshot, Git requires your identity. Every commit you create permanently bakes your name and email into its cryptographic header.</p>
                <p><strong>Syntax:</strong></p>
                <ul>
                    <li><code>git config --global user.name "[name]"</code>: Sets author name globally.</li>
                    <li><code>git config --global user.email "[email]"</code>: Sets author email.</li>
                    <li><code>git config --list</code>: Displays all active configuration variables.</li>
                </ul>
                <p>Run <code>git config --list</code> to inspect the configured author settings.</p>
            `,
            goalText: "Run <code>git config --list</code> to view configuration variables.",
            tipText: "<strong>Location:</strong> Global settings live in <code>~/.gitconfig</code>; local repository settings live in <code>.git/config</code>.",
            chips: ["git config --list", "git config user.name \"Jab\"", "git config user.email \"heythisisjab@gmail.com\""],
            initialState: {
                config: { "user.name": "Jab", "user.email": "heythisisjab@gmail.com", "core.editor": "nvim" },
                initialized: true,
                files: {},
                staged: {},
                commits: [],
                branches: {},
                head: { type: "branch", target: "main" },
                remotes: {},
                stash: []
            },
            validate: function (state, lastCmd) {
                return lastCmd && lastCmd.trim().startsWith("git config");
            }
        },

        // ======================================================================
        // SLIDE 3: COMMAND: touch, echo & git status
        // ======================================================================
        {
            id: 2,
            num: "03 / 18",
            badge: "[Workspace Lifecycle]",
            title: "Editing Files & git status",
            bodyHtml: `
                <p>Your working tree starts clean. Here you edit files yourself using interactive shell commands:</p>
                <ul>
                    <li><code>touch main.go</code>: Creates a new empty file.</li>
                    <li><code>echo 'package main' > main.go</code>: Writes content into <code>main.go</code>.</li>
                    <li><code>cat main.go</code>: Prints file contents.</li>
                    <li><code>git status</code>: Inspects how Git sees your changes.</li>
                </ul>
                <p>Create <code>main.go</code> with <code>echo 'package main' > main.go</code> and check <code>git status</code> to see your untracked file in red!</p>
            `,
            goalText: "Create <code>main.go</code> using <code>echo 'package main' > main.go</code> and run <code>git status</code>.",
            tipText: "<strong>Untracked:</strong> Files that Git has never seen before are untracked until you explicitly stage them with <code>git add</code>.",
            chips: ["echo \"package main\" > main.go", "cat main.go", "git status", "ls"],
            initialState: {
                config: { "user.name": "Jab", "user.email": "heythisisjab@gmail.com" },
                initialized: true,
                files: {},
                staged: {},
                commits: [],
                branches: {},
                head: { type: "branch", target: "main" },
                remotes: {},
                stash: []
            },
            validate: function (state, lastCmd) {
                return state.files["main.go"] && lastCmd && lastCmd.trim().startsWith("git status");
            }
        },

        // ======================================================================
        // SLIDE 4: COMMAND: git add
        // ======================================================================
        {
            id: 3,
            num: "04 / 18",
            badge: "[Index & Staging Area]",
            title: "Command: git add",
            bodyHtml: `
                <p><code>git add</code> moves changes from your Working Directory into the Staging Area (the Index).</p>
                <p>This intermediate zone gives you <strong>intentional crafting power</strong>: you can edit multiple files, but stage only the one file that belongs to a coherent, atomic commit.</p>
                <p><strong>Syntax:</strong></p>
                <ul>
                    <li><code>git add &lt;file&gt;</code>: Stages a specific file.</li>
                    <li><code>git add .</code>: Stages all files in the current folder.</li>
                </ul>
                <p>Stage <code>main.go</code> and verify with <code>git status</code> that it turns green under 'Changes to be committed'.</p>
            `,
            goalText: "Stage <code>main.go</code> using <code>git add main.go</code>.",
            tipText: "<strong>Under the Hood:</strong> <code>git add</code> immediately compresses <code>main.go</code> into a Blob object under <code>.git/objects/</code>.",
            chips: ["git add main.go", "git status", "git diff --staged"],
            initialState: {
                config: { "user.name": "Jab", "user.email": "heythisisjab@gmail.com" },
                initialized: true,
                files: {
                    "main.go": { status: "untracked", content: "package main\n\nfunc main() {}" }
                },
                staged: {},
                commits: [],
                branches: {},
                head: { type: "branch", target: "main" },
                remotes: {},
                stash: []
            },
            validate: function (state) {
                return state.staged && state.staged["main.go"];
            }
        },

        // ======================================================================
        // SLIDE 5: COMMAND: git commit
        // ======================================================================
        {
            id: 4,
            num: "05 / 18",
            badge: "[Permanent Snapshots]",
            title: "Command: git commit",
            bodyHtml: `
                <p><code>git commit</code> seals the staged snapshot permanently into the repository's Directed Acyclic Graph (DAG).</p>
                <p><strong>Every commit contains:</strong></p>
                <ul>
                    <li><strong>Tree reference:</strong> Directory snapshot of Blobs and filenames.</li>
                    <li><strong>Parent pointer:</strong> The SHA-1 hash of the parent commit (for root commit, no parent).</li>
                    <li><strong>Author & Timestamp:</strong> Who committed the code and when.</li>
                    <li><strong>Commit message:</strong> Imperative description of the change.</li>
                </ul>
                <p>Commit your staged file with message <code>feat: init server</code> to plant the first root node <code>(C0)</code> in your DAG!</p>
            `,
            goalText: "Commit with <code>git commit -m \"feat: init server\"</code>.",
            tipText: "<strong>DAG Genesis:</strong> Look at the Git Tree Overview above: your very first commit dot <code>(C0)</code> will appear on <code>main</code>!",
            chips: ["git commit -m \"feat: init server\"", "git log --oneline", "git status"],
            initialState: {
                config: { "user.name": "Jab", "user.email": "heythisisjab@gmail.com" },
                initialized: true,
                files: { "main.go": { status: "clean", content: "package main\n\nfunc main() {}" } },
                staged: { "main.go": { content: "package main\n\nfunc main() {}" } },
                commits: [],
                branches: {},
                head: { type: "branch", target: "main" },
                remotes: {},
                stash: []
            },
            validate: function (state) {
                return state.commits && state.commits.length >= 1;
            }
        },

        // ======================================================================
        // SLIDE 6: COMMAND: git branch
        // ======================================================================
        {
            id: 5,
            num: "06 / 18",
            badge: "[Lightweight Pointers]",
            title: "Command: git branch",
            bodyHtml: `
                <p>In Git, branches are not expensive directory duplicates. <strong>A branch is literally a 41-byte plain text file</strong> inside <code>.git/refs/heads/</code> containing a commit hash.</p>
                <p><strong>Syntax:</strong></p>
                <ul>
                    <li><code>git branch</code>: Lists all branches (* indicates currently checked-out branch).</li>
                    <li><code>git branch &lt;name&gt;</code>: Creates a new pointer at the current commit.</li>
                    <li><code>git branch -d &lt;name&gt;</code>: Deletes a branch.</li>
                </ul>
                <p>Create a new branch named <code>feature/auth</code>.</p>
            `,
            goalText: "Create a branch named <code>feature/auth</code> with <code>git branch feature/auth</code>.",
            tipText: "<strong>Zero Storage Cost:</strong> Creating 100 branches in Git takes virtually zero milliseconds and zero disk space.",
            chips: ["git branch feature/auth", "git branch", "git log --oneline"],
            initialState: {
                config: { "user.name": "Jab", "user.email": "heythisisjab@gmail.com" },
                initialized: true,
                files: { "main.go": { status: "clean", content: "package main" } },
                staged: {},
                commits: [
                    { id: "c0", hash: "9e3d8f1", message: "feat: init server", parents: [], branch: "main", author: "Jab <heythisisjab@gmail.com>" }
                ],
                branches: { main: "c0" },
                head: { type: "branch", target: "main" },
                remotes: {},
                stash: []
            },
            validate: function (state) {
                return state.branches && state.branches["feature/auth"];
            }
        },

        // ======================================================================
        // SLIDE 7: COMMAND: git switch
        // ======================================================================
        {
            id: 6,
            num: "07 / 18",
            badge: "[Branch Navigation]",
            title: "Command: git switch",
            bodyHtml: `
                <p>Creating a branch does not automatically switch your working context. To tell Git that future commits should advance the new branch, you must update <code>HEAD</code>.</p>
                <p>Modern Git provides <code>git switch</code> dedicated solely to branch navigation:</p>
                <ul>
                    <li><code>git switch &lt;branch&gt;</code>: Moves to an existing branch.</li>
                    <li><code>git switch -c &lt;branch&gt;</code>: Creates and switches in one step (equivalent to <code>git checkout -b</code>).</li>
                </ul>
                <p>Switch to your <code>feature/auth</code> branch.</p>
            `,
            goalText: "Switch to <code>feature/auth</code> with <code>git switch feature/auth</code>.",
            tipText: "<strong>HEAD State:</strong> <code>.git/HEAD</code> now contains <code>ref: refs/heads/feature/auth</code>.",
            chips: ["git switch feature/auth", "git checkout feature/auth", "git branch"],
            initialState: {
                config: { "user.name": "Jab", "user.email": "heythisisjab@gmail.com" },
                initialized: true,
                files: { "main.go": { status: "clean", content: "package main" } },
                staged: {},
                commits: [
                    { id: "c0", hash: "9e3d8f1", message: "feat: init server", parents: [], branch: "main", author: "Jab <heythisisjab@gmail.com>" }
                ],
                branches: { main: "c0", "feature/auth": "c0" },
                head: { type: "branch", target: "main" },
                remotes: {},
                stash: []
            },
            validate: function (state) {
                return state.head.type === "branch" && state.head.target === "feature/auth";
            }
        },

        // ======================================================================
        // SLIDE 8: 2D DAG FORK: Committing on a Branch
        // ======================================================================
        {
            id: 7,
            num: "08 / 18",
            badge: "[2D DAG Branching]",
            title: "2D DAG Forks: Committing on a Branch",
            bodyHtml: `
                <p>Now that <code>HEAD</code> points to <code>feature/auth</code>, any commit you make will advance <em>only</em> <code>feature/auth</code> on its own branch track. The <code>main</code> branch will remain safely parked at <code>C0</code>!</p>
                <p>Edit <code>main.go</code> yourself to add authentication code:</p>
                <ol>
                    <li><code>echo '// jwt auth handler' >> main.go</code></li>
                    <li><code>git add main.go</code></li>
                    <li><code>git commit -m "feat: jwt auth"</code></li>
                </ol>
                <p>Watch the 2D DAG fork downward into the new branch row with an angled arrow <code>\\</code>!</p>
            `,
            goalText: "Edit, stage, and commit on <code>feature/auth</code> with <code>git commit -m \"feat: jwt auth\"</code>.",
            tipText: "<strong>DAG Fork:</strong> The graph bifurcates into two independent tracks: <code>(C0) \\---> (C1)</code>.",
            chips: ["echo \"// jwt auth handler\" >> main.go", "cat main.go", "git add main.go", "git commit -m \"feat: jwt auth\""],
            initialState: {
                config: { "user.name": "Jab", "user.email": "heythisisjab@gmail.com" },
                initialized: true,
                files: { "main.go": { status: "clean", content: "package main\n\nfunc main() {}" } },
                staged: {},
                commits: [
                    { id: "c0", hash: "9e3d8f1", message: "feat: init server", parents: [], branch: "main", author: "Jab <heythisisjab@gmail.com>" }
                ],
                branches: { main: "c0", "feature/auth": "c0" },
                head: { type: "branch", target: "feature/auth" },
                remotes: {},
                stash: []
            },
            validate: function (state) {
                return state.branches["feature/auth"] && state.branches["feature/auth"] !== state.branches["main"];
            }
        },

        // ======================================================================
        // SLIDE 9: COMMAND: git checkout <hash> (Detached HEAD)
        // ======================================================================
        {
            id: 8,
            num: "09 / 18",
            badge: "[Direct Commit Inspection]",
            title: "Command: git checkout <hash> (Detached HEAD)",
            bodyHtml: `
                <p>Many developers freeze when seeing: <code>You are in 'detached HEAD' state</code>. But there is no reason to panic.</p>
                <p><strong>What is Detached HEAD?</strong></p>
                <p>Normally, <code>HEAD</code> points to a branch name (which points to a commit). When you check out a commit hash directly (<code>git checkout &lt;hash&gt;</code>), <code>HEAD</code> points directly to the commit object, detaching from any branch pointer.</p>
                <p>It is not an error—it is how Git lets you inspect past historical states. Time-travel back to root commit <code>9e3d8f1</code> (<code>C0</code>).</p>
            `,
            goalText: "Checkout commit <code>9e3d8f1</code> with <code>git checkout 9e3d8f1</code>.",
            tipText: "<strong>Safe return:</strong> To exit detached HEAD anytime, simply run <code>git switch main</code>.",
            chips: ["git checkout 9e3d8f1", "git switch main", "git status"],
            initialState: {
                config: { "user.name": "Jab", "user.email": "heythisisjab@gmail.com" },
                initialized: true,
                files: { "main.go": { status: "clean", content: "package main" } },
                staged: {},
                commits: [
                    { id: "c0", hash: "9e3d8f1", message: "feat: init server", parents: [], branch: "main", author: "Jab <heythisisjab@gmail.com>" },
                    { id: "c1", hash: "4b2e61a", message: "feat: jwt auth", parents: ["c0"], branch: "feature/auth", author: "Jab <heythisisjab@gmail.com>" }
                ],
                branches: { main: "c0", "feature/auth": "c1" },
                head: { type: "branch", target: "main" },
                remotes: {},
                stash: []
            },
            validate: function (state) {
                return state.head.type === "commit" && state.head.target === "c0";
            }
        },

        // ======================================================================
        // SLIDE 10: COMMAND: git merge
        // ======================================================================
        {
            id: 9,
            num: "10 / 18",
            badge: "[History Integration]",
            title: "Command: git merge",
            bodyHtml: `
                <p>When development on a feature is finished, <code>git merge</code> joins the histories back together.</p>
                <p><strong>Two Types of Merges:</strong></p>
                <ul>
                    <li><strong>Fast-Forward:</strong> If <code>main</code> hasn't received new commits since you branched, Git simply slides the <code>main</code> pointer forward.</li>
                    <li><strong>3-Way Merge:</strong> If both branches have independent commits (divergence), Git finds the common ancestor and creates a new <strong>Merge Commit with TWO parents</strong>!</li>
                </ul>
                <p>Switch to <code>main</code> and merge <code>feature/auth</code> to see both lanes converge in the DAG!</p>
            `,
            goalText: "Merge with <code>git merge feature/auth</code>.",
            tipText: "<strong>Convergence:</strong> Notice the merge commit in the DAG has two incoming arrow paths: one from main and one from feature.",
            chips: ["git merge feature/auth", "git switch main", "git log --oneline --graph"],
            initialState: {
                config: { "user.name": "Jab", "user.email": "heythisisjab@gmail.com" },
                initialized: true,
                files: { "main.go": { status: "clean", content: "package main" } },
                staged: {},
                commits: [
                    { id: "c0", hash: "9e3d8f1", message: "feat: init server", parents: [], branch: "main", author: "Jab <heythisisjab@gmail.com>" },
                    { id: "c1", hash: "4b2e61a", message: "feat: jwt auth", parents: ["c0"], branch: "feature/auth", author: "Jab <heythisisjab@gmail.com>" },
                    { id: "c2", hash: "8f12a0b", message: "fix: db pool", parents: ["c0"], branch: "main", author: "Jab <heythisisjab@gmail.com>" }
                ],
                branches: { main: "c2", "feature/auth": "c1" },
                head: { type: "branch", target: "main" },
                remotes: {},
                stash: []
            },
            validate: function (state) {
                const head = getHeadCommit(state);
                return head && head.parents && head.parents.length >= 2;
            }
        },

        // ======================================================================
        // SLIDE 11: COMMANDS: git restore & git reset
        // ======================================================================
        {
            id: 10,
            num: "11 / 18",
            badge: "[Safe Reversals & Recovery]",
            title: "Commands: git restore & git reset",
            bodyHtml: `
                <p>Mistakes happen. Git provides precision surgery commands to undo changes safely:</p>
                <ul>
                    <li><code>git restore --staged &lt;file&gt;</code>: Unstages a file from the Index while keeping your working edits intact on disk.</li>
                    <li><code>git restore &lt;file&gt;</code>: Discards working directory changes and restores from the last commit.</li>
                    <li><code>git reset &lt;file&gt;</code>: Classic command to unstage files.</li>
                </ul>
                <p>Create a secret file with <code>echo 'SECRET=123' > secret.env</code>, stage it with <code>git add secret.env</code>, then safely unstage it with <code>git restore --staged secret.env</code>!</p>
            `,
            goalText: "Unstage <code>secret.env</code> using <code>git restore --staged secret.env</code>.",
            tipText: "<strong>Total Safety:</strong> Unstaging leaves the file on disk completely intact.",
            chips: ["echo \"SECRET=123\" > secret.env", "git add secret.env", "git restore --staged secret.env", "git status"],
            initialState: {
                config: { "user.name": "Jab", "user.email": "heythisisjab@gmail.com" },
                initialized: true,
                files: { "main.go": { status: "clean", content: "package main" } },
                staged: {},
                commits: [
                    { id: "c0", hash: "9e3d8f1", message: "feat: init server", parents: [], branch: "main", author: "Jab <heythisisjab@gmail.com>" }
                ],
                branches: { main: "c0" },
                head: { type: "branch", target: "main" },
                remotes: {},
                stash: []
            },
            validate: function (state, lastCmd) {
                return state.files["secret.env"] && !state.staged["secret.env"] && lastCmd && lastCmd.includes("restore");
            }
        },

        // ======================================================================
        // SLIDE 12: COMMAND: git stash
        // ======================================================================
        {
            id: 11,
            num: "12 / 18",
            badge: "[Emergency Shelf]",
            title: "Command: git stash",
            bodyHtml: `
                <p><code>git stash</code> provides an emergency shelf for uncommitted work.</p>
                <p>When you're midway through a feature and need to switch branches to fix a critical production bug, Git prevents branch switching with dirty conflicting files. <code>git stash</code> shelves your changes onto a stack, returning your working directory to a clean state.</p>
                <p><strong>Commands:</strong></p>
                <ul>
                    <li><code>git stash</code>: Shelves working tree & index modifications.</li>
                    <li><code>git stash list</code>: Lists all stashed changesets.</li>
                    <li><code>git stash pop</code>: Re-applies the most recent stash and drops it from the stack.</li>
                </ul>
                <p>Edit <code>main.go</code> with <code>echo '// WIP kafka' >> main.go</code>, then shelf your work with <code>git stash</code>!</p>
            `,
            goalText: "Shelf your edits using <code>git stash</code>.",
            tipText: "<strong>Stack LIFO:</strong> You can stash multiple times; <code>git stash pop</code> pops the most recent one first.",
            chips: ["echo \"// WIP kafka\" >> main.go", "git status", "git stash", "git stash list", "git stash pop"],
            initialState: {
                config: { "user.name": "Jab", "user.email": "heythisisjab@gmail.com" },
                initialized: true,
                files: { "main.go": { status: "clean", content: "package main" } },
                staged: {},
                commits: [
                    { id: "c0", hash: "9e3d8f1", message: "feat: init server", parents: [], branch: "main", author: "Jab <heythisisjab@gmail.com>" }
                ],
                branches: { main: "c0" },
                head: { type: "branch", target: "main" },
                remotes: {},
                stash: []
            },
            validate: function (state) {
                return state.stash && state.stash.length > 0;
            }
        },

        // ======================================================================
        // SLIDE 13: COMMAND: git log & HISTORY INSPECTION
        // ======================================================================
        {
            id: 12,
            num: "13 / 18",
            badge: "[Commit Graph Inspection]",
            title: "Command: git log & History Inspection",
            bodyHtml: `
                <p><code>git log</code> lets you inspect the commit DAG. Using <code>git log --oneline --graph</code> prints an ASCII representation of the DAG directly into your terminal!</p>
                <p><strong>Syntax:</strong></p>
                <ul>
                    <li><code>git log</code>: Detailed chronological history (author, date, hash, full message).</li>
                    <li><code>git log --oneline</code>: Compact single-line summary per commit.</li>
                    <li><code>git log --oneline --graph</code>: Renders branch forks and merge topology with ASCII lines.</li>
                </ul>
                <p>Inspect your history with <code>git log --oneline --graph</code>.</p>
            `,
            goalText: "Run <code>git log --oneline --graph</code> to view the commit graph.",
            tipText: "<strong>Clickable Nodes:</strong> In the DAG above, you can click any circular dot <code>( )</code> to print its full cryptographic metadata to the terminal!",
            chips: ["git log --oneline --graph", "git log --oneline", "git log", "git status"],
            initialState: {
                config: { "user.name": "Jab", "user.email": "heythisisjab@gmail.com" },
                initialized: true,
                files: { "main.go": { status: "clean", content: "package main\n\nfunc main() {}" } },
                staged: {},
                commits: [
                    { id: "c0", hash: "9e3d8f1", message: "feat: init server", parents: [], branch: "main", author: "Jab <heythisisjab@gmail.com>" },
                    { id: "c1", hash: "4b2e61a", message: "feat: jwt auth", parents: ["c0"], branch: "feature/auth", author: "Jab <heythisisjab@gmail.com>" },
                    { id: "c2", hash: "1d49e52", message: "Merge feature/auth into main", parents: ["c0", "c1"], branch: "main", author: "Jab <heythisisjab@gmail.com>" }
                ],
                branches: { main: "c2", "feature/auth": "c1" },
                head: { type: "branch", target: "main" },
                remotes: {},
                stash: []
            },
            validate: function (state, lastCmd) {
                return lastCmd && lastCmd.includes("log");
            }
        },

        // ======================================================================
        // SLIDE 14: COMMAND: git remote (add, -v, get-url, set-url)
        // ======================================================================
        {
            id: 13,
            num: "14 / 18",
            badge: "[Remote Repositories]",
            title: "Command: git remote (add, -v, get-url, set-url)",
            bodyHtml: `
                <p>Git is completely distributed: your local repository can connect to one or more remote repositories hosted on GitHub, GitLab, or a private server.</p>
                <p><strong>Commands:</strong></p>
                <ul>
                    <li><code>git remote add &lt;name&gt; &lt;url&gt;</code>: Establishes a named connection to a remote server. By convention, the primary remote is named <code>origin</code>.</li>
                    <li><code>git remote -v</code>: Lists all configured remote connections with their fetch and push URLs.</li>
                    <li><code>git remote get-url &lt;name&gt;</code>: Retrieves the current URL for a remote.</li>
                    <li><code>git remote set-url &lt;name&gt; &lt;newurl&gt;</code>: Updates the URL of an existing remote.</li>
                </ul>
                <p>Connect your repository to GitHub using <code>git remote add origin https://github.com/jab/project.git</code> and verify with <code>git remote -v</code>!</p>
            `,
            goalText: "Run <code>git remote add origin https://github.com/jab/project.git</code> and verify with <code>git remote -v</code>.",
            tipText: "<strong>Configuration:</strong> Remotes are stored right inside <code>.git/config</code> under the section <code>[remote 'origin']</code>.",
            chips: ["git remote add origin https://github.com/jab/project.git", "git remote -v", "git remote get-url origin", "git remote set-url origin https://github.com/jab/repo.git"],
            initialState: {
                config: { "user.name": "Jab", "user.email": "heythisisjab@gmail.com" },
                initialized: true,
                files: { "main.go": { status: "clean", content: "package main\n\nfunc main() {}" } },
                staged: {},
                commits: [
                    { id: "c0", hash: "9e3d8f1", message: "feat: init server", parents: [], branch: "main", author: "Jab <heythisisjab@gmail.com>" }
                ],
                branches: { main: "c0" },
                head: { type: "branch", target: "main" },
                remotes: {},
                stash: []
            },
            validate: function (state, lastCmd) {
                return state.remotes && state.remotes["origin"] && lastCmd && (lastCmd.includes("remote -v") || lastCmd.includes("get-url") || lastCmd.includes("set-url"));
            }
        },

        // ======================================================================
        // SLIDE 15: COMMAND: git push
        // ======================================================================
        {
            id: 14,
            num: "15 / 18",
            badge: "[Publishing Snapshots]",
            title: "Command: git push",
            bodyHtml: `
                <p><code>git push</code> transfers your local commit objects and files to the remote server and updates the remote's branch pointers.</p>
                <p><strong>Syntax:</strong></p>
                <ul>
                    <li><code>git push -u &lt;remote&gt; &lt;branch&gt;</code>: Pushes the branch and sets the upstream tracking reference. Future pushes can simply be <code>git push</code>.</li>
                    <li><code>git push</code>: Pushes commits on the current branch to its configured upstream remote.</li>
                </ul>
                <p>Publish your local commits with <code>git push -u origin main</code> and watch the DAG update!</p>
            `,
            goalText: "Publish your branch with <code>git push -u origin main</code>.",
            tipText: "<strong>Remote Badge in DAG:</strong> As soon as you push, notice the purple <code>☁ origin/main</code> badge appears above your commit dot in the overview!",
            chips: ["git push -u origin main", "git push", "git remote -v", "git status"],
            initialState: {
                config: { "user.name": "Jab", "user.email": "heythisisjab@gmail.com" },
                initialized: true,
                files: { "main.go": { status: "clean", content: "package main\n\nfunc main() {}" } },
                staged: {},
                commits: [
                    { id: "c0", hash: "9e3d8f1", message: "feat: init server", parents: [], branch: "main", author: "Jab <heythisisjab@gmail.com>" }
                ],
                branches: { main: "c0" },
                head: { type: "branch", target: "main" },
                remotes: {
                    origin: { url: "https://github.com/jab/project.git", branches: {} }
                },
                stash: []
            },
            validate: function (state, lastCmd) {
                return state.remotes && state.remotes["origin"] && state.remotes["origin"].branches["main"] && lastCmd && lastCmd.includes("push");
            }
        },

        // ======================================================================
        // SLIDE 16: COMMAND: git fetch
        // ======================================================================
        {
            id: 15,
            num: "16 / 18",
            badge: "[Inspecting Upstream]",
            title: "Command: git fetch",
            bodyHtml: `
                <p><code>git fetch</code> downloads commits, files, and refs from a remote repository into your local object store <strong>without modifying your working tree or moving your active local branches</strong>.</p>
                <p>This makes <code>git fetch</code> 100% safe and non-destructive: it updates remote tracking branches like <code>origin/main</code> so you can inspect what teammates have published before deciding to merge.</p>
                <p>Run <code>git fetch origin</code> to download a teammate's new commit from the remote!</p>
            `,
            goalText: "Fetch upstream changes with <code>git fetch origin</code>.",
            tipText: "<strong>Visualizing Divergence:</strong> Look at the DAG above: <code>☁ origin/main</code> advances to commit <code>(C1)</code> while your local <code>⎇ main</code> remains safely parked at <code>(C0)</code>!",
            chips: ["git fetch origin", "git log --oneline", "git status"],
            initialState: {
                config: { "user.name": "Jab", "user.email": "heythisisjab@gmail.com" },
                initialized: true,
                files: { "main.go": { status: "clean", content: "package main\n\nfunc main() {}" } },
                staged: {},
                commits: [
                    { id: "c0", hash: "9e3d8f1", message: "feat: init server", parents: [], branch: "main", author: "Jab <heythisisjab@gmail.com>" }
                ],
                branches: { main: "c0" },
                head: { type: "branch", target: "main" },
                remotes: {
                    origin: { url: "https://github.com/jab/project.git", branches: { main: "c0" } }
                },
                upstreamCommits: [
                    { id: "c1", hash: "89a31bc", message: "feat: remote api endpoint", parents: ["c0"], branch: "main", author: "Colleague <colleague@dev.io>" }
                ],
                stash: []
            },
            validate: function (state, lastCmd) {
                return state.remotes && state.remotes["origin"] && state.remotes["origin"].branches["main"] === "c1" && lastCmd && lastCmd.includes("fetch");
            }
        },

        // ======================================================================
        // SLIDE 17: COMMAND: git pull
        // ======================================================================
        {
            id: 16,
            num: "17 / 18",
            badge: "[Synchronizing Changes]",
            title: "Command: git pull",
            bodyHtml: `
                <p><code>git pull</code> combines <code>git fetch</code> followed immediately by <code>git merge</code> into a single atomic workflow.</p>
                <p>It fetches the latest commits from the remote tracking branch (<code>origin/main</code>) and merges them directly into your current checked-out branch (<code>main</code>), fast-forwarding your files and branch pointer.</p>
                <p>Catch up your local repository by running <code>git pull origin main</code>!</p>
            `,
            goalText: "Synchronize upstream commits with <code>git pull origin main</code>.",
            tipText: "<strong>Fast-Forward:</strong> Your local branch pointer <code>⎇ main</code> and the remote badge <code>☁ origin/main</code> will now align at commit <code>(C1)</code>!",
            chips: ["git pull origin main", "git pull", "git log --oneline", "git status"],
            initialState: {
                config: { "user.name": "Jab", "user.email": "heythisisjab@gmail.com" },
                initialized: true,
                files: { "main.go": { status: "clean", content: "package main\n\nfunc main() {}" } },
                staged: {},
                commits: [
                    { id: "c0", hash: "9e3d8f1", message: "feat: init server", parents: [], branch: "main", author: "Jab <heythisisjab@gmail.com>" },
                    { id: "c1", hash: "89a31bc", message: "feat: remote api endpoint", parents: ["c0"], branch: "main", author: "Colleague <colleague@dev.io>" }
                ],
                branches: { main: "c0" },
                head: { type: "branch", target: "main" },
                remotes: {
                    origin: { url: "https://github.com/jab/project.git", branches: { main: "c1" } }
                },
                stash: []
            },
            validate: function (state, lastCmd) {
                return state.branches["main"] === "c1" && lastCmd && lastCmd.includes("pull");
            }
        },

        // ======================================================================
        // SLIDE 18: DISTRIBUTED MASTERY & FULL INTERACTIVE SANDBOX
        // ======================================================================
        {
            id: 17,
            num: "18 / 18",
            badge: "[Distributed Mastery Sandbox]",
            title: "Distributed Mastery & Full Interactive Sandbox",
            bodyHtml: `
                <p>Congratulations! You have mastered the full lifecycle of Git: from local genesis (<code>init</code>, <code>add</code>, <code>commit</code>) and branching (<code>branch</code>, <code>switch</code>, <code>merge</code>, <code>stash</code>) to distributed teamwork (<code>remote</code>, <code>push</code>, <code>fetch</code>, <code>pull</code>).</p>
                <p>This final slide is an unrestricted interactive laboratory. Create branches, push to remotes, stage files with <code>touch</code>, <code>echo</code>, <code>cat</code>, and view your commit topology.</p>
                <p>The 2D DAG at the top dynamically renders every branch, commit dot, directed arrow, and remote tracking badge in real time.</p>
            `,
            goalText: "Inspect your commit graph with <code>git log --oneline --graph</code>.",
            tipText: "<strong>Complete Freedom:</strong> Run any git command or shell command. Try creating multiple branches and pushing them!",
            chips: ["git log --oneline --graph", "git status", "git branch", "git remote -v", "echo \"// v2.0\" >> main.go", "git commit -am \"feat: v2.0\""],
            initialState: {
                config: { "user.name": "Jab", "user.email": "heythisisjab@gmail.com" },
                initialized: true,
                files: { "main.go": { status: "clean", content: "package main\n\nfunc main() {}" } },
                staged: {},
                commits: [
                    { id: "c0", hash: "9e3d8f1", message: "feat: init server", parents: [], branch: "main", author: "Jab <heythisisjab@gmail.com>" },
                    { id: "c1", hash: "89a31bc", message: "feat: remote api endpoint", parents: ["c0"], branch: "main", author: "Colleague <colleague@dev.io>" }
                ],
                branches: { main: "c1" },
                head: { type: "branch", target: "main" },
                remotes: {
                    origin: { url: "https://github.com/jab/project.git", branches: { main: "c1" } }
                },
                stash: []
            },
            validate: function (state, lastCmd) {
                return lastCmd && (lastCmd.includes("log") || lastCmd.includes("status"));
            }
        }
    ];

    // --- State Storage ---
    let currentSlideIdx = 0;
    let repoState = null;
    let cmdHistory = [];
    let historyCursor = -1;

    function deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    function getHeadCommit(state) {
        if (!state.commits || state.commits.length === 0) return null;
        const commitId = state.head.type === "branch" ? (state.branches ? state.branches[state.head.target] : null) : state.head.target;
        if (!commitId) return null;
        return state.commits.find(c => c.id === commitId) || null;
    }

    function generateHash() {
        return Math.random().toString(16).substring(2, 9);
    }

    // --- Slide Controller ---
    function loadSlide(idx) {
        if (idx < 0 || idx >= SLIDES.length) return;
        currentSlideIdx = idx;
        repoState = deepClone(SLIDES[idx].initialState);
        renderCurrentSlide();
        printTermWelcome();
    }

    // --- Dynamic Multi-Branch Dot-and-Arrow 2D DAG SVG Graph Renderer ---
    // Architecture:
    // ( )  ---> ( )  ---> ( )
    //             \
    //              \( )  ---> ( )
    function render2DDag() {
        const viewport = document.getElementById("gtDagViewport");
        if (!viewport) return;

        const commits = repoState.commits || [];

        // 0 Commits: Clean empty repository state
        if (commits.length === 0) {
            viewport.innerHTML = `
            <svg class="gt-dag-svg" width="100%" height="220" viewBox="0 0 860 220" xmlns="http://www.w3.org/2000/svg">
              <g class="gt-dag-empty">
                <rect x="230" y="70" width="400" height="80" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" stroke-dasharray="4 4" rx="0" />
                <text x="430" y="102" text-anchor="middle" font-family="'Cascadia Code', monospace" font-size="12" font-weight="700" fill="#94a3b8">
                  [ empty repository · no commits yet ]
                </text>
                <text x="430" y="124" text-anchor="middle" font-family="'Cascadia Code', monospace" font-size="10" fill="#64748b">
                  Create files, stage with 'git add', and commit to plant your first node ( )
                </text>
              </g>
            </svg>
            `;
            return;
        }

        // 1. Dynamic Branch Registry
        // Main is always row 0
        const branchList = ["main"];

        // Add any branches currently in repoState.branches
        for (const b of Object.keys(repoState.branches || {})) {
            if (!branchList.includes(b)) {
                branchList.push(b);
            }
        }

        // Add any branches recorded in commits
        commits.forEach(c => {
            if (c.branch && c.branch !== "detached" && !branchList.includes(c.branch)) {
                branchList.push(c.branch);
            }
        });

        // Vibrant Palette for any number of branches
        const BRANCH_PALETTE = [
            "#50fa7b", // 0 (main): Emerald green
            "#38bdf8", // 1: Sky blue
            "#bd93f9", // 2: Lavender / purple
            "#ffb86c", // 3: Orange / amber
            "#ff79c6", // 4: Pink
            "#8be9fd", // 5: Cyan
            "#f1fa8c", // 6: Yellow
            "#ff5555"  // 7: Coral red
        ];

        const branchRows = {};
        const branchColors = {};
        branchList.forEach((bName, idx) => {
            branchRows[bName] = idx;
            branchColors[bName] = BRANCH_PALETTE[idx % BRANCH_PALETTE.length];
        });

        // 2. Compute columns topologically based on parents
        const commitCols = {};
        commits.forEach(c => {
            if (!c.parents || c.parents.length === 0) {
                commitCols[c.id] = 0;
            } else {
                let maxParentCol = -1;
                c.parents.forEach(pId => {
                    const pCol = commitCols[pId] !== undefined ? commitCols[pId] : 0;
                    if (pCol > maxParentCol) maxParentCol = pCol;
                });
                commitCols[c.id] = maxParentCol + 1;
            }
        });

        // Resolve collisions on the same row & column
        const laneColCounts = {};
        commits.forEach(c => {
            const bKey = c.branch || "main";
            let col = commitCols[c.id];
            while (laneColCounts[`${bKey}-${col}`]) {
                col++;
            }
            commitCols[c.id] = col;
            laneColCounts[`${bKey}-${col}`] = true;
        });

        // 3. Dynamic Vertical Row Coordinates
        const startY = 75;
        const rowHeight = 72;
        function getRowY(rowIdx) {
            return startY + rowIdx * rowHeight;
        }

        const totalRows = Math.max(1, branchList.length);
        const svgHeight = Math.max(240, startY + totalRows * rowHeight + 35);

        // Layout spacing
        const nodeR = 19;
        const startX = 140;
        const colSpacing = 145;
        let maxCol = 0;
        Object.values(commitCols).forEach(c => { if (c > maxCol) maxCol = c; });

        const svgWidth = Math.max(860, startX + (maxCol + 1) * colSpacing + 120);

        // Precompute coordinates
        const coords = {};
        commits.forEach(c => {
            const bName = c.branch || "main";
            let rowIdx = branchRows[bName];
            if (rowIdx === undefined) {
                rowIdx = branchList.length; // detached row
            }
            const col = commitCols[c.id] || 0;
            coords[c.id] = {
                x: startX + col * colSpacing,
                y: getRowY(rowIdx),
                rowIdx: rowIdx,
                bName: bName,
                color: branchColors[bName] || "#ff79c6"
            };
        });

        // 4. Generate SVG with Dynamic Defs & Guidelines
        let svgHtml = `
        <svg class="gt-dag-svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="dot-arrow-merge" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ff79c6" />
            </marker>
            <marker id="dot-arrow-detached" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ff79c6" />
            </marker>
            <marker id="dot-arrow-default" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#bd93f9" />
            </marker>
        `;

        // Dynamic markers for each branch
        branchList.forEach((bName, idx) => {
            const color = branchColors[bName];
            const safeBId = bName.replace(/[^a-zA-Z0-9]/g, "_");
            svgHtml += `
            <marker id="dot-arrow-${safeBId}" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="${color}" />
            </marker>
            `;
        });

        svgHtml += `</defs>`;

        // Render Dynamic Track Guidelines & Left Branch Station Labels
        branchList.forEach((bName, idx) => {
            const y = getRowY(idx);
            const color = branchColors[bName];
            svgHtml += `
            <line x1="85" y1="${y}" x2="${svgWidth - 20}" y2="${y}" stroke="${color}" stroke-opacity="0.12" stroke-width="1" stroke-dasharray="3 4" />
            <g class="gt-dot-lane-lbl">
              <circle cx="22" cy="${y}" r="4" fill="${color}" />
              <text x="34" y="${y}" fill="${color}" font-family="'Cascadia Code', monospace" font-size="11" font-weight="700" dominant-baseline="central">⎇ ${escapeXml(bName)}</text>
            </g>
            `;
        });

        // 5. Draw Directed Arrows ---> between circle nodes ( )
        commits.forEach(c => {
            const child = coords[c.id];
            if (!child || !c.parents) return;

            c.parents.forEach((pId, pIdx) => {
                const parent = coords[pId];
                if (!parent) return;

                const isMergeEdge = pIdx > 0 || (c.parents.length > 1 && parent.rowIdx !== child.rowIdx);
                const safeBId = child.bName.replace(/[^a-zA-Z0-9]/g, "_");
                const markerId = isMergeEdge ? "dot-arrow-merge" : `dot-arrow-${safeBId}`;
                const arrowColor = isMergeEdge ? "#ff79c6" : child.color;

                if (parent.y === child.y) {
                    // Straight horizontal arrow: ( ) ---> ( )
                    const x1 = parent.x + nodeR + 2;
                    const y1 = parent.y;
                    const x2 = child.x - nodeR - 6;
                    const y2 = child.y;

                    svgHtml += `
                    <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                          stroke="${arrowColor}" stroke-width="2.5" marker-end="url(#${markerId})" opacity="0.95" />
                    `;
                } else {
                    // Branching / Merging angled arrow:
                    // \ ( ) --->
                    const isBranchingDown = child.y > parent.y;
                    const x1 = parent.x + 13;
                    const y1 = parent.y + (isBranchingDown ? 13 : -13);
                    const x2 = child.x - nodeR - 6;
                    const y2 = child.y;

                    const dx = (x2 - x1) * 0.5;
                    const cx1 = x1 + dx * 0.6;
                    const cy1 = y1 + (y2 - y1) * 0.3;
                    const cx2 = x1 + dx;
                    const cy2 = y2;

                    const pathData = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

                    svgHtml += `
                    <path d="${pathData}" stroke="${arrowColor}" stroke-width="2.5" fill="none"
                          marker-end="url(#${markerId})" opacity="0.95" />
                    `;
                }
            });
        });

        // 6. Draw Circular Dot Nodes ( ) & Commit Info
        const headCommit = getHeadCommit(repoState);

        commits.forEach(c => {
            const pt = coords[c.id];
            if (!pt) return;

            const isHead = headCommit && headCommit.id === c.id;
            const isMerge = c.parents && c.parents.length >= 2;
            const nodeClass = `gt-dot-circle ${isHead ? "dot-head" : ""} ${isMerge ? "dot-merge" : ""}`;

            // Node group
            svgHtml += `
            <g class="gt-dot-node" data-commit-id="${c.id}" style="cursor:pointer;">
            `;

            // Active HEAD pulsing ring
            if (isHead) {
                svgHtml += `
                <circle cx="${pt.x}" cy="${pt.y}" r="26" fill="none" stroke="#ff79c6" stroke-width="2" stroke-dasharray="3 3" opacity="0.85" />
                `;
            }

            // Circle Node ( )
            const tooltip = escapeXml(`${c.id.toUpperCase()}: ${c.hash}\n${c.message}\nAuthor: ${c.author}`);

            if (isMerge) {
                svgHtml += `
                <circle cx="${pt.x}" cy="${pt.y}" r="${nodeR}" fill="#1b1226" stroke="#ff79c6" stroke-width="2.5" class="${nodeClass}">
                  <title>${tooltip}</title>
                </circle>
                `;
            } else {
                svgHtml += `
                <circle cx="${pt.x}" cy="${pt.y}" r="${nodeR}" fill="#0d1217" stroke="${pt.color}" stroke-width="2.5" class="${nodeClass}">
                  <title>${tooltip}</title>
                </circle>
                `;
            }

            // Text inside ( ): C0, C1, C2...
            svgHtml += `
              <text x="${pt.x}" y="${pt.y}" class="gt-dot-id" dominant-baseline="central" text-anchor="middle" fill="#ffffff">${escapeXml(c.id.toUpperCase())}</text>
            `;

            // Commit Hash & Message Below ( )
            const cleanMsg = c.message.length > 17 ? c.message.substring(0, 15) + "…" : c.message;
            svgHtml += `
              <text x="${pt.x}" y="${pt.y + 30}" class="gt-dot-hash" text-anchor="middle" dominant-baseline="central">${escapeXml(c.hash)}</text>
              <text x="${pt.x}" y="${pt.y + 44}" class="gt-dot-msg" text-anchor="middle" dominant-baseline="central">${escapeXml(cleanMsg)}</text>
            </g>
            `;

            // Branch Badges Above ( )
            let badgeOffsetY = -29;

            for (const [bName, targetCommitId] of Object.entries(repoState.branches || {})) {
                if (targetCommitId === c.id) {
                    const bText = `⎇ ${bName}`;
                    const bWidth = Math.max(58, bText.length * 7 + 14);
                    const pillBorder = branchColors[bName] || "#50fa7b";

                    svgHtml += `
                    <g class="gt-dot-badge">
                      <rect x="${pt.x - bWidth / 2}" y="${pt.y + badgeOffsetY - 8}" width="${bWidth}" height="17" rx="3"
                            fill="rgba(0,0,0,0.6)" stroke="${pillBorder}" stroke-width="1.2" />
                      <text x="${pt.x}" y="${pt.y + badgeOffsetY}" dominant-baseline="central" text-anchor="middle"
                            fill="${pillBorder}" font-family="'Cascadia Code', monospace" font-size="9.5" font-weight="700">${escapeXml(bText)}</text>
                    </g>
                    `;
                    badgeOffsetY -= 21;
                }
            }

            // Remote Tracking Badges Above ( )
            if (repoState.remotes) {
                for (const [rName, rData] of Object.entries(repoState.remotes)) {
                    for (const [rBranch, targetCommitId] of Object.entries(rData.branches || {})) {
                        if (targetCommitId === c.id) {
                            const rText = `☁ ${rName}/${rBranch}`;
                            const rWidth = Math.max(68, rText.length * 6.5 + 14);

                            svgHtml += `
                            <g class="gt-dot-badge">
                              <rect x="${pt.x - rWidth / 2}" y="${pt.y + badgeOffsetY - 8}" width="${rWidth}" height="17" rx="3"
                                    fill="rgba(18, 12, 31, 0.85)" stroke="#bd93f9" stroke-width="1.2" />
                              <text x="${pt.x}" y="${pt.y + badgeOffsetY}" dominant-baseline="central" text-anchor="middle"
                                    fill="#bd93f9" font-family="'Cascadia Code', monospace" font-size="9" font-weight="700">${escapeXml(rText)}</text>
                            </g>
                            `;
                            badgeOffsetY -= 21;
                        }
                    }
                }
            }

            // HEAD Badge Above ( )
            if (headCommit && headCommit.id === c.id) {
                const headText = repoState.head.type === "branch" ? "HEAD" : "HEAD (detached)";
                const hWidth = Math.max(48, headText.length * 7 + 12);
                svgHtml += `
                <g class="gt-dot-badge">
                  <rect x="${pt.x - hWidth / 2}" y="${pt.y + badgeOffsetY - 8}" width="${hWidth}" height="16" rx="3"
                        fill="#2c0b20" stroke="#ff79c6" stroke-width="1.2" />
                  <text x="${pt.x}" y="${pt.y + badgeOffsetY}" dominant-baseline="central" text-anchor="middle"
                        fill="#ff79c6" font-family="'Cascadia Code', monospace" font-size="9" font-weight="700">${headText}</text>
                </g>
                `;
            }
        });

        svgHtml += `</svg>`;
        viewport.innerHTML = svgHtml;

        // Click on dot node prints details to terminal
        viewport.querySelectorAll(".gt-dot-node").forEach(group => {
            group.addEventListener("click", () => {
                const cId = group.getAttribute("data-commit-id");
                const target = repoState.commits.find(c => c.id === cId);
                if (target) {
                    printTermHtml(`<span style="color:#f1fa8c">Commit ${target.hash} (${target.id.toUpperCase()})</span>`, "output-info");
                    printTerm(`Author:  ${target.author}`);
                    printTerm(`Branch:  ${target.branch}`);
                    printTerm(`Parents: ${target.parents && target.parents.length ? target.parents.join(", ") : "(root)"}`);
                    printTerm(`Message: ${target.message}`);
                }
            });
        });
    }

    // --- Terminal Engine ---
    function printTerm(text, className = "output-text") {
        const screen = document.getElementById("gtTermScreen");
        if (!screen) return;
        const line = document.createElement("div");
        line.className = `gt-term-line ${className}`;
        line.textContent = text;
        screen.appendChild(line);
        screen.scrollTop = screen.scrollHeight;
    }

    function printTermHtml(html, className = "output-text") {
        const screen = document.getElementById("gtTermScreen");
        if (!screen) return;
        const line = document.createElement("div");
        line.className = `gt-term-line ${className}`;
        line.innerHTML = html;
        screen.appendChild(line);
        screen.scrollTop = screen.scrollHeight;
    }

    function clearTerm() {
        const screen = document.getElementById("gtTermScreen");
        if (screen) screen.innerHTML = "";
    }

    function printTermWelcome() {
        clearTerm();
        const s = SLIDES[currentSlideIdx];
        printTermHtml(`<span style="color:var(--link-color);font-weight:700;">[ Jab's Git Workbench · ${s.num}: ${s.title} ]</span>`, "cmd-echo");
        printTerm(`Type commands or tap quick action chips below. Watch the DAG above update reactively.`, "output-info");
        printTerm(`You can use touch, echo > file, cat, ls, rm, and git commands.`, "output-muted");
        printTerm(`---------------------------------------------------------------------------------`, "output-muted");
    }

    // --- Shell Commands: touch, echo, cat, ls, rm ---
    function handleShellCommand(rawInput) {
        const input = rawInput.trim();

        // 1. Redirection: echo "text" > file or echo "text" >> file
        if (input.includes(">")) {
            const isAppend = input.includes(">>");
            const parts = input.split(isAppend ? ">>" : ">");
            const cmdPart = parts[0].trim();
            const filePart = parts[1].trim();

            if (cmdPart.startsWith("echo")) {
                let text = cmdPart.slice(4).trim();
                if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
                    text = text.slice(1, -1);
                }

                if (!repoState.files[filePart]) {
                    repoState.files[filePart] = { content: text, status: "untracked" };
                    printTerm(`Created and wrote to '${filePart}'.`, "output-success");
                } else {
                    if (isAppend) {
                        repoState.files[filePart].content += (repoState.files[filePart].content ? "\n" : "") + text;
                    } else {
                        repoState.files[filePart].content = text;
                    }
                    if (repoState.files[filePart].status !== "untracked") {
                        repoState.files[filePart].status = "modified";
                    }
                    printTerm(`Updated '${filePart}'.`, "output-success");
                }
                return true;
            }
        }

        // 2. Pure echo: echo "text"
        if (input.startsWith("echo ")) {
            let text = input.slice(5).trim();
            if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
                text = text.slice(1, -1);
            }
            printTerm(text, "output-text");
            return true;
        }

        // 3. touch <file...>
        if (input.startsWith("touch ")) {
            const files = input.slice(6).trim().split(/\s+/);
            files.forEach(f => {
                if (!f) return;
                if (!repoState.files[f]) {
                    repoState.files[f] = { content: "", status: "untracked" };
                    printTerm(`Created file '${f}'.`, "output-success");
                } else {
                    if (repoState.files[f].status !== "untracked") {
                        repoState.files[f].status = "modified";
                    }
                    printTerm(`Updated timestamp for '${f}'.`, "output-muted");
                }
            });
            return true;
        }

        // 4. cat <file>
        if (input.startsWith("cat ")) {
            const f = input.slice(4).trim();
            if (repoState.files[f]) {
                printTerm(repoState.files[f].content || "(empty file)", "output-text");
            } else {
                printTerm(`cat: ${f}: No such file or directory`, "output-error");
            }
            return true;
        }

        // 5. ls / ls -la
        if (input === "ls" || input.startsWith("ls ")) {
            const list = Object.keys(repoState.files);
            if (!list.length) {
                printTerm("(empty directory)", "output-muted");
            } else {
                list.forEach(f => {
                    const st = repoState.files[f].status;
                    const color = st === "untracked" ? "#ff5555" : (st === "modified" ? "#ffb86c" : "#50fa7b");
                    printTermHtml(`<span style="color:${color}">${f}</span>   <span style="color:var(--muted-color);font-size:0.75rem;">[${st}]</span>`);
                });
            }
            return true;
        }

        // 6. rm <file>
        if (input.startsWith("rm ")) {
            const f = input.slice(3).trim();
            if (repoState.files[f]) {
                delete repoState.files[f];
                delete repoState.staged[f];
                printTerm(`Removed '${f}'.`, "output-warn");
            } else {
                printTerm(`rm: cannot remove '${f}': No such file or directory`, "output-error");
            }
            return true;
        }

        // 7. pwd
        if (input === "pwd") {
            printTerm("/home/jab/repo", "output-text");
            return true;
        }

        return false;
    }

    // --- Command Processing ---
    function executeCommand(rawInput) {
        const input = rawInput.trim();
        if (!input) return;

        cmdHistory.push(input);
        historyCursor = cmdHistory.length;

        let branchDisplay = "";
        if (!repoState.initialized) {
            branchDisplay = "uninitialized";
        } else if (repoState.head.type === "branch") {
            branchDisplay = repoState.head.target;
        } else {
            branchDisplay = `detached:${repoState.head.target}`;
        }
        printTermHtml(`<span style="color:var(--link-color)">jab@workbench</span>:<span style="color:#8be9fd">~/repo</span> (<span style="color:#ff79c6">${branchDisplay}</span>) $ ${escapeHtml(input)}`, "cmd-echo");

        // Handle shell utilities first (touch, echo, cat, ls, rm, pwd, clear)
        if (input === "clear") {
            clearTerm();
            return;
        }

        if (input === "help") {
            handleGitHelp();
            return;
        }

        if (handleShellCommand(input)) {
            checkSlideGoal(input);
            renderCurrentSlide();
            return;
        }

        // Must be a git command
        const tokens = input.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
        const cleanTokens = tokens.map(t => t.replace(/^['"]|['"]$/g, ""));
        const base = cleanTokens[0];

        if (base !== "git") {
            printTerm(`zsh: command not found: ${base}. (Use git, touch, echo, cat, ls, rm, clear)`, "output-error");
            return;
        }

        const sub = cleanTokens[1];
        const args = cleanTokens.slice(2);

        // Enforce git init
        if (!repoState.initialized && sub !== "init" && sub !== "help" && sub !== "--help" && sub !== "version" && sub !== "--version") {
            printTerm("fatal: not a git repository (or any of the parent directories): .git", "output-error");
            printTerm("Hint: Run 'git init' to initialize a new Git repository.", "output-muted");
            return;
        }

        switch (sub) {
            case "init":
                handleGitInit(args);
                break;
            case "status":
                handleGitStatus();
                break;
            case "add":
                handleGitAdd(args);
                break;
            case "commit":
                handleGitCommit(args);
                break;
            case "branch":
                handleGitBranch(args);
                break;
            case "checkout":
                handleGitCheckout(args);
                break;
            case "switch":
                handleGitSwitch(args);
                break;
            case "merge":
                handleGitMerge(args);
                break;
            case "log":
                handleGitLog(args);
                break;
            case "diff":
                handleGitDiff(args);
                break;
            case "restore":
                handleGitRestore(args);
                break;
            case "reset":
                handleGitReset(args);
                break;
            case "stash":
                handleGitStash(args);
                break;
            case "config":
                handleGitConfig(args);
                break;
            case "remote":
                handleGitRemote(args);
                break;
            case "push":
                handleGitPush(args);
                break;
            case "fetch":
                handleGitFetch(args);
                break;
            case "pull":
                handleGitPull(args);
                break;
            case "help":
            case "--help":
                handleGitHelp();
                break;
            default:
                if (!sub) {
                    printTerm(`usage: git [--version] [--help] <command> [<args>]`, "output-muted");
                } else {
                    printTerm(`git: '${sub}' is not a recognized command. See 'git help'.`, "output-error");
                }
                break;
        }

        checkSlideGoal(input);
        renderCurrentSlide();
    }

    // --- Subcommands ---
    function handleGitInit(args) {
        if (repoState.initialized) {
            printTerm("Reinitialized existing Git repository in /home/jab/repo/.git/", "output-muted");
            return;
        }
        repoState.initialized = true;
        repoState.branches = {};
        repoState.head = { type: "branch", target: "main" };
        printTerm("Initialized empty Git repository in /home/jab/repo/.git/", "output-success");
    }

    function handleGitStatus() {
        if (!repoState.initialized) {
            printTerm("fatal: not a git repository (or any of the parent directories): .git", "output-error");
            return;
        }

        const branchDisplay = repoState.head.type === "branch" ? repoState.head.target : `detached at ${repoState.head.target}`;
        printTerm(`On branch ${branchDisplay}`, "output-text");

        if (!repoState.commits || repoState.commits.length === 0) {
            printTerm("");
            printTerm("No commits yet", "output-muted");
            printTerm("");
        }

        const stagedKeys = Object.keys(repoState.staged);
        const modifiedUnstaged = [];
        const untracked = [];

        for (const [name, f] of Object.entries(repoState.files)) {
            if (f.status === "untracked" && !repoState.staged[name]) {
                untracked.push(name);
            } else if (f.status === "modified" && !repoState.staged[name]) {
                modifiedUnstaged.push(name);
            }
        }

        if (stagedKeys.length > 0) {
            printTerm("Changes to be committed:", "output-text");
            printTerm(`  (use "git restore --staged <file>..." to unstage)`, "output-muted");
            stagedKeys.forEach(f => {
                const label = repoState.files[f] ? "modified" : "new file";
                printTermHtml(`\t<span style="color:#50fa7b">${label}:   ${f}</span>`);
            });
            printTerm("");
        }

        if (modifiedUnstaged.length > 0) {
            printTerm("Changes not staged for commit:", "output-text");
            printTerm(`  (use "git add <file>..." to update what will be committed)`, "output-muted");
            printTerm(`  (use "git restore <file>..." to discard changes in working directory)`, "output-muted");
            modifiedUnstaged.forEach(f => {
                printTermHtml(`\t<span style="color:#ff5555">modified:   ${f}</span>`);
            });
            printTerm("");
        }

        if (untracked.length > 0) {
            printTerm("Untracked files:", "output-text");
            printTerm(`  (use "git add <file>..." to include in what will be committed)`, "output-muted");
            untracked.forEach(f => {
                printTermHtml(`\t<span style="color:#ff5555">${f}</span>`);
            });
            printTerm("");
        }

        if (stagedKeys.length === 0 && modifiedUnstaged.length === 0 && untracked.length === 0) {
            if (!repoState.commits || repoState.commits.length === 0) {
                printTerm("nothing to commit (create/copy files and use \"git add\" to track)", "output-text");
            } else {
                printTerm("nothing to commit, working tree clean", "output-text");
            }
        }
    }

    function handleGitAdd(args) {
        if (!args.length) {
            printTerm("Nothing specified, nothing added.\nMaybe you wanted to say 'git add .'?", "output-error");
            return;
        }

        const target = args[0];
        if (target === "." || target === "-A" || target === "--all") {
            let count = 0;
            for (const [name, f] of Object.entries(repoState.files)) {
                if (f.status !== "clean") {
                    repoState.staged[name] = { content: f.content };
                    count++;
                }
            }
            printTerm(`Staged ${count} file(s).`, "output-success");
            return;
        }

        if (repoState.files[target]) {
            repoState.staged[target] = { content: repoState.files[target].content };
            printTerm(`Staged '${target}'.`, "output-success");
        } else {
            printTerm(`fatal: pathspec '${target}' did not match any files`, "output-error");
        }
    }

    function handleGitCommit(args) {
        const stagedKeys = Object.keys(repoState.staged);
        if (stagedKeys.length === 0) {
            printTerm("no changes added to commit (use \"git add\")", "output-warn");
            return;
        }

        let msg = "update";
        const mIdx = args.indexOf("-m");
        if (mIdx !== -1 && args[mIdx + 1]) {
            msg = args[mIdx + 1];
        } else if (args[0] && !args[0].startsWith("-")) {
            msg = args.join(" ");
        }

        const parentCommit = getHeadCommit(repoState);
        const newId = `c${repoState.commits.length}`;
        const newHash = generateHash();
        const activeBranch = repoState.head.type === "branch" ? repoState.head.target : "detached";

        const newCommit = {
            id: newId,
            hash: newHash,
            message: msg,
            parents: parentCommit ? [parentCommit.id] : [],
            branch: activeBranch,
            author: "Jab <heythisisjab@gmail.com>",
            timestamp: new Date().toISOString().substring(11, 19)
        };

        repoState.commits.push(newCommit);

        if (repoState.head.type === "branch") {
            repoState.branches[repoState.head.target] = newId;
        } else {
            repoState.head.target = newId;
        }

        stagedKeys.forEach(f => {
            if (repoState.files[f]) repoState.files[f].status = "clean";
        });
        repoState.staged = {};

        if (!parentCommit) {
            printTerm(`[${activeBranch} (root-commit) ${newHash}] ${msg}`, "output-success");
        } else {
            printTerm(`[${activeBranch} ${newHash}] ${msg}`, "output-success");
        }
        printTerm(` ${stagedKeys.length} file(s) changed, snapshot recorded in 2D DAG.`, "output-muted");
    }

    function handleGitBranch(args) {
        if (!args.length || args[0] === "--list" || args[0] === "-a") {
            if (!repoState.commits || repoState.commits.length === 0) {
                printTerm("(no branches exist yet; create your first commit on 'main')", "output-muted");
                return;
            }
            for (const [name, cId] of Object.entries(repoState.branches)) {
                const isActive = repoState.head.type === "branch" && repoState.head.target === name;
                if (isActive) {
                    printTermHtml(`* <span style="color:#50fa7b;font-weight:700;">${name}</span>`);
                } else {
                    printTerm(`  ${name}`);
                }
            }
            return;
        }

        // Delete branch: git branch -d / -D
        if (args[0] === "-d" || args[0] === "-D") {
            const toDelete = args[1];
            if (!toDelete) {
                printTerm("fatal: branch name required", "output-error");
                return;
            }
            if (toDelete === "main") {
                printTerm("error: Cannot delete branch 'main'.", "output-error");
                return;
            }
            if (repoState.head.type === "branch" && repoState.head.target === toDelete) {
                printTerm(`error: Cannot delete the branch '${toDelete}' which you are currently on.`, "output-error");
                return;
            }
            if (repoState.branches[toDelete]) {
                delete repoState.branches[toDelete];
                printTerm(`Deleted branch ${toDelete}.`, "output-success");
            } else {
                printTerm(`error: branch '${toDelete}' not found.`, "output-error");
            }
            return;
        }

        const bName = args[0];
        if (repoState.branches[bName]) {
            printTerm(`fatal: A branch named '${bName}' already exists.`, "output-error");
            return;
        }

        const headCommit = getHeadCommit(repoState);
        if (!headCommit) {
            printTerm(`fatal: not a valid object name: 'main'`, "output-error");
            printTerm("Hint: You must make at least one commit before creating branches.", "output-muted");
            return;
        }

        repoState.branches[bName] = headCommit.id;
        printTerm(`Created branch '${bName}' pointing to ${headCommit.hash}.`, "output-success");
    }

    function handleGitCheckout(args) {
        if (!args.length) {
            printTerm("fatal: specify branch or commit to check out.", "output-error");
            return;
        }

        if (args[0] === "-b" && args[1]) {
            const bName = args[1];
            const headCommit = getHeadCommit(repoState);
            if (!headCommit) {
                printTerm(`fatal: not a valid object name: 'main'`, "output-error");
                return;
            }
            repoState.branches[bName] = headCommit.id;
            repoState.head = { type: "branch", target: bName };
            printTerm(`Switched to a new branch '${bName}'`, "output-success");
            return;
        }

        const target = args[0];
        if (repoState.branches[target]) {
            repoState.head = { type: "branch", target };
            printTerm(`Switched to branch '${target}'`, "output-success");
            return;
        }

        const commit = repoState.commits.find(c => c.hash.startsWith(target) || c.id === target);
        if (commit) {
            repoState.head = { type: "commit", target: commit.id };
            printTerm(`Note: switching to '${target}'.\nYou are in 'detached HEAD' state at ${commit.hash}.`, "output-warn");
            printTerm(`HEAD is now at ${commit.hash} ${commit.message}`, "output-info");
            return;
        }

        printTerm(`error: pathspec '${target}' did not match any file(s) or branch known to git`, "output-error");
    }

    function handleGitSwitch(args) {
        if (!args.length) {
            printTerm("fatal: missing branch name", "output-error");
            return;
        }

        if ((args[0] === "-c" || args[0] === "-C") && args[1]) {
            const bName = args[1];
            const headCommit = getHeadCommit(repoState);
            if (!headCommit) {
                printTerm(`fatal: not a valid object name: 'main'`, "output-error");
                return;
            }
            repoState.branches[bName] = headCommit.id;
            repoState.head = { type: "branch", target: bName };
            printTerm(`Switched to a new branch '${bName}'`, "output-success");
            return;
        }

        const bName = args[0];
        if (repoState.branches[bName]) {
            repoState.head = { type: "branch", target: bName };
            printTerm(`Switched to branch '${bName}'`, "output-success");
        } else {
            printTerm(`fatal: invalid reference: ${bName}`, "output-error");
        }
    }

    function handleGitMerge(args) {
        if (!args.length) {
            printTerm("fatal: No branch specified to merge.", "output-error");
            return;
        }

        const targetBranch = args[0];
        if (!repoState.branches[targetBranch]) {
            printTerm(`merge: ${targetBranch} - not something we can merge`, "output-error");
            return;
        }

        if (repoState.head.type === "branch" && repoState.head.target === targetBranch) {
            printTerm("Already up to date.", "output-text");
            return;
        }

        const currentHeadCommit = getHeadCommit(repoState);
        const targetCommitId = repoState.branches[targetBranch];
        const targetCommit = repoState.commits.find(c => c.id === targetCommitId);

        let ancestor = targetCommit;
        let isAncestor = false;
        while (ancestor && ancestor.parents && ancestor.parents.length) {
            if (ancestor.parents.includes(currentHeadCommit.id)) {
                isAncestor = true;
                break;
            }
            ancestor = repoState.commits.find(c => c.id === ancestor.parents[0]);
        }

        if (isAncestor) {
            repoState.branches[repoState.head.target] = targetCommit.id;
            printTerm(`Updating ${currentHeadCommit.hash}..${targetCommit.hash}`, "output-info");
            printTerm(`Fast-forward merge successful.`, "output-success");
        } else {
            const newId = `c${repoState.commits.length}`;
            const newHash = generateHash();
            const mergeCommit = {
                id: newId,
                hash: newHash,
                message: `Merge branch '${targetBranch}' into ${repoState.head.target}`,
                parents: [currentHeadCommit.id, targetCommit.id],
                branch: repoState.head.target,
                lane: 1,
                author: "Jab <heythisisjab@gmail.com>",
                timestamp: new Date().toISOString().substring(11, 19)
            };
            repoState.commits.push(mergeCommit);
            repoState.branches[repoState.head.target] = newId;
            printTerm(`Merge made by the 'ort' strategy.`, "output-info");
            printTerm(`Created 3-way merge commit [${newHash}] with 2 parents!`, "output-success");
        }
    }

    function handleGitLog(args) {
        const isOneLine = args.includes("--oneline");
        const list = [...repoState.commits].reverse();

        list.forEach(c => {
            if (isOneLine) {
                let decs = [];
                for (const [b, commitId] of Object.entries(repoState.branches)) {
                    if (commitId === c.id) {
                        if (repoState.head.type === "branch" && repoState.head.target === b) {
                            decs.push(`<span style="color:#ff79c6;font-weight:700;">HEAD -> </span><span style="color:#50fa7b;">${b}</span>`);
                        } else {
                            decs.push(`<span style="color:#50fa7b;">${b}</span>`);
                        }
                    }
                }
                const decStr = decs.length ? ` (${decs.join(", ")})` : "";
                printTermHtml(`<span style="color:#f1fa8c">${c.hash}</span>${decStr} ${escapeHtml(c.message)}`);
            } else {
                printTermHtml(`<span style="color:#f1fa8c">commit ${c.hash}</span>`);
                printTerm(`Author: ${c.author}`);
                printTerm(`Parents: ${c.parents.join(", ") || "(root)"}`);
                printTerm(`\n    ${c.message}\n`);
            }
        });
    }

    function handleGitDiff(args) {
        const isStaged = args.includes("--staged") || args.includes("--cached");
        if (isStaged) {
            const stagedKeys = Object.keys(repoState.staged);
            if (!stagedKeys.length) {
                printTerm("(No changes staged for commit)", "output-muted");
                return;
            }
            stagedKeys.forEach(f => {
                printTermHtml(`<span style="color:#fff;font-weight:700;">diff --git a/${f} b/${f}</span>`);
                printTermHtml(`<span style="color:#50fa7b;">+ // staged snapshot lines</span>`);
            });
        } else {
            let found = false;
            for (const [name, f] of Object.entries(repoState.files)) {
                if (f.status === "modified" && !repoState.staged[name]) {
                    found = true;
                    printTermHtml(`<span style="color:#fff;font-weight:700;">diff --git b/${name}</span>`);
                    printTermHtml(`<span style="color:#ff5555;">- // old content</span>`);
                    printTermHtml(`<span style="color:#50fa7b;">+ // modified working tree lines</span>`);
                }
            }
            if (!found) {
                printTerm("(No unstaged changes in working tree)", "output-muted");
            }
        }
    }

    function handleGitRestore(args) {
        if (!args.length) {
            printTerm("fatal: specify path(s) to restore", "output-error");
            return;
        }

        if (args[0] === "--staged" && args[1]) {
            const target = args[1];
            if (repoState.staged[target]) {
                delete repoState.staged[target];
                printTerm(`Unstaged '${target}'.`, "output-success");
            } else {
                printTerm(`pathspec '${target}' not staged`, "output-warn");
            }
            return;
        }

        const target = args[0];
        if (repoState.files[target]) {
            repoState.files[target].status = "clean";
            printTerm(`Discarded working tree changes in '${target}'.`, "output-success");
        } else {
            printTerm(`fatal: pathspec '${target}' did not match any files`, "output-error");
        }
    }

    function handleGitReset(args) {
        if (!args.length) {
            repoState.staged = {};
            printTerm("Unstaged all changes.", "output-success");
            return;
        }

        const target = args[0];
        if (repoState.staged[target]) {
            delete repoState.staged[target];
            printTerm(`Unstaged '${target}'.`, "output-success");
            return;
        }

        printTerm(`Resetting: ${target}`, "output-muted");
    }

    function handleGitStash(args) {
        const sub = args[0];
        if (!sub || sub === "push") {
            const modified = Object.entries(repoState.files).filter(([k, v]) => v.status !== "clean");
            if (!modified.length && !Object.keys(repoState.staged).length) {
                printTerm("No local changes to save", "output-muted");
                return;
            }

            const stashEntry = {
                id: repoState.stash.length,
                branch: repoState.head.type === "branch" ? repoState.head.target : "detached",
                files: deepClone(repoState.files),
                staged: deepClone(repoState.staged)
            };
            repoState.stash.push(stashEntry);

            for (const [name, f] of Object.entries(repoState.files)) {
                f.status = "clean";
            }
            repoState.staged = {};

            printTerm(`Saved working directory and index state WIP on ${stashEntry.branch}`, "output-success");
            return;
        }

        if (sub === "list") {
            if (!repoState.stash.length) {
                printTerm("(Stash is empty)", "output-muted");
                return;
            }
            repoState.stash.slice().reverse().forEach((s, idx) => {
                printTerm(`stash@{${idx}}: WIP on ${s.branch}`, "output-info");
            });
            return;
        }

        if (sub === "pop") {
            if (!repoState.stash.length) {
                printTerm("error: No stash entries found.", "output-error");
                return;
            }
            const popped = repoState.stash.pop();
            repoState.files = deepClone(popped.files);
            repoState.staged = deepClone(popped.staged);
            printTerm(`Restored working directory from stash@{0}. Dropped stash entry.`, "output-success");
            return;
        }

        printTerm(`git stash: '${sub}' unknown option.`, "output-error");
    }

    function handleGitConfig(args) {
        if (!args.length || args.includes("--list") || args.includes("-l")) {
            for (const [k, v] of Object.entries(repoState.config)) {
                printTerm(`${k}=${v}`, "output-text");
            }
            return;
        }
        printTerm(`Config options set.`, "output-success");
    }

    function handleGitRemote(args) {
        if (!args.length) {
            if (!repoState.remotes || Object.keys(repoState.remotes).length === 0) {
                printTerm("(no remotes configured; use 'git remote add <name> <url>')", "output-muted");
                return;
            }
            for (const r of Object.keys(repoState.remotes)) {
                printTerm(r);
            }
            return;
        }

        const sub = args[0];
        if (sub === "-v" || sub === "--verbose") {
            if (!repoState.remotes || Object.keys(repoState.remotes).length === 0) {
                printTerm("(no remotes configured)", "output-muted");
                return;
            }
            for (const [name, data] of Object.entries(repoState.remotes)) {
                printTerm(`${name}\t${data.url} (fetch)`);
                printTerm(`${name}\t${data.url} (push)`);
            }
            return;
        }

        if (sub === "add") {
            const rName = args[1];
            const rUrl = args[2];
            if (!rName || !rUrl) {
                printTerm("usage: git remote add <name> <url>", "output-error");
                return;
            }
            if (!repoState.remotes) repoState.remotes = {};
            if (repoState.remotes[rName]) {
                printTerm(`fatal: remote ${rName} already exists.`, "output-error");
                return;
            }
            repoState.remotes[rName] = { url: rUrl, branches: {} };
            printTerm(`Added remote '${rName}' (${rUrl}).`, "output-success");
            return;
        }

        if (sub === "get-url") {
            const rName = args[1];
            if (!rName) {
                printTerm("usage: git remote get-url <name>", "output-error");
                return;
            }
            if (!repoState.remotes || !repoState.remotes[rName]) {
                printTerm(`fatal: No such remote '${rName}'`, "output-error");
                return;
            }
            printTerm(repoState.remotes[rName].url);
            return;
        }

        if (sub === "set-url") {
            const rName = args[1];
            const newUrl = args[2];
            if (!rName || !newUrl) {
                printTerm("usage: git remote set-url <name> <newurl>", "output-error");
                return;
            }
            if (!repoState.remotes || !repoState.remotes[rName]) {
                printTerm(`fatal: No such remote '${rName}'`, "output-error");
                return;
            }
            repoState.remotes[rName].url = newUrl;
            printTerm(`Updated remote URL for '${rName}' to ${newUrl}.`, "output-success");
            return;
        }

        if (sub === "remove" || sub === "rm") {
            const rName = args[1];
            if (!rName || !repoState.remotes || !repoState.remotes[rName]) {
                printTerm(`error: Could not remove config section 'remote.${rName}'`, "output-error");
                return;
            }
            delete repoState.remotes[rName];
            printTerm(`Removed remote '${rName}'.`, "output-success");
            return;
        }

        printTerm(`error: Unknown subcommand '${sub}'. See 'git remote --help'.`, "output-error");
    }

    function handleGitPush(args) {
        if (!repoState.remotes || Object.keys(repoState.remotes).length === 0) {
            printTerm("fatal: No configured push destination.", "output-error");
            printTerm("Hint: Run 'git remote add <name> <url>' first to link a remote repository.", "output-muted");
            return;
        }

        const cleanArgs = args.filter(a => a !== "-u" && a !== "--set-upstream");
        const remoteName = cleanArgs[0] || Object.keys(repoState.remotes)[0];
        const branchName = cleanArgs[1] || (repoState.head.type === "branch" ? repoState.head.target : null);

        if (!branchName) {
            printTerm("fatal: You are not currently on a branch.", "output-error");
            return;
        }

        if (!repoState.remotes[remoteName]) {
            printTerm(`fatal: '${remoteName}' does not appear to be a git repository`, "output-error");
            return;
        }

        const localCommitId = repoState.branches[branchName];
        if (!localCommitId) {
            printTerm(`error: src refspec ${branchName} does not match any`, "output-error");
            printTerm(`error: failed to push some refs to '${repoState.remotes[remoteName].url}'`, "output-error");
            return;
        }

        const remote = repoState.remotes[remoteName];
        if (remote.branches[branchName] === localCommitId) {
            printTerm("Everything up-to-date", "output-muted");
            return;
        }

        remote.branches[branchName] = localCommitId;

        printTerm("Enumerating objects: 6, done.", "output-muted");
        printTerm("Counting objects: 100% (6/6), done.", "output-muted");
        printTerm("Delta compression using up to 8 threads", "output-muted");
        printTerm("Compressing objects: 100% (4/4), done.", "output-muted");
        printTerm("Writing objects: 100% (6/6), 512 bytes | 512.00 KiB/s, done.", "output-muted");
        printTerm("Total 6 (delta 1), reused 0 (delta 0), pack-reused 0", "output-muted");
        printTerm(`To ${remote.url}`);
        printTermHtml(` * <span style="color:#50fa7b">[new branch]</span> ${branchName} -> ${branchName}`, "output-success");
        printTerm(`Branch '${branchName}' set up to track remote branch '${branchName}' from '${remoteName}'.`, "output-info");
    }

    function handleGitFetch(args) {
        const remoteName = args[0] || (repoState.remotes && Object.keys(repoState.remotes).length ? Object.keys(repoState.remotes)[0] : "origin");
        if (!repoState.remotes || !repoState.remotes[remoteName]) {
            printTerm(`fatal: '${remoteName}' does not appear to be a git repository`, "output-error");
            printTerm("fatal: Could not read from remote repository.", "output-error");
            return;
        }

        const remote = repoState.remotes[remoteName];
        if (repoState.upstreamCommits && repoState.upstreamCommits.length > 0) {
            repoState.upstreamCommits.forEach(uc => {
                if (!repoState.commits.some(c => c.id === uc.id)) {
                    repoState.commits.push(uc);
                }
                remote.branches[uc.branch || "main"] = uc.id;
            });
            repoState.upstreamCommits = [];

            printTerm(`remote: Enumerating objects: 5, done.`, "output-muted");
            printTerm(`remote: Counting objects: 100% (5/5), done.`, "output-muted");
            printTerm(`remote: Compressing objects: 100% (3/3), done.`, "output-muted");
            printTerm(`remote: Total 5 (delta 1), reused 5 (delta 1)`, "output-muted");
            printTerm(`Unpacking objects: 100% (5/5), done.`, "output-muted");
            printTerm(`From ${remote.url}`);
            printTermHtml(` * <span style="color:#bd93f9">[new commit]</span> main -> ${remoteName}/main`, "output-info");
        } else {
            printTerm(`From ${remote.url}`);
            printTerm(`Everything up-to-date`, "output-muted");
        }
    }

    function handleGitPull(args) {
        const remoteName = args[0] || (repoState.remotes && Object.keys(repoState.remotes).length ? Object.keys(repoState.remotes)[0] : "origin");
        const branchName = args[1] || (repoState.head.type === "branch" ? repoState.head.target : "main");

        if (!repoState.remotes || !repoState.remotes[remoteName]) {
            printTerm(`fatal: '${remoteName}' does not appear to be a git repository`, "output-error");
            return;
        }

        const remote = repoState.remotes[remoteName];
        if (repoState.upstreamCommits && repoState.upstreamCommits.length > 0) {
            repoState.upstreamCommits.forEach(uc => {
                if (!repoState.commits.some(c => c.id === uc.id)) {
                    repoState.commits.push(uc);
                }
                remote.branches[uc.branch || "main"] = uc.id;
            });
            repoState.upstreamCommits = [];
        }

        const remoteTargetId = remote.branches[branchName];
        const currentLocalId = repoState.branches[branchName];

        if (!remoteTargetId) {
            printTerm(`Your configuration specifies to merge with the ref '${branchName}' from the remote, but no such ref was fetched.`, "output-error");
            return;
        }

        if (currentLocalId === remoteTargetId) {
            printTerm("Already up to date.", "output-text");
            return;
        }

        const oldCommit = repoState.commits.find(c => c.id === currentLocalId);
        const newCommit = repoState.commits.find(c => c.id === remoteTargetId);

        repoState.branches[branchName] = remoteTargetId;
        repoState.files["api.go"] = { status: "clean", content: "package main\n\n// remote API endpoint" };

        printTerm(`Updating ${(oldCommit ? oldCommit.hash : "0000000")}..${(newCommit ? newCommit.hash : "xxxxxxx")}`, "output-info");
        printTerm("Fast-forward", "output-text");
        printTerm(" api.go | 12 ++++++++++++", "output-text");
        printTerm(" 1 file changed, 12 insertions(+)", "output-text");
        printTerm(`Successfully pulled and integrated upstream branch '${branchName}'.`, "output-success");
    }

    function handleGitHelp() {
        printTerm("=== Git Command & Shell Reference ===", "output-info");
        printTerm("[ SHELL & FILE COMMANDS ]");
        printTerm("  touch <file>                    Create empty file (shows untracked in status)");
        printTerm("  echo \"text\" > <file>            Write content to file (creates/modifies)");
        printTerm("  echo \"text\" >> <file>           Append content to file");
        printTerm("  cat <file>                      Display file contents");
        printTerm("  ls                              List files with status colors");
        printTerm("  rm <file>                       Delete file from working directory");
        printTerm("[ STAGE & SNAPSHOT ]");
        printTerm("  git status                      Full status of modified & staged files");
        printTerm("  git add [file] | .              Stage file snapshots into the index");
        printTerm("  git diff [--staged]             Diff unstaged or staged file changes");
        printTerm("  git commit -m \"[msg]\"           Record staged snapshot into repository DAG");
        printTerm("[ BRANCH & MERGE ]");
        printTerm("  git branch [-d] [name]          List, create, or delete branches");
        printTerm("  git switch [-c] [name]          Switch or create lightweight branch pointer");
        printTerm("  git checkout [hash]             Checkout commit (enters detached HEAD)");
        printTerm("  git merge [branch]              Join two development histories");
        printTerm("[ REMOTE & COLLABORATION ]");
        printTerm("  git remote add [name] [url]     Connect local repo to a remote");
        printTerm("  git remote -v                   List configured remotes with URLs");
        printTerm("  git remote get-url [name]       Show URL of specified remote");
        printTerm("  git remote set-url [name] [url] Update URL of specified remote");
        printTerm("  git push [-u] [remote] [branch] Publish local commits to remote");
        printTerm("  git fetch [remote]              Download upstream commits without merging");
        printTerm("  git pull [remote] [branch]      Fetch and merge upstream commits");
        printTerm("[ INSPECT & COMPARE ]");
        printTerm("  git log [--oneline]             Display commit DAG history");
        printTerm("[ TEMPORARY COMMITS / STASH ]");
        printTerm("  git stash [push|pop|list]       Shelf and restore uncommitted changes");
        printTerm("[ REWRITE & UNDO ]");
        printTerm("  git restore [--staged]          Discard working tree edits or unstage files");
        printTerm("  git reset [file]                Unstage files from index");
    }

    // --- Goal Verification ---
    function checkSlideGoal(lastCmd) {
        const s = SLIDES[currentSlideIdx];
        if (s.validate && s.validate(repoState, lastCmd)) {
            const goalBox = document.getElementById("gtGoalCard");
            const goalStatus = document.getElementById("gtGoalStatus");

            if (goalBox) goalBox.classList.add("status-done");
            if (goalStatus) {
                goalStatus.className = "gt-goal-status done";
                goalStatus.textContent = "✓ Completed!";
            }

            printTerm(`[✓ SLIDE GOAL COMPLETED!] Great job! Press [next >>>] to proceed.`, "output-success");
        }
    }

    // --- UI Renderers ---
    function renderCurrentSlide() {
        const s = SLIDES[currentSlideIdx];

        // Topbar indicator
        const topIndicator = document.getElementById("gtSlideIndicatorTop");
        if (topIndicator) topIndicator.textContent = `Slide ${s.num}`;

        // Topbar prev/next controls
        const prevBtn = document.getElementById("gtBtnPrev");
        const nextBtn = document.getElementById("gtBtnNext");
        if (prevBtn) prevBtn.disabled = currentSlideIdx === 0;
        if (nextBtn) nextBtn.disabled = currentSlideIdx === SLIDES.length - 1;

        const prevBtnBottom = document.getElementById("gtBtnPrevBottom");
        const nextBtnBottom = document.getElementById("gtBtnNextBottom");
        if (prevBtnBottom) prevBtnBottom.disabled = currentSlideIdx === 0;
        if (nextBtnBottom) nextBtnBottom.disabled = currentSlideIdx === SLIDES.length - 1;

        // Sidebar header
        document.getElementById("gtSlideBadge").textContent = s.badge;
        document.getElementById("gtSlideTitle").textContent = s.title;

        // Sidebar content
        const isDone = s.validate && s.validate(repoState);
        const sidebarContent = document.getElementById("gtSidebarContent");
        if (sidebarContent) {
            sidebarContent.innerHTML = `
                <div class="gt-slide-text">
                    ${s.bodyHtml}
                </div>

                <div class="gt-goal-card ${isDone ? "status-done" : ""}" id="gtGoalCard">
                    <div class="gt-goal-head">
                        <span class="gt-goal-label">SLIDE GOAL</span>
                        <span class="gt-goal-status ${isDone ? "done" : ""}" id="gtGoalStatus">${isDone ? "✓ Completed!" : "Pending"}</span>
                    </div>
                    <div class="gt-goal-body">
                        ${s.goalText}
                    </div>
                </div>

                <div class="gt-sidebar-tip">
                    ${s.tipText}
                </div>
            `;
        }

        // Quick action chips in terminal
        renderChips(s.chips);

        // Update Prompt active branch
        const promptBranch = document.getElementById("gtPromptBranch");
        if (promptBranch) {
            if (!repoState.initialized) {
                promptBranch.textContent = "uninitialized";
            } else {
                promptBranch.textContent = repoState.head.type === "branch" ? repoState.head.target : `detached:${repoState.head.target}`;
            }
        }

        // Render 2D Branching DAG graph on top
        render2DDag();
    }

    function renderChips(chipsList) {
        const bar = document.getElementById("gtChipsBar");
        if (!bar) return;
        bar.innerHTML = `<span class="gt-chips-label">[chips]:</span>`;

        chipsList.forEach(chip => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "gt-chip";
            btn.textContent = chip;
            btn.addEventListener("click", () => {
                const input = document.getElementById("gtTermInput");
                if (input) {
                    input.value = chip;
                    executeCommand(chip);
                    input.value = "";
                }
            });
            bar.appendChild(btn);
        });
    }

    function escapeHtml(str) {
        if (str === null || str === undefined) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function escapeXml(str) {
        if (str === null || str === undefined) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
    }

    // --- DOM Initialization ---
    document.addEventListener("DOMContentLoaded", () => {
        const app = document.getElementById("gtApp");
        if (!app) return;

        const input = document.getElementById("gtTermInput");
        if (input) {
            input.addEventListener("keydown", e => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    const val = input.value;
                    input.value = "";
                    executeCommand(val);
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    if (cmdHistory.length > 0 && historyCursor > 0) {
                        historyCursor--;
                        input.value = cmdHistory[historyCursor];
                    }
                } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    if (historyCursor < cmdHistory.length - 1) {
                        historyCursor++;
                        input.value = cmdHistory[historyCursor];
                    } else {
                        historyCursor = cmdHistory.length;
                        input.value = "";
                    }
                }
            });
        }

        // Navigation controls
        const prevBtn = document.getElementById("gtBtnPrev");
        const nextBtn = document.getElementById("gtBtnNext");
        const prevBtnBottom = document.getElementById("gtBtnPrevBottom");
        const nextBtnBottom = document.getElementById("gtBtnNextBottom");

        if (prevBtn) prevBtn.addEventListener("click", () => loadSlide(currentSlideIdx - 1));
        if (nextBtn) nextBtn.addEventListener("click", () => loadSlide(currentSlideIdx + 1));
        if (prevBtnBottom) prevBtnBottom.addEventListener("click", () => loadSlide(currentSlideIdx - 1));
        if (nextBtnBottom) nextBtnBottom.addEventListener("click", () => loadSlide(currentSlideIdx + 1));

        // Slide reset button
        const resetSlideBtn = document.getElementById("gtBtnResetSlide");
        if (resetSlideBtn) {
            resetSlideBtn.addEventListener("click", () => loadSlide(currentSlideIdx));
        }

        // Clear terminal button
        const clearBtn = document.getElementById("gtBtnClear");
        if (clearBtn) {
            clearBtn.addEventListener("click", clearTerm);
        }

        // Keyboard arrow navigation (Left / Right for slides when input is not focused)
        document.addEventListener("keydown", e => {
            if (document.activeElement === input) return;
            if (e.key === "ArrowLeft") {
                if (currentSlideIdx > 0) {
                    e.preventDefault();
                    loadSlide(currentSlideIdx - 1);
                }
            } else if (e.key === "ArrowRight") {
                if (currentSlideIdx < SLIDES.length - 1) {
                    e.preventDefault();
                    loadSlide(currentSlideIdx + 1);
                }
            }
        });

        // Initialize Slide 0 (History & Foundations)
        loadSlide(0);
    });
})();
