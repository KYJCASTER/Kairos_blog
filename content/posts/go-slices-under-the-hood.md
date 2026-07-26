---
title: "理解 Go 的 slice：从底层数组到 append 的每一次搬家"
slug: "go-slices-under-the-hood"
excerpt: "slice 是 Go 里最常用也最容易「用对了但不知道为什么对」的结构。这篇从三元组结构讲起：切片和数组的关系、append 什么时候原地写什么时候搬家、共享底层数组的四个经典坑，以及全切片表达式是怎么救场的。"
date: "2026-07-08"
tags: ["编程", "Go"]
series: "Go 学习笔记"
published: true
---

# 理解 Go 的 slice：从底层数组到 append 的每一次搬家

从 Java 转过来学 Go，slice 大概是第一个「看起来眼熟、行为却总出乎意料」的东西。它长得像 Java 的 `ArrayList`，用起来像数组，但时不时冒出一些诡异现象：明明改的是 `b`，`a` 却跟着变；函数里 `append` 了半天，调用方的 slice 纹丝不动。

这些现象没有一个是玄学，全部可以用一张图解释。这篇就把那张图讲清楚。

## slice 不是数组，是数组的「窗口」

Go 里真正持有数据的是**数组**（array）——长度固定、属于值类型、赋值就整个拷贝。而 slice 本身只是一个很小的结构体，在运行时里长这样（示意）：

```go
type slice struct {
    ptr *T  // 指向底层数组中某个元素
    len int // 当前窗口的长度
    cap int // 从 ptr 到底层数组末尾还有多少格
}
```

三个字，一个指针两个整数。**slice 是底层数组上的一扇窗口**：`ptr` 说明窗口从哪开始，`len` 说明窗口多宽，`cap` 说明窗口最多还能向右拉多宽。

```go
arr := [6]int{0, 1, 2, 3, 4, 5}
s := arr[1:4]

fmt.Println(s, len(s), cap(s)) // [1 2 3] 3 5
```

`s` 的窗口从下标 1 开始，宽 3 格（`len=3`），而从下标 1 到数组末尾一共 5 格，所以 `cap=5`。记住这个公式：

```text
对 s := x[low:high]
len(s) = high - low
cap(s) = cap(x) - low
```

理解了「窗口」，slice 传参的行为也就顺理成章了：把 slice 传给函数，拷贝的只是这个三元组（24 字节），**指针指向的还是同一个底层数组**。所以函数内改元素，调用方看得见——这不是「引用传递」，而是「值传递了一个含指针的小结构体」。

## append：装得下就原地写，装不下就搬家

`append` 的逻辑只有两条路：

1. **`cap` 还够** → 直接在底层数组的下一格写入，返回的 slice 和原来共享同一个底层数组，只是 `len` 加一;
2. **`cap` 不够** → 分配一块更大的新数组，把旧数据拷过去，往新数组里写，返回的 slice 指向**新数组**——从这一刻起它和旧 slice 分道扬镳。

扩容倍率是实现细节（当前版本大致是：小 slice 直接翻倍，较大的 slice 按约 1.25 倍渐进增长），不该依赖具体数字，但要建立一个直觉：**append 可能搬家，也可能不搬**，而这正是大多数 slice 之谜的谜底。

先看「不搬家」制造的现象：

```go
arr := [4]int{1, 2, 3, 4}
a := arr[0:2]        // len=2 cap=4
b := append(a, 99)   // cap 够，原地写进 arr[2]

fmt.Println(arr) // [1 2 99 4] ← arr[2] 的 3 被覆盖了！
fmt.Println(b)   // [1 2 99]
```

`append(a, 99)` 没有分配任何新内存，它直接把 99 写进了 `a` 窗口右侧的那一格——那格恰好是 `arr[2]`，于是所有共享这个底层数组的窗口都「看见」了这次写入。

再看「搬家」制造的现象：

```go
func addOne(s []int) {
    s = append(s, 1) // 若触发扩容，s 指向新数组
}

nums := make([]int, 0, 1)
addOne(nums)
fmt.Println(nums) // [] —— 调用方什么都没看到
```

就算不扩容，`append` 增加的也只是**函数内那份拷贝**的 `len`，调用方手里的三元组没变。所以 Go 里 `append` 的惯用法永远是**接收返回值**：

