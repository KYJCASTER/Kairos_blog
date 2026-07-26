---
title: "Go 并发第一课：goroutine、channel 与 select"
slug: "go-concurrency-first-lesson"
excerpt: "从 Java 线程的心智模型出发理解 Go 的并发：goroutine 为什么敢开十万个、channel 的无缓冲与有缓冲各自在表达什么、select 怎么把多路等待写成一段平铺直叙的代码，以及 -race、闭包捕获这些第一个月必踩的坑。"
date: "2026-07-24"
tags: ["编程", "Go"]
series: "Go 学习笔记"
published: true
---

# Go 并发第一课：goroutine、channel 与 select

学 Java 的时候，「开线程」在我心里是件有分量的事：一个平台线程默认吃掉约 1MB 栈内存，创建和切换都要过操作系统，线程池的参数怎么配能单独写一篇面经。所以第一次看到 Go 的教程随手写下这种代码时，我是本能地皱眉的：

```go
for i := 0; i < 100000; i++ {
    go worker(i)
}
```

十万个并发单元说开就开？这篇就从这个「凭什么」讲起。

## goroutine：为什么敢开十万个

`go` 关键字后面跟一个函数调用，这个函数就在一个新的 **goroutine** 里跑起来了。它敢这么便宜，有两个原因：

1. **栈是从小长起的。** goroutine 的初始栈只有约 2KB，不够用时由运行时自动扩容（搬到更大的栈上）。对比平台线程 1MB 的固定预留，同样的内存能养活的并发单元差了两三个数量级;
2. **调度不经过操作系统。** Go 运行时实现了 M:N 调度——成千上万个 goroutine（G）被多路复用到少量操作系统线程（M）上，中间隔着调度器的处理器（P）。goroutine 之间的切换只是用户态的一次寄存器保存恢复，比线程上下文切换便宜得多。goroutine 在 channel 上阻塞时，底下的线程不会陪着睡，而是转头去跑别的 goroutine。

公平起见要提一句：Java 21 的虚拟线程（virtual threads）走的正是同一条路线。但 Go 是把这套模型作为**唯一且默认**的并发原语从第一天用到今天，语言、标准库、生态全部围绕它长成——这种「没有历史包袱」的一致性，才是体感差异的来源。

有一个基本纪律要立刻建立：**`go` 出去的东西，要想好它怎么结束**。主 goroutine（main 函数）退出时整个进程直接结束，不会等任何人：

```go
func main() {
    go fmt.Println("你可能永远看不到这句话")
    // main 退出，进程终止
}
```

等待一组 goroutine 收工的标准工具是 `sync.WaitGroup`：

```go
var wg sync.WaitGroup
for i := 0; i < 5; i++ {
    wg.Add(1)
    go func() {
        defer wg.Done()
        process(i)
    }()
}
wg.Wait() // 阻塞到 5 个全部 Done
```

（Go 1.25 之后可以写得更顺手：`wg.Go(func() { process(i) })`，Add 和 Done 都替你管了。）

顺带说一个历史坑：上面闭包直接用 `i`，在 Go 1.22 之前是经典错误——整个循环共享同一个循环变量，goroutine 真正跑起来时 `i` 早就变了，打印出来全是同一个数。Go 1.22 起循环变量改为**每轮迭代一个新变量**，这个坑被语言层面填了。但如果你读到旧代码里的 `i := i`（把循环变量拷一份进循环体），要认得那是当年的疫苗。

## channel：让数据「流」过去，而不是「锁」起来

开出十万个 goroutine 不难，难的是让它们安全地交流。Java 的默认答案是共享变量加锁（`synchronized`、`ConcurrentHashMap`……）；Go 当然也有 `sync.Mutex`，但它的招牌答案是 **channel**——一根有类型的管道：

```go
ch := make(chan int)      // 无缓冲
go func() { ch <- 42 }()  // 发送
v := <-ch                 // 接收
```

Go 谚语说 「Don't communicate by sharing memory; share memory by communicating」（不要靠共享内存来通信，要靠通信来共享内存）。它的实际含义是：**数据顺着 channel 从一个 goroutine 流到另一个，任意时刻只有一方持有它**，于是根本不存在「两个人同时摸同一块内存」的问题，锁也就无从谈起。

### 无缓冲 vs 有缓冲：两种不同的表达

这是初学最值得花时间体会的区分：

- **无缓冲 channel（`make(chan T)`）是一次会面**。发送方会阻塞到接收方到场，两边在交接那一刻完成同步——它传递的不只是数据，还有「此刻我们都到了这一步」的保证;
- **有缓冲 channel（`make(chan T, n)`）是一条传送带**。缓冲没满发送就不等人，满了才阻塞。它在两端速度不匹配时提供削峰的余量，但也**削弱了同步语义**——发送成功只说明东西上了传送带，不说明有人接走了。

