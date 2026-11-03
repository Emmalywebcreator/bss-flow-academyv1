// Generated from oop_tutor.py (the terminal Python OOP course), then kept here as the
// source for the website version. Example outputs were recorded with Python 3.12.
import type { Topic } from "./topic";

export const BEGINNER_TOPICS: readonly Topic[] = [
  {
    slug: "what-is-oop-classes-and-objects",
    title: "What is OOP? Classes and Objects",
    minutes: 7,
    blocks: [
      { type: "p", text: "Object-Oriented Programming (OOP) organises code around **objects**: bundles of **data** (attributes) and **behaviour** (methods) that belong together." },
      {
        type: "list",
        items: [
          "A **class** is a blueprint — like an architect's plan for a house.",
          "An **object** (instance) is one real thing built from that blueprint.",
        ],
      },
      { type: "p", text: "You can build many houses from one plan; each house is separate, but they share the same design." },
      { type: "p", text: "In Python, **everything** is an object: 5 is an object of class int, \"hi\" is an object of class str, and even functions are objects." },
      {
        type: "code",
        code: `
print(type(5), type("hi"), type([1, 2]))
print("hello".upper())      # upper() is a METHOD of the str object
`,
        output: `
<class 'int'> <class 'str'> <class 'list'>
HELLO
`,
      },
      { type: "p", text: "Defining your own class uses the `class` keyword. Class names use CamelCase by convention. Calling the class like a function creates a new object." },
      {
        type: "code",
        code: `
class Dog:
    pass                    # an empty class body

rex = Dog()                 # create an object (instantiate)
fido = Dog()
print(type(rex))
print(rex is fido)          # two different objects
print(isinstance(rex, Dog))
`,
        output: `
<class '__main__.Dog'>
False
True
`,
      },
      { type: "p", text: "A function defined inside a class is a **method**. Its first parameter is the object itself, named `self` by convention." },
      {
        type: "code",
        code: `
class Dog:
    def bark(self):
        return "Woof!"

rex = Dog()
print(rex.bark())           # Python passes rex as self automatically
print(Dog.bark(rex))        # exactly the same thing, written out
`,
        output: `
Woof!
Woof!
`,
      },
    ],
    quiz: [
      {
        id: "what-is-oop-classes-and-objects-q1",
        question: "What is the relationship between a class and an object?",
        options: ["They are the same thing", "An object is a blueprint; a class is an instance", "A class is a blueprint; an object is an instance built from it", "Classes only exist in Java"],
        answer: 2,
        explanation: "The class describes the design; each object is a concrete instance.",
      },
      {
        id: "what-is-oop-classes-and-objects-q2",
        question: "What does rex = Dog() do?",
        options: ["Defines a class", "Calls a method named Dog", "Creates a new Dog object", "Imports Dog"],
        answer: 2,
        explanation: "Calling a class creates (instantiates) a new object.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Create a class `Dog` with a method `bark()` that **returns** the string `'Woof!'`." },
      ],
      starter: `
class Dog:
    ...
`,
      hint: "Methods need `self` as their first parameter: `def bark(self):`, then `return 'Woof!'` on the next line.",
      solution: `
class Dog:
    def bark(self):
        return 'Woof!'
`,
    },
  },
  {
    slug: "the-constructor-init-and-instance-attributes",
    title: "The Constructor __init__ and Instance Attributes",
    minutes: 7,
    blocks: [
      { type: "p", text: "Most objects need starting data. The special method `__init__` runs automatically every time an object is created. Its job is to set up the object's **instance attributes** — variables stored on `self`." },
      { type: "p", text: "Each object gets its **own** copy of instance attributes." },
      {
        type: "code",
        code: `
class Student:
    def __init__(self, name, age):
        self.name = name    # attribute on THIS object
        self.age = age

a = Student("Ada", 20)
b = Student("Bola", 22)
print(a.name, a.age)
print(b.name, b.age)
a.age = 21                  # attributes can be changed
print(a.age, b.age)
`,
        output: `
Ada 20
Bola 22
21 22
`,
      },
      { type: "p", text: "Default arguments work just like in normal functions. You can also inspect an object's attributes with `vars(obj)` (its `__dict__`)." },
      {
        type: "code",
        code: `
class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

acc = Account("Evans")
print(vars(acc))
print(getattr(acc, "balance"), hasattr(acc, "pin"))
`,
        output: `
{'owner': 'Evans', 'balance': 0}
0 False
`,
      },
      { type: "p", text: "**Common mistake:** forgetting `self.`. Writing `name = name` inside `__init__` just creates a local variable that disappears when `__init__` ends — the object never stores it." },
    ],
    quiz: [
      {
        id: "the-constructor-init-and-instance-attributes-q1",
        question: "When does __init__ run?",
        options: ["Only when you call obj.__init__()", "Automatically when a new object is created", "When the program ends", "When the class is defined"],
        answer: 1,
        explanation: "Python calls __init__ right after creating the object.",
      },
      {
        id: "the-constructor-init-and-instance-attributes-q2",
        question: "Inside __init__, what does self.color = color do?",
        options: ["Stores color as an attribute on the object", "Creates a local variable", "Creates a class attribute", "Nothing"],
        answer: 0,
        explanation: "Assigning to self.<name> stores data on that particular instance.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Create `Book` with `__init__(self, title, author, pages)` storing all three as attributes, and a method `is_long()` that returns `True` if pages > 300, otherwise `False`." },
      ],
      starter: `
class Book:
    def __init__(self, title, author, pages):
        ...
`,
      hint: "Inside `is_long`, read the stored value through `self`: `return self.pages > 300`.",
      solution: `
class Book:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages

    def is_long(self):
        return self.pages > 300
`,
    },
  },
  {
    slug: "methods-and-self-giving-objects-behaviour",
    title: "Methods and self — Giving Objects Behaviour",
    minutes: 8,
    blocks: [
      { type: "p", text: "Methods read and change an object's state through `self`. Think of methods as the actions an object can perform." },
      { type: "p", text: "Good methods:" },
      {
        type: "list",
        items: [
          "Have verb names (deposit, withdraw, move, render)",
          "Keep the object in a valid state",
          "Can call other methods with `self.other_method()`",
        ],
      },
      {
        type: "code",
        code: `
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount
        return self.balance

    def transfer(self, other, amount):
        self.withdraw(amount)   # reuse our own method
        other.deposit(amount)

a = BankAccount("Ada", 100)
b = BankAccount("Bola")
a.transfer(b, 40)
print(a.balance, b.balance)
try:
    a.withdraw(1000)
except ValueError as e:
    print("Error:", e)
`,
        output: `
60 40
Error: Insufficient funds
`,
      },
      { type: "p", text: "Methods can also return `self` to allow **method chaining** — a style used by many libraries (e.g. query builders)." },
      {
        type: "code",
        code: `
class Query:
    def __init__(self):
        self.parts = []
    def select(self, f):
        self.parts.append(f"SELECT {f}"); return self
    def frm(self, t):
        self.parts.append(f"FROM {t}"); return self
    def build(self):
        return " ".join(self.parts)

print(Query().select("*").frm("users").build())
`,
        output: `
SELECT * FROM users
`,
      },
    ],
    quiz: [
      {
        id: "methods-and-self-giving-objects-behaviour-q1",
        question: "What is self?",
        options: ["A Python keyword", "The class itself", "A global variable", "A reference to the object the method was called on"],
        answer: 3,
        explanation: "self is just the first parameter; Python fills it with the instance.",
      },
      {
        id: "methods-and-self-giving-objects-behaviour-q2",
        question: "How does one method call another method on the same object?",
        options: ["other_method()", "this.other_method()", "super.other_method()", "self.other_method()"],
        answer: 3,
        explanation: "Use self.method_name() to call it on the current object.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Create class `Counter`:" },
        {
          type: "list",
          items: [
            "count starts at 0",
            "`increment(step=1)` adds step to count",
            "`reset()` sets count back to 0",
          ],
        },
      ],
      starter: `
class Counter:
    ...
`,
      hint: "Set `self.count = 0` in `__init__`. In `increment(self, step=1)`, add to it with `self.count += step`.",
      solution: `
class Counter:
    def __init__(self):
        self.count = 0

    def increment(self, step=1):
        self.count += step

    def reset(self):
        self.count = 0
`,
    },
  },
  {
    slug: "class-attributes-vs-instance-attributes",
    title: "Class Attributes vs Instance Attributes",
    minutes: 7,
    blocks: [
      { type: "p", text: "**Instance** attributes (`self.x`) belong to one object. **Class** attributes are defined directly in the class body and are **shared** by all instances." },
      { type: "p", text: "Lookup order for `obj.attr`: first the instance, then the class." },
      {
        type: "code",
        code: `
class Employee:
    company = "Royalty Group"   # class attribute (shared)
    headcount = 0

    def __init__(self, name):
        self.name = name          # instance attribute
        Employee.headcount += 1   # update the SHARED counter

a = Employee("Ada"); b = Employee("Bola")
print(a.company, b.company, Employee.headcount)
Employee.company = "Royalty Group Ltd"
print(a.company)                  # both see the change
`,
        output: `
Royalty Group Royalty Group 2
Royalty Group Ltd
`,
      },
      { type: "p", text: "**Trap 1 — Shadowing:** assigning `obj.attr = ...` creates an **instance** attribute that hides the class one for that object only." },
      {
        type: "code",
        code: `
class Config:
    debug = False
c1, c2 = Config(), Config()
c1.debug = True               # creates c1's own attribute
print(c1.debug, c2.debug, Config.debug)
`,
        output: `
True False False
`,
      },
      { type: "p", text: "**Trap 2 — Mutable class attributes are shared:** a list defined at class level is the **same** list for everyone. Create mutable data in `__init__` instead." },
      {
        type: "code",
        code: `
class Bad:
    items = []                # shared by ALL instances!
    def add(self, x): self.items.append(x)

class Good:
    def __init__(self): self.items = []
    def add(self, x): self.items.append(x)

b1, b2 = Bad(), Bad(); b1.add(1)
g1, g2 = Good(), Good(); g1.add(1)
print("Bad:", b2.items, " Good:", g2.items)
`,
        output: `
Bad: [1]  Good: []
`,
      },
    ],
    quiz: [
      {
        id: "class-attributes-vs-instance-attributes-q1",
        question: "Where should you define a list that each object needs its own copy of?",
        options: ["Inside __init__ using self", "As a class attribute", "As a global", "It doesn't matter"],
        answer: 0,
        explanation: "Class-level mutable objects are shared; put per-object data in __init__.",
      },
      {
        id: "class-attributes-vs-instance-attributes-q2",
        question: "c1.debug = True when debug is a class attribute does what?",
        options: ["Changes it for every instance", "Raises an error", "Deletes the class attribute", "Creates an instance attribute on c1 only"],
        answer: 3,
        explanation: "Assignment through an instance creates/updates an INSTANCE attribute.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Create `Employee` with a class attribute `company = 'Royalty Group'` and a class attribute `headcount` that increases by 1 each time an `Employee(name)` is created." },
      ],
      starter: `
class Employee:
    ...
`,
      hint: "Increase it with `Employee.headcount += 1`, not `self.headcount += 1`, which creates an instance attribute that shadows the class one.",
      solution: `
class Employee:
    company = 'Royalty Group'
    headcount = 0

    def __init__(self, name):
        self.name = name
        Employee.headcount += 1
`,
    },
  },
  {
    slug: "printing-objects-str-and-repr",
    title: "Printing Objects: __str__ and __repr__",
    minutes: 7,
    blocks: [
      { type: "p", text: "By default printing an object shows something unhelpful like `<__main__.Point object at 0x7f...>`. Two special methods fix that:" },
      { type: "table", text: `
__str__   → friendly text for end users   (print(), str())
__repr__  → precise text for developers   (REPL, debugging, lists)
` },
      { type: "p", text: "Rule of thumb: `__repr__` should look like code that recreates the object. If only `__repr__` is defined, `str()` falls back to it." },
      {
        type: "code",
        code: `
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __str__(self):
        return f"({self.x}, {self.y})"
    def __repr__(self):
        return f"Point(x={self.x!r}, y={self.y!r})"

p = Point(2, 3)
print(p)              # uses __str__
print(repr(p))        # uses __repr__
print([p, Point(0, 0)])   # containers use __repr__
print(f"{p} vs {p!r}")
`,
        output: `
(2, 3)
Point(x=2, y=3)
[Point(x=2, y=3), Point(x=0, y=0)]
(2, 3) vs Point(x=2, y=3)
`,
      },
      { type: "p", text: "Methods whose names start and end with double underscores are called **dunder** (double-underscore) or \"magic\" methods. Python calls them for you in response to built-in operations. You'll meet many more in the Operator Overloading part of the next lesson." },
    ],
    quiz: [
      {
        id: "printing-objects-str-and-repr-q1",
        question: "Which method does print(obj) use first?",
        options: ["__repr__", "__str__", "__print__", "__init__"],
        answer: 1,
        explanation: "print calls str(), which uses __str__ (falling back to __repr__).",
      },
      {
        id: "printing-objects-str-and-repr-q2",
        question: "What does a list of objects show when printed?",
        options: ["Each item's __str__", "Memory addresses only", "Each item's __repr__", "Nothing"],
        answer: 2,
        explanation: "Containers display their items with repr().",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Create `Point(x, y)` where `str(p)` is `'(2, 3)'` and `repr(p)` is `'Point(x=2, y=3)'`." },
      ],
      starter: `
class Point:
    ...
`,
      hint: "Use f-strings: `return f'({self.x}, {self.y})'` in `__str__`, and the same idea for `__repr__`.",
      solution: `
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __str__(self):
        return f'({self.x}, {self.y})'

    def __repr__(self):
        return f'Point(x={self.x}, y={self.y})'
`,
    },
  },
];
