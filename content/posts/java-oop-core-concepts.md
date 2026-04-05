---
title: "Java 面向对象核心概念：多态、抽象类与 default 方法"
slug: "java-oop-core-concepts"
excerpt: "深入理解 Java 面向对象编程的核心概念：多态与覆写的关系、抽象类的权限修饰符、以及 Java 8 引入的 default 方法。"
date: "2026-03-20"
tags: ["Java", "面向对象", "编程", "后端"]
published: true
---

# Java 面向对象核心概念：多态、抽象类与 default 方法

## 多态与覆写

### 概念

- **多态** = 同一个方法调用，不同对象有不同行为
- **覆写** = 子类重新定义从父类继承的方法

### 示例

```java
class Animal {
    speak() { return "..." }
}

class Dog extends Animal {
    speak() { return "汪" }  // 覆写
}

class Cat extends Animal {
    speak() { return "喵" }  // 覆写
}
```

### 调用示例

```java
Animal[] animals = {new Dog(), new Cat()};
for (Animal a : animals) {
    a.speak();  // 输出: 汪, 喵
}
```

### 因果关系（易混淆点）

**错误说法：**

> "由于多态的存在，子类可以覆写父类方法"

**正确关系：**

```
覆写（机制/原因） → 多态（效果/结果）
```

**更准确的说法：**

- 覆写父类方法，使多态成为可能
- 多态依赖于覆写机制

### 关键点

| 概念  | 角色  | 说明        |
| --- | --- | --------- |
| 覆写  | 机制  | 子类重定义父类方法 |
| 多态  | 效果  | 同一接口，不同实现 |

---

## 抽象类与权限修饰符

### 抽象类可以使用权限修饰符

```java
// 有修饰符（推荐）
public abstract class Animal { }
protected abstract class Base { }
abstract class Internal { }  // 默认 package-private

// 没有 abstract 就不是抽象类
public class Animal { }  // 普通类
```

### 权限修饰符可见性

| 修饰符         | 可见性                   |
| ----------- | --------------------- |
| `public`    | 所有类可见                 |
| `protected` | 同包 + 子类可见             |
| 无修饰符        | 同包可见（package-private） |
| `private`   | ❌ 抽象类不能用（无法被继承）       |

### 抽象方法也需要修饰符

```java
public abstract class Animal {
    public abstract void speak();      // public
    protected abstract void eat();     // protected
    abstract void sleep();             // package-private
}
```

### 关键点

- 权限修饰符是**独立的**，控制访问级别
- `abstract` 只是表示"不能实例化，必须被继承"
- 抽象类不能用 `private`（会导致无法继承，矛盾）

---

## default 方法（Java 8+）

### 概念

**default 方法 = 接口中的默认实现方法**（Java 8 引入）

### 对比

```java
interface Animal {
    void speak();              // 抽象方法，子类必须实现

    default void eat() {       // default 方法，有默认实现
        System.out.println("吃东西");
    }
}
```

### 子类使用

```java
class Dog implements Animal {
    @Override
    public void speak() {      // 必须实现
        System.out.println("汪");
    }
    // eat() 可以不写，直接继承默认实现

    // 也可以覆写
    @Override
    public void eat() {
        System.out.println("吃狗粮");
    }
}
```

### 为什么需要 default？

1. **向后兼容**：给旧接口添加新方法，不破坏已有实现
2. **代码复用**：接口提供通用实现

### 对比表

| 特性  | 抽象方法       | default 方法 |
| --- | ---------- | ---------- |
| 关键字 | 无/abstract | default    |
| 实现  | ❌ 没有       | ✅ 有        |
| 子类  | 必须覆写       | 可选覆写       |

---

## 总结

1. **多态**是覆写带来的效果，因果顺序：覆写 → 多态
2. **抽象类**可以用任意权限修饰符（除 private）
3. **default 方法**让接口可以有默认实现，解决向后兼容问题

---

*笔记整理日期：2026-03-20*