```go
nums = append(nums, 1)         // 对
func addOne(s []int) []int {   // 函数要改 slice 结构，就返回它
    return append(s, 1)
}
```

## 四个经典坑

### 坑一：两个 slice 悄悄共享底层数组

```go
a := []int{1, 2, 3, 4, 5}
b := a[:3]
b[0] = 100
fmt.Println(a[0]) // 100
```

切片操作**从不拷贝数据**。想要独立副本，明确用 `copy`：

```go
b := make([]int, 3)
copy(b, a[:3]) // copy 返回实际拷贝的元素个数，取 len 较小者
```

### 坑二：从大数组上切一小片，钉死一大块内存

```go
func header(data []byte) []byte {
    return data[:8] // 窗口只有 8 字节，但整个 data 的底层数组都回收不掉
}
```

只要这 8 字节的窗口还活着，GC 就必须保留整块底层数组——如果 `data` 是刚读进来的 100MB 文件，这就是一次事故。处理方式还是 `copy`：

```go
func header(data []byte) []byte {
    h := make([]byte, 8)
    copy(h, data)
    return h // 100MB 可以安心回收了
}
```

### 坑三：以为 append 会分家，结果没分

前面 `arr[0:2]` 的例子已经演示过：**cap 有富余时，append 会覆写窗口右边的数据**。如果你把一个 slice 切给别人用，又继续在原 slice 上 append，两边就可能互相踩踏。

解法是**全切片表达式**（full slice expression）——切片时把 cap 也锁住：

```go
a := []int{1, 2, 3, 4, 5}
b := a[0:2:2]        // len=2, cap=2（第三个参数限制了 cap）

b = append(b, 99)    // cap 不够 → 必然搬家，绝不会踩到 a[2]
fmt.Println(a)       // [1 2 3 4 5] 安然无恙
```

`x[low:high:max]` 的 cap 是 `max - low`。把 cap 掐到和 len 一样大，等于声明「这扇窗口到此为止，想扩就去搬家」——把隐式共享变成了显式隔离。

### 坑四：nil slice 和空 slice 不完全是一回事

```go
var a []int          // nil slice：ptr=nil, len=0, cap=0
b := []int{}         // 空 slice：有指针（指向零长数组），len=0, cap=0

fmt.Println(a == nil, b == nil) // true false
```

对 `len`、`cap`、`range`、`append` 来说两者行为完全一致——所以**判空永远用 `len(s) == 0`**，不要用 `s == nil`。唯一实际的区别在序列化这类场景：`encoding/json` 会把 nil slice 编码成 `null`，把空 slice 编码成 `[]`，前端同学会为此找上门来。

## 给 Java 同学的对照表

| 你在 Java 里熟悉的 | Go 里对应的 | 关键差异 |
|---|---|---|
| `int[]` | `[6]int` 数组 | Go 数组是值类型，赋值/传参整个拷贝，长度是类型的一部分 |
| `ArrayList<Integer>` | `[]int` slice | 扩容后旧引用**不会**跟过来（append 要接返回值） |
| `list.subList(1, 4)` | `s[1:4]` | 都共享底层存储；但 Go 的窗口还能通过 append 越界覆写邻居 |
| `Arrays.copyOf` | `copy` + `make` | 语义几乎相同 |

最大的心智差异在于：Java 的 `ArrayList` 把「底层数组会搬家」完全封装掉了，你永远拿着同一个对象引用；Go 则把三元组摊开在你面前，搬不搬家直接决定你手里的 slice 还连不连着旧数据。**Go 不是更难，只是不替你隐藏。**

## 小结

- slice = `(ptr, len, cap)` 三元组，是底层数组上的窗口；传参拷贝的是三元组，不是数据;
- `append` 在 cap 够时原地写（可能覆写共享区域），cap 不够时搬家（和旧数组断开）——所以永远接收返回值;
- 需要真正的副本用 `copy`；需要隔离共享用全切片表达式 `s[low:high:max]`;
- 从大 slice 上切小片长期持有时，`copy` 出来，别钉死整块内存;
- 判空用 `len(s) == 0`；nil 与空 slice 只在序列化等边界处才有区别。

下一篇打算写 Go 的错误处理——另一个「从 Java 过来第一眼嫌弃、写多了真香」的主题。

---

*Go 学习笔记 · 第一篇，写于 2026-07-08。*
