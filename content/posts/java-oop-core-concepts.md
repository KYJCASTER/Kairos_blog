---
title: "Java 面向对象核心概念：多态、抽象类与 default 方法"
slug: "java-oop-core-concepts"
excerpt: "把三个容易学混的概念一次理顺：覆写与多态谁因谁果、动态分派到底看编译期类型还是运行期类型、顶层类到底能用哪些修饰符，以及接口 default 方法解决的是什么问题、菱形冲突怎么办。"
date: "2026-03-20"
updated: "2026-07-26"
tags: ["编程", "Java"]
series: "Java 学习笔记"
published: true
---

# Java 面向对象核心概念：多态、抽象类与 default 方法

这篇是我整理 Java 面向对象时踩过的几个概念坑。它们的共同点是：单独看每个名词都「懂」，但一旦让你解释它们之间的关系，就开始含糊。下面按「覆写与多态 → 抽象类与修饰符 → default 方法」的顺序理一遍，所有代码都可以直接编译运行。

## 一、覆写与多态：谁是因，谁是果

先给出可运行的最小例子：

```java
class Animal {
    String speak() {
        return "...";
    }
}

class Dog extends Animal {
    @Override
    String speak() {
        return "汪";
    }
}

class Cat extends Animal {
    @Override
    String speak() {
        return "喵";
    }
}

public class Main {
    public static void main(String[] args) {
        Animal[] animals = { new Dog(), new Cat() };
        for (Animal a : animals) {
            System.out.println(a.speak());   // 汪 / 喵
        }
    }
}
```

循环变量 `a` 的类型始终是 `Animal`，但 `a.speak()` 每次的行为却不同——这就是**多态**（polymorphism）：同一个调用表达式，随对象的实际类型表现出不同行为。

### 编译期类型 vs 运行期类型

理解多态的关键，是把一个变量的两个「类型」分开：

- **编译期类型（静态类型）**：变量声明的类型。上例中 `a` 的编译期类型是 `Animal`。编译器只根据它检查「这个方法能不能调」——`Animal` 里声明了 `speak()`，所以 `a.speak()` 合法。
- **运行期类型（动态类型）**：对象实际 `new` 出来的类型。JVM 在调用发生的那一刻，根据运行期类型去找**实际执行哪一份** `speak()`。

这个「运行时按实际类型选方法体」的机制叫**动态分派**（dynamic dispatch）。Java 中实例方法的调用默认就是动态分派的（`static`、`private`、构造器除外——它们在编译期就绑定了）。

### 因果关系：覆写是机制，多态是效果

初学时很容易说出这样的句子：

> 「由于多态的存在，子类可以覆写父类方法。」

这句话因果颠倒了。正确的关系是：

```text
覆写（子类重新定义继承来的方法）  →  多态（同一调用表现出不同行为）
        机制 / 原因                        效果 / 结果
```

如果 `Dog` 和 `Cat` 都不覆写 `speak()`，上面的循环仍然合法，只是两次都打印 `...`——调用还是那个调用，但「多态」无从谈起。**是覆写让动态分派有了可分派的差异，多态才作为现象显现出来。**

顺带养成习惯：覆写时永远写上 `@Override`。它不是装饰，而是让编译器帮你校验「这确实覆写了父类/接口的方法」。少个参数、拼错方法名这类事故，没有 `@Override` 时会静默变成一个毫无关系的新方法。

## 二、抽象类与访问修饰符

第二个坑是修饰符。先把结论表摆出来——注意**顶层类**和**成员（方法、字段、嵌套类）**的规则不一样：

| 修饰符 | 顶层类 | 类的成员 | 可见范围 |
|--------|:------:|:--------:|----------|
| `public` | ✅ | ✅ | 所有类 |
| `protected` | ❌ | ✅ | 同包 + 子类 |
| （无修饰符） | ✅ | ✅ | 同包（package-private） |
| `private` | ❌ | ✅ | 仅本类 |

很多笔记（包括这篇的第一版）会写出 `protected abstract class Base { }` 这样的「示例」——**它根本编译不过**。`protected` 和 `private` 只能用于嵌套类，顶层类只有 `public` 和 package-private 两种可见性。

`abstract` 与访问修饰符是两个**正交**的维度：

```java
public abstract class Shape {            // 对所有包可见的抽象类
    public abstract double area();       // 子类必须实现
    abstract void render();              // 同包子类才可见的抽象方法
}

abstract class PackageLocal { }          // 仅同包可见的抽象类
```

- 访问修饰符回答「**谁能看到我**」;
- `abstract` 回答「**我能不能被实例化**」（不能，必须有子类补全实现）。

唯一的交叉限制是：**抽象方法不能是 `private`**。原因想一下就通：抽象方法的存在意义就是让子类实现，而 `private` 方法子类根本看不见，两者自相矛盾，编译器直接拒绝。

## 三、接口的 default 方法（Java 8+）

### 它解决的问题：接口演化

Java 8 之前，接口里的方法一律没有方法体。这带来一个真实的工程难题：**接口一旦发布就不能再加方法**——加一个，所有实现类立刻全部编译失败。

Java 8 想给 `Collection` 家族加上 `stream()`、`forEach()` 这类方法，又不能砸了全世界已有的实现类，于是引入了 **default 方法**：接口中带默认实现的方法。

```java
interface Animal {
    String speak();                          // 抽象方法：实现类必须提供

    default void eat() {                     // default 方法：自带实现
        System.out.println("吃东西");
    }
}

class Dog implements Animal {
    @Override
    public String speak() {
        return "汪";
    }
    // eat() 不写，直接继承默认实现；想定制也可以覆写：
    @Override
    public void eat() {
        System.out.println("吃狗粮");
    }
}
```

对比一下两类方法：

| 特性 | 抽象方法 | default 方法 |
|------|----------|--------------|
| 方法体 | 没有 | 有 |
| 实现类 | 必须实现 | 可选覆写 |
| 引入动机 | 定义契约 | 让契约能演化 |

### 菱形冲突：两个接口带来同名 default

default 方法给接口装上了实现，也就顺便引进了多继承才有的经典问题——一个类实现的两个接口，各自带了同签名的 default 方法：

```java
interface Swimmer {
    default void move() { System.out.println("游"); }
}

interface Runner {
    default void move() { System.out.println("跑"); }
}

class Duck implements Swimmer, Runner {
    // 不写 move() 会编译错误：继承了两个无关的默认实现
    @Override
    public void move() {
        Swimmer.super.move();   // 显式选用其中一个（也可以完全自己写）
    }
}
```

Java 的处理方式很务实：**编译器不替你猜，冲突时强制你亲自表态**。`接口名.super.方法名()` 这个语法专门用于在实现类中点名调用某个接口的默认实现。

另外记两条规则，面试和读源码都用得上：

1. **类优先于接口。** 如果父类和接口提供了同签名方法，父类的实现胜出，default 方法被忽略。
2. default 方法不能覆写 `Object` 的方法（`equals`/`hashCode`/`toString`）——这些永远由类说了算。

## 小结

1. **覆写是机制，多态是效果**：动态分派在运行期按对象实际类型选择方法体，覆写提供了可供选择的差异。
2. **顶层类只有 `public` 和 package-private 两种可见性**；`abstract` 与访问控制正交，唯一禁区是 `private abstract`。
3. **default 方法是为接口演化而生的**；菱形冲突时编译器强制显式消歧，语法是 `接口名.super.方法名()`。

---

*笔记整理于 2026-03-20，2026-07-26 重写并修正了第一版中两处不能编译的示例。*
