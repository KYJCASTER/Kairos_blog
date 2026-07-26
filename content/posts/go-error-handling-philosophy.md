---
title: "Go 的错误处理：写惯了 try-catch 的人，要过哪几道坎"
slug: "go-error-handling-philosophy"
excerpt: "从 Java 的异常体系转到 Go 的 if err != nil，最初的感受是「这也太原始了」。这篇讲清楚 Go 为什么把错误当普通值、%w 包装与 errors.Is / errors.As 的正确用法、哨兵错误与自定义错误类型怎么选，以及 panic 真正该出场的时刻。"
date: "2026-07-16"
tags: ["编程", "Go"]
series: "Go 学习笔记"
published: true
---

# Go 的错误处理：写惯了 try-catch 的人，要过哪几道坎

刚从 Java 转到 Go 的时候，最不适应的不是语法，是满屏的：

```go
if err != nil {
    return err
}
```

Java 写惯了，肌肉记忆是「正常逻辑写在 try 里，出错的事丢给 catch，实在不行往上抛」。Go 却要求你**在每一个可能出错的调用后面，当场表态**。头两周我是真心嫌弃，觉得这是语言设计的偷懒。写了几个月之后想法完全反过来了——这篇试着把「反过来」的过程讲明白。

## error 只是一个普通的接口

Go 里没有异常体系，`error` 就是标准库里一个再普通不过的接口：

```go
type error interface {
    Error() string
}
```

任何实现了 `Error() string` 的类型都是 error。它不携带栈展开的魔法，不会让控制流突然跳走，就是一个**返回值**——和 `int`、`string` 一样，从函数里返回，被变量接住，被 if 检查。

这个设计的直接后果是：**错误处理路径就写在正常路径旁边，一眼可见**。看一段典型的 Go 代码，你能逐行指出「这里可能失败、失败了会怎样」；而 Java 的一个 `try` 块罩住十行代码时，哪一行会抛、抛了什么，往往要翻方法签名甚至实现才知道。

Java 的 checked exception 其实想解决同一个问题（强迫调用者面对失败），但它把处理动作放在了离出错点很远的 catch 块里，而且实践中大量演变成 `catch (Exception e) { e.printStackTrace(); }` 这种「表面上处理了」。Go 的选择是把强迫做得更彻底：错误是返回值，你不接就编译不过（或者被 linter 逮住），接了就得表态。

## 表态只有三种：处理、包装上抛、真的不管

每次拿到 err，你其实只有三个合理选项。

**选项一：当场处理。** 重试、降级、给默认值——错误在这里终结，就不要再往上抛：

```go
cfg, err := loadConfig(path)
if err != nil {
    cfg = defaultConfig() // 处理掉了，日志记一笔即可，不再 return err
    log.Printf("配置读取失败，使用默认值: %v", err)
}
```

**选项二：加上下文，包装后上抛。** 这是最常见的一条路，关键动词是 `fmt.Errorf` 配 `%w`：

```go
data, err := os.ReadFile(path)
if err != nil {
    return fmt.Errorf("读取用户配置 %s: %w", path, err)
}
```

`%w`（wrap）会把原始错误链在新错误里，形成一条错误链。等它一路冒到顶层被打印时，你得到的是一句自带因果链的话：

```text
读取用户配置 /etc/app.json: open /etc/app.json: no such file or directory
```

每一层只补充**自己这层知道的信息**（在干什么、操作对象是谁），这比 Java 里动辄几十行、大半是框架噪音的堆栈更接近「人想看的错误报告」。两个纪律：

- 用 `%v` 包装会**斩断错误链**（下游没法再 `errors.Is` 判断），除非你有意隐藏内部错误，否则一律 `%w`;
- **不要一边打日志一边上抛**。那会让同一个错误在日志里出现 N 遍。原则：谁终结错误，谁打日志。

**选项三：显式忽略。** 极少数场景确实不在乎，用下划线写清楚这是故意的：

```go
_ = os.Remove(tmpFile) // 清理临时文件，失败无所谓
```

## errors.Is 和 errors.As：在错误链上找人

错误被层层包装之后，顶层怎么判断「根因是不是文件不存在」？直接 `err == os.ErrNotExist` 会失败——err 已经是包装过的新错误了。Go 1.13 之后的标准做法是让 `errors.Is` 沿着链一路解包去比对：

