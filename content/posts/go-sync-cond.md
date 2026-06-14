+++
date = '2026-06-14T17:08:09+03:30'
draft = false 
title = 'sync.Cond: an Underrated Gem'
tags = ["concurrency", "go"]
+++

Go's standard library ships with an impressive set of tools for building concurrent applications. Most Go developers reach for channels, `sync.Mutex`, or `sync.WaitGroup` — and that covers the vast majority of use cases. But there's one primitive that is underrated in my opinion: `sync.Cond`.

## What Is sync.Cond?

Imagine you have a group of workers that need to coordinate before proceeding with a task. Your first instinct might be to use channels, and that's usually the right call. But consider a scenario where goroutines need to sleep until a specific condition is met — say, a connection pool with a maximum of 10 open connections shared by 20 workers. You need workers to sleep when no connections are available and wake up only when one is freed, while also tracking other state variables simultaneously. In cases like these, relying solely on channels, mutexes, or wait groups can get awkward fast.

> In 99% of cases, you won't need `sync.Cond`. Channels and goroutines will do the job. But when you need fine-grained control over sleeping and waking goroutines based on a shared condition, `sync.Cond` is the right tool.

## The API

`sync.Cond` requires a `sync.Locker` (typically a `*sync.Mutex`) and exposes three methods:

- **`Wait()`** — suspends the goroutine and releases the associated lock. The scheduler ignores it until it's woken up.
- **`Signal()`** — wakes the first goroutine waiting in the queue.
- **`Broadcast()`** — wakes all waiting goroutines.

## A Practical Example

Let's build a small job processing system. Workers capitalize strings, with a simulated delay:

```go
func processWord(s string) string {
    time.Sleep(time.Duration(rand.Intn(5)) * time.Second)
    return strings.ToUpper(s)
}
```

### Shared State

Workers need access to a shared job queue and a couple of control flags:

```go
var (
    mu             sync.Mutex
    cond           = sync.NewCond(&mu)
    jobs           []string
    workersStopped = false
    exit           = false
)
```

- `mu` protects concurrent access to the shared state.
- `cond` is our condition variable, tied to `mu`.
- `workersStopped` pauses all workers when set to `true`.
- `exit` signals a clean shutdown.

### The Producer

A background goroutine adds a random job to the queue every two seconds and signals a waiting worker:

```go
func startProducer() {
    words := []string{"hello", "world", "foo", "bar", "baz", "qux"}

    go func() {
        for {
            time.Sleep(2 * time.Second)

            mu.Lock()

            if exit {
                mu.Unlock()
                return
            }

            word := words[rand.Intn(len(words))]
            jobs = append(jobs, word)
            log.Printf("[producer] added job: %s", word)
            mu.Unlock()

            cond.Signal() // wake one worker to handle the new job
        }
    }()
}
```

### The Workers

Each worker loops, sleeping when there's no work to do or when workers are paused:

```go
func createWorker(id int) {
    for {
        mu.Lock()

        // sleep when: no jobs or paused — but not if we're exiting
        for (len(jobs) == 0 || workersStopped) && !exit {
            cond.Wait() // releases the lock while sleeping
        }

        if exit {
            log.Printf("worker %d: bye bye", id)
            mu.Unlock()
            return
        }

        if workersStopped {
            mu.Unlock()
            continue
        }

        job := jobs[0]
        jobs = jobs[1:]
        mu.Unlock()

        log.Printf("worker %d: %s", id, processWord(job))
    }
}
```

Notice the sleep condition is checked inside a `for` loop, not an `if`. This guards against **spurious wakeups** — situations where a goroutine wakes up even though the condition hasn't actually been met (for example, because another worker already consumed the job). Wrapping `Wait()` in a loop is idiomatic Go and prevents subtle bugs. See [Wikipedia on spurious wakeups](https://en.wikipedia.org/wiki/Spurious_wakeup) for more.

### Wiring It Together

The `main` function starts the workers and producer, then listens for commands on stdin:

```go
func startWorkers() {
    for i := range 5 {
        go func(id int) {
            createWorker(id)
        }(i)
    }
}

func main() {
    startWorkers()
    startProducer()

    scanner := bufio.NewScanner(os.Stdin)
    for scanner.Scan() {
        line := strings.TrimSpace(scanner.Text())

        switch line {
        case "stop":
            mu.Lock()
            workersStopped = true
            mu.Unlock()
            log.Println("[main] workers paused")

        case "start":
            mu.Lock()
            workersStopped = false
            cond.Broadcast() // wake all workers — they were paused
            mu.Unlock()
            log.Println("[main] workers resumed")

        case "exit":
            mu.Lock()
            exit = true
            cond.Broadcast() // wake all workers so they see exit=true
            mu.Unlock()
            log.Println("[main] shutting down")
            time.Sleep(time.Second) // give workers time to clean up
            return

        default:
            // treat any other input as a manual job
            mu.Lock()
            jobs = append(jobs, line)
            mu.Unlock()
            cond.Signal()
        }
    }
}
```

Let's run the code and see what happens:

![Running the code](/images/posts/go-sync-cond.gif)


## Why Not Just Use Channels?

Channels handle most concurrency problems elegantly. But there's one thing they can't do: re-open after closing.

When you need to broadcast to all goroutines, you can close a channel — every receiver will unblock immediately. But closing is permanent. You can't close and re-open a channel to implement a pause/resume flow.

`sync.Cond` has no such limitation. `Broadcast()` can be called repeatedly, making it well-suited for scenarios where the "wake all" signal needs to fire more than once over the lifetime of the program.

## Wrapping Up

`sync.Cond` is a niche tool, but it fills a gap that channels alone can't easily cover: coordinating goroutines around a shared, re-evaluable condition. If you find yourself reaching for complex channel gymnastics to implement sleeping workers with multiple control variables, `sync.Cond` is worth a closer look.

You can find the code snippet for this project at [this gist](https://gist.github.com/thisisjab/fbbf352827f4bf510f4acd80da6234d1).