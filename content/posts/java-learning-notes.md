---
title: "Java 学习笔记：引用类型、循环与 Switch 表达式"
slug: "java-learning-notes"
excerpt: "详细总结 Java 中引用类型相等判断、for-each 循环、浮点数精度问题以及 switch 表达式的使用技巧和最佳实践。"
date: "2026-03-12"
tags: ["Java", "编程", "学习笔记", "后端"]
published: true
---

# Java 学习笔记：引用类型、循环与 Switch 表达式

## 目录
- [背景：值类型 vs 引用类型](#背景值类型-vs-引用类型)
- [变量作用域原则](#变量作用域原则)
- [== 运算符：判断引用是否相等](#运算符判断引用是否相等)
- [equals() 方法：判断内容是否相等](#equals-方法判断内容是否相等)
- [String 对象的特殊性质](#string-对象的特殊性质)
- [总结与最佳实践](#总结与最佳实践)
- [for-each 循环](#for-each-循环)
- [浮点数精度问题](#浮点数精度问题)
- [switch-case 穿透性](#switch-case-穿透性)
- [switch 表达式（Java 12+）](#switch-表达式java-12)
- [yield 关键字（Java 13+）](#yield-关键字java-13)

---

## 背景：值类型 vs 引用类型

Java 中的数据类型分为两大类：

| 类型 | 存储方式 | 判断相等的方式 |
|------|----------|----------------|
| **值类型**（基本类型：int, double, boolean 等） | 直接存储值 | 使用 `==` |
| **引用类型**（对象：String, 自定义类等） | 存储对象的内存地址（引用） | 使用 `equals()` |

---

## 变量作用域原则

变量应该尽量缩小其访问范围，遵循**最小化作用域原则**。

### 为什么作用域要最小化？

1. **提高可读性**
   - 变量只在需要的地方出现，代码更易理解
   - 避免循环结束后还能看到 `i`，造成困惑

2. **避免误用和 Bug**
   - 防止循环后误用已改变的变量值
   - `for (int i = ...)` 循环结束后 `i` 自动销毁，更安全

3. **提高可维护性**
   - 变量存活时间越短，越容易追踪和调试
   - 重构时更安全，不容易影响其他代码

### 示例

```java
// ✅ 推荐：i 的作用域只在循环内
for (int i = 0; i < n; i++) {
    System.out.println(ns[i]);
}
// 循环结束后 i 不存在，避免误用

// ❌ 不推荐：i 的作用域扩大到整个方法
int i;
for (i = 0; i < n; i++) {
    System.out.println(ns[i]);
}
// 循环结束后 i 仍是 5，可能被意外使用
```

### 总结

| 原则 | 说明 |
|------|------|
| 循环变量 | 在 for 内部声明，作用域最小 |
| 方法参数 | 只在方法内部有效 |
| 局部变量 | 在第一次使用前声明，用完后尽快置空 |

---

## == 运算符：判断引用是否相等

在 Java 中，`==` 用于引用类型时，判断的是**两个变量是否指向同一个对象**（即引用地址是否相同）。

```java
public class Main {
    public static void main(String[] args) {
        String s1 = "hello";
        String s2 = "HELLO".toLowerCase();

        System.out.println(s1);  // hello
        System.out.println(s2);  // hello

        if (s1 == s2) {
            System.out.println("s1 == s2");  // 不会执行
        } else {
            System.out.println("s1 != s2");  // 输出：s1 != s2
        }
    }
}
```

**输出：**
```
hello
hello
s1 != s2
```

**原因分析：**
- `s1` 指向字符串常量池中的 `"hello"`
- `s2` 通过 `toLowerCase()` 方法创建了一个**新的 String 对象**
- 虽然内容相同，但它们是**不同的对象**，引用地址不同

---

## equals() 方法：判断内容是否相等

要判断引用类型的**内容**是否相等，必须使用 `equals()` 方法：

```java
public class Main {
    public static void main(String[] args) {
        String s1 = "hello";
        String s2 = "HELLO".toLowerCase();

        System.out.println(s1);  // hello
        System.out.println(s2);  // hello

        if (s1.equals(s2)) {
            System.out.println("s1 equals s2");  // 输出：s1 equals s2
        } else {
            System.out.println("s1 not equals s2");
        }
    }
}
```

**输出：**
```
hello
hello
s1 equals s2
```

---

## String 对象的特殊性质

### 字符串常量池

Java 为了节省内存，设置了**字符串常量池**：

```java
String s1 = "hello";           // 放入常量池
String s2 = "hello";           // 直接从常量池获取，s1 和 s2 指向同一对象
System.out.println(s1 == s2);  // true
```

### 编译期 vs 运行期

| 操作 | 结果 |
|------|------|
| `String s = "hello"` | 编译期确定，放入常量池 |
| `String s = "HELLO".toLowerCase()` | 运行期创建是新对象 |

---

## 总结与最佳实践

### 判断引用类型相等

| 场景 | 推荐方式 |
|------|----------|
| 判断 String 内容是否相等 | 使用 `equals()` |
| 判断是否指向同一对象 | 使用 `==` |
| 自定义类比较 | 重写 `equals()` 方法 |

### 注意事项

1. **String 比较必须用 `equals()`**，否则容易出现意外结果
2. `equals()` 方法默认继承自 `Object`，比较的是引用地址
3. 常用类（如 `String`、`Integer`）已经重写了 `equals()`，实现内容比较
4. 自定义类若需要比较内容，应重写 `equals()` 方法（通常配合 `hashCode()` 一起重写）

---

## for-each 循环

Java 提供了**增强 for 循环**（for-each），用于更简洁地遍历数组和集合。

### 基本语法

```java
int[] ns = { 1, 4, 9, 16, 25 };
for (int n : ns) {
    System.out.println(n);
}
```

### 对比：普通 for vs for-each

| 特性 | 普通 for 循环 | for-each 循环 |
|------|---------------|---------------|
| 索引 | 可以获取索引 `i` | 无法获取索引 |
| 遍历顺序 | 可以控制顺序 | 按数组顺序遍历 |
| 代码简洁度 | 较繁琐 | 更简洁 |
| 适用场景 | 需要索引或控制步长 | 只遍历元素 |

### 优点

1. **写法简洁**：无需手动管理索引
2. **更安全**：避免了数组越界等索引错误
3. **易读**：直接操作元素，代码意图明确

### 缺点

1. **无法获取索引**
2. **无法反向遍历**
3. **无法在遍历时修改数组**

### 应用场景

for-each 适合**只关心元素、不关心索引**的场景：

```java
// 遍历打印
for (String name : names) {
    System.out.println(name);
}

// 遍历求和
int sum = 0;
for (int n : numbers) {
    sum += n;
}

// 遍历集合（后续会学）
for (ListItem item : items) {
    // 处理每个元素
}
```

### 注意事项

- for-each 不仅能遍历数组，还能遍历所有**可迭代**（Iterable）的数据类型，如 `List`、`Set`、`Map` 等
- 遍历时不要修改集合结构（增删元素），否则可能抛出 `ConcurrentModificationException`

---

## 浮点数精度问题

Java 中 `float` 和 `double` 是**值类型**（基本类型），但同样存在精度问题。

### 问题根源：二进制无法精确表示某些十进制小数

计算机使用**二进制**存储数字，但很多十进制小数无法用有限长度的二进制表示。

例如，十进制的 `0.1` 在二进制中是无限循环的：
```
0.1(十进制) = 0.00011001100110011...(二进制) 无限循环
```

### IEEE 754 标准

大多数计算机使用 IEEE 754 标准存储浮点数：

| 类型 | 总位数 | 符号位 | 指数位 | 尾数位 |
|------|--------|--------|--------|--------|
| float | 32 位 | 1 位 | 8 位 | 23 位 |
| double | 64 位 | 1 位 | 11 位 | 52 位 |

固定位数意味着只能表示有限数量的数值，导致精度截断。

### 常见后果

```java
System.out.println(0.1 + 0.2);   // 输出：0.30000000000000004
System.out.println(0.1 * 0.2);   // 输出：0.020000000000000004
System.out.println(1.0 - 0.9);   // 输出：0.09999999999999998
```

### 解决方案

1. **使用 BigDecimal 类**
   ```java
   import java.math.BigDecimal;

   BigDecimal a = new BigDecimal("0.1");
   BigDecimal b = new BigDecimal("0.2");
   System.out.println(a.add(b));  // 输出：0.3
   ```

2. **使用整数计算**（金额计算推荐）
   ```java
   // 以"分"为单位，避免小数
   int yuan = 10;
   int jiao = 5;
   int fen = 3;
   int totalFen = yuan * 100 + jiao * 10 + fen;  // 1053 分
   ```

3. **设置容忍误差进行比较**
   ```java
   double a = 0.1 + 0.2;
   double b = 0.3;
   if (Math.abs(a - b) < 1e-10) {
       System.out.println("近似相等");
   }
   ```

### 总结

| 场景 | 推荐方案 |
|------|----------|
| 金融/金额计算 | BigDecimal 或整数 |
| 科学计算 | double（通常足够） |
| 精确比较 | 设置误差范围 |

---

## switch-case 穿透性

`switch` 语句的 case 具有**穿透性**（Fall-through）：如果 case 块没有 `break`，则会继续执行下一个 case。

### 基本示例

```java
int day = 2;
switch (day) {
    case 1:
        System.out.println("星期一");
    case 2:
        System.out.println("星期二");
    case 3:
        System.out.println("星期三");
    default:
        System.out.println("其他");
}
```

**输出：**
```
星期二
星期三
其他
```

### 实际应用：多 case 共用逻辑

穿透性可以巧妙利用，让多个 case 共用同一段代码：

```java
int score = 85;
switch (score / 10) {
    case 9:
    case 8:
        System.out.println("优秀");
        break;
    case 7:
    case 6:
        System.out.println("良好");
        break;
    default:
        System.out.println("需努力");
}
```

### 总结

| 特性 | 说明 |
|------|------|
| 有 `break` | 执行完该 case 后跳出 switch |
| 无 `break` | 继续执行下一个 case（穿透） |
| 常见错误 | 忘记加 break 导致意外穿透 |
| 巧妙用法 | 多个 case 共用同一逻辑 |

---

## switch 表达式（Java 12+）

从 Java 12 开始，switch 语句升级为更简洁的**表达式语法**，使用 `->` 替代冒号，且**没有穿透效应**。

### 基本语法

```java
String fruit = "apple";
switch (fruit) {
    case "apple" -> System.out.println("Selected apple");
    case "pear" -> System.out.println("Selected pear");
    case "mango" -> {
        System.out.println("Selected mango");
        System.out.println("Good choice!");
    }
    default -> System.out.println("No fruit selected");
}
```

**特点：**
- 使用 `->` 箭头语法
- 多条语句需要用 `{}` 括起来
- **不需要 break**，没有穿透效应

### switch 表达式返回值

switch 还可以作为表达式直接返回值：

```java
String fruit = "apple";
int opt = switch (fruit) {
    case "apple" -> 1;
    case "pear", "mango" -> 2;
    default -> 0;
};  // 注意赋值语句要以 ; 结束
System.out.println("opt = " + opt);  // opt = 1
```

### 对比：旧语法 vs 新语法

| 特性 | 旧语法 | 新语法 |
|------|--------|--------|
| 分隔符 | `:` | `->` |
| 穿透性 | 有（需 break） | 无 |
| 返回值 | 需要变量赋值 | 直接返回 |
| 多 case 共用 | 连续写 case | 用逗号分隔 |

---

## yield 关键字（Java 13+）

在 switch 表达式中，如果 case 块使用 `{}` 代码块（包含多条语句），需要使用 `yield` 关键字返回值：

```java
int num = 2;
String result = switch (num) {
    case 1 -> "one";
    case 2 -> {
        String msg = "two";
        yield msg;  // 使用 yield 返回值
    }
    default -> "other";
};
System.out.println(result);  // 输出：two
```

**两种返回值方式对比：**

| 方式 | 语法 | 适用场景 |
|------|------|----------|
| 箭头直接返回 | `case "apple" -> 1;` | 单行表达式 |
| yield 返回 | `case "apple" -> { yield 1; }` | 多行代码块 |

**注意事项：**
- `yield` 只能在 switch 表达式中使用，不能在普通 switch 语句中使用
- 使用 `{}` 代码块时，必须使用 `yield` 返回值，不能直接写值

---

*笔记整理日期：2026-03-12*