```go
if errors.Is(err, os.ErrNotExist) {
    // 链条上任何一环是 ErrNotExist 都会命中
}
```

`errors.Is` 面向**哨兵错误**（sentinel error）——包级导出的固定错误值，如 `io.EOF`、`sql.ErrNoRows`、`os.ErrNotExist`，适合表达「一种约定好的状态」。

而当错误携带**结构化信息**、你需要把它取出来用时，用自定义错误类型加 `errors.As`：

```go
type HTTPError struct {
    StatusCode int
    URL        string
}

func (e *HTTPError) Error() string {
    return fmt.Sprintf("请求 %s 返回 %d", e.URL, e.StatusCode)
}
```

```go
var httpErr *HTTPError
if errors.As(err, &httpErr) {
    // errors.As 在链上找到第一个 *HTTPError，取出来赋给 httpErr
    if httpErr.StatusCode == 429 {
        retryAfterBackoff()
    }
}
```

选择的经验法则：**调用者只需要知道「是不是这种错」→ 哨兵 + Is；调用者还要读错误里的字段 → 类型 + As**。另外 Go 1.20 加了 `errors.Join`，可以把多个错误合并成一个（比如循环里收集所有失败项），`errors.Is` 对合并后的每一支都有效。

## panic 不是 Go 的异常

Go 有 `panic` 和 `recover`，长得很像 try-catch，于是每个从 Java 过来的人都会问：能不能用它模拟异常？

不能，也不该。社区的共识边界非常清晰：

- **error 处理「预期中的失败」**：文件不存在、网络超时、输入不合法——正常运行中就是会发生的事;
- **panic 留给「程序写错了」**：数组越界、空指针解引用、「逻辑上不可能到达」的分支。它表达的是 bug，不是状况。

`recover` 的正当用武之地很少，典型的是**边界隔离**：HTTP 服务器不能因为一个 handler 里的 bug 把整个进程带崩，所以框架会在每个请求的边界上 recover、记日志、返回 500。注意 `recover` 只能在 `defer` 的函数里生效：

```go
func safeHandler(h http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if v := recover(); v != nil {
                log.Printf("handler panic: %v", v)
                http.Error(w, "internal error", http.StatusInternalServerError)
            }
        }()
        h(w, r)
    }
}
```

在业务逻辑里用 panic 传递「用户名重复」这类信息，等于把 bug 通道当成了业务通道——代码评审时会被直接打回。

## 那些「太啰嗦」的抱怨，后来怎么样了

诚实地说：`if err != nil` 的确啰嗦，Go 团队自己也多次讨论过简化语法的提案（`try`、`check/handle`……），最后全部搁置——因为每个方案都会把「错误在哪里被处理」重新变得不可见，而这恰恰是 Go 用啰嗦换来的东西。

写了几个月后我自己的变化是：

1. **读代码的负担显著下降了。** 任何一个函数，扫一眼就知道它有几个失败出口、每个出口怎么收场。这在读陌生代码库时的价值，远超写代码时省下的那几行;
2. **错误信息质量上去了。** 因为每层都要亲手包装，「在干什么时、对什么对象、出了什么错」自然而然被写进了错误链——而不是事后从堆栈里考古;
3. **对「哪里会失败」变得敏感。** try-catch 时代我默认「大概率不会出错」；现在写每个调用都会想一秒：这里失败了，用户会看到什么？

这大概就是 Rob Pike 那句 「Errors are values」（错误就是值）的真正含义：一旦错误是普通的值，你就可以用对付值的全部编程手段去对付它——存进结构体、塞进 channel、合并、比对、携带字段——而不是只能在 catch 块里被动接刀。

## 小结

- `error` 是普通接口、普通返回值，没有控制流魔法；处理路径与正常路径并排可见;
- 拿到 err 只有三种表态：当场处理（并终结它）、`%w` 包装上抛（补充本层上下文）、显式 `_` 忽略;
- 判断「是不是某种错」用哨兵 + `errors.Is`；要读错误内部字段用自定义类型 + `errors.As`；`%v` 会斩断错误链，慎用;
- 谁终结错误谁打日志，不要层层打;
- panic 表达 bug，error 表达状况；`recover` 只该出现在进程/请求边界上。

下一篇写 goroutine 和 channel——Go 真正的招牌菜。

---

*Go 学习笔记 · 第二篇，写于 2026-07-16。*