经验法则：默认用无缓冲，让同步语义显式可见；确有生产/消费速率差，再给一个**有明确理由的**缓冲大小。「随手给个 100 免得阻塞」是在用缓冲掩盖设计问题。

### close 与 range：广播「没有更多了」

```go
jobs := make(chan int)

go func() {
    for i := 0; i < 5; i++ {
        jobs <- i
    }
    close(jobs) // 发送方宣布：到此为止
}()

for v := range jobs { // 自动接收到 channel 关闭为止
    fmt.Println(v)
}
```

关于 close 的规矩，三条背下来能省很多事故：

1. **只有发送方可以 close**，接收方永远不要动手;
2. 向已关闭的 channel 发送会 **panic**；从已关闭的 channel 接收**不会**，而是立刻返回零值——需要区分「零值」和「关完了」时用双返回值 `v, ok := <-ch`;
3. close 不是必须的。没人 `range` 它、也没人需要「结束」信号的话，让 channel 被 GC 回收即可。

## select：多路等待的平铺直叙

真实程序里，一个 goroutine 往往要同时等好几件事：数据来了要处理、超时了要放弃、上游喊停要退出。Java 里这类逻辑通常要靠回调、Future 组合或者额外线程；Go 给了一个专用控制结构 `select`：

```go
select {
case v := <-dataCh:
    handle(v)
case <-time.After(3 * time.Second):
    return errors.New("等待数据超时")
case <-done:
    return nil // 上游取消
}
```

`select` 同时守着多个 channel 操作，**哪个先就绪就走哪个分支**；多个同时就绪时随机挑一个（避免饥饿）。两个常用变体：

- 加 `default` 分支 → 变成**非阻塞**尝试：所有 channel 都没就绪就立刻走 default;
- 把某个 case 的 channel 置为 `nil` → 该分支**永久沉默**（对 nil channel 的收发永远阻塞），这是运行中动态关闭某一路的惯用技巧。

超时、取消这套需求最终会把你引向 `context` 包——它本质上就是一个随请求传递的 `done` channel 加上超时管理，值得单独一篇，这里先挖个坑。

## 第一个月必踩的坑

**坑一：数据竞争不会报错，只会出鬼。** 两个 goroutine 不加同步地读写同一个变量，Go 不会拦你，程序也常常「看起来能跑」。防线是竞争检测器——测试和联调阶段永远带上：

```bash
go test -race ./...
go run -race main.go
```

`-race` 报出来的每一条都是真问题，不要侥幸。需要共享状态时，老老实实 `sync.Mutex`——channel 不是唯一正确答案，「保护一个计数器」这种场景用锁反而更清晰。

**坑二：goroutine 泄漏。** 一个 goroutine 阻塞在没人收的 channel 上，它就永远留在内存里。最常见于「结果没人取」：

```go
func fetch() <-chan Result {
    ch := make(chan Result)
    go func() { ch <- slowQuery() }() // 若调用方放弃接收，这个 goroutine 永远卡在这
    return ch
}
```

修法要么给 channel 一格缓冲让发送不依赖接收，要么用 `select` 同时监听取消信号。原则同前：**每个 goroutine 出生前，想清楚它所有的退出路径。**

**坑三：把全局死锁当成灵异事件。** 所有 goroutine 都睡着、没人能叫醒任何人时，运行时会直接把进程掐死并甩出一句：

```text
fatal error: all goroutines are asleep - deadlock!
```

新手第一次撞见容易慌，其实这是 Go 在帮你——死锁在开发期就大声爆炸，好过上线后静默挂起。最小复现是在 main 里对无缓冲 channel 自发自收：`ch := make(chan int); ch <- 1`——发送方等一个永远不会出现的接收方。

## 小结

- goroutine 便宜在**小栈起步 + 用户态 M:N 调度**；但每个 goroutine 都要有明确的退出路径，`WaitGroup` 是集合哨;
- channel 用「数据流动」替代「内存共享」；无缓冲是会面（带同步保证），有缓冲是传送带（只管容量）;
- close 由发送方执行、接收方用 `v, ok` 或 `range` 感知；向关闭的 channel 发送会 panic;
- `select` 把「同时等多件事」写成平铺的分支，配合 `default`/nil channel 有非阻塞与动态静音两个变体;
- `-race` 常开；共享一个简单状态用 Mutex 不丢人；死锁大声爆炸是特性不是 bug。

Go 学习笔记系列到这篇正好凑齐「数据结构、错误处理、并发」三块基石。下一篇大概率写 `context`——那根把超时和取消串起来的线。

---

*Go 学习笔记 · 第三篇，写于 2026-07-24。*
