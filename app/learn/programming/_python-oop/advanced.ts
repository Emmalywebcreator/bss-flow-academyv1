// Generated from oop_tutor.py (the terminal Python OOP course), then kept here as the
// source for the website version. Example outputs were recorded with Python 3.12.
import type { Topic } from "./topic";

export const ADVANCED_TOPICS: readonly Topic[] = [
  {
    slug: "abstract-base-classes-abc",
    title: "Abstract Base Classes (abc)",
    minutes: 8,
    blocks: [
      { type: "p", text: "An **abstract base class** defines an interface: methods that every subclass **must** implement. You cannot create an instance of an ABC, and a subclass that forgets an abstract method also can't be instantiated." },
      { type: "p", text: "This catches mistakes **early** (at creation time) instead of when the missing method is finally called." },
      {
        type: "code",
        code: `
from abc import ABC, abstractmethod

class Storage(ABC):
    @abstractmethod
    def save(self, key, data): ...
    @abstractmethod
    def load(self, key): ...

    def exists(self, key):              # concrete methods are allowed
        try:
            self.load(key); return True
        except KeyError:
            return False

class MemoryStorage(Storage):
    def __init__(self): self._d = {}
    def save(self, key, data): self._d[key] = data
    def load(self, key): return self._d[key]

class Incomplete(Storage):
    def save(self, key, data): pass      # forgot load()

s = MemoryStorage(); s.save("a", 1)
print(s.load("a"), s.exists("a"), s.exists("b"))
for cls in (Storage, Incomplete):
    try: cls()
    except TypeError as e: print("TypeError:", e)
`,
        output: `
1 True False
TypeError: Can't instantiate abstract class Storage without an implementation for abstract methods 'load', 'save'
TypeError: Can't instantiate abstract class Incomplete without an implementation for abstract method 'load'
`,
      },
      { type: "p", text: "Abstract properties are possible too: stack `@property` on top of `@abstractmethod`. The standard library ships many ABCs in `collections.abc` (`Iterable`, `Mapping`, `Sequence`...). Inheriting from them gives you lots of methods for free:" },
      {
        type: "code",
        code: `
from collections.abc import Sequence

class Range3(Sequence):                # implement 2 methods...
    def __getitem__(self, i): return [10, 20, 30][i]
    def __len__(self): return 3

r = Range3()                           # ...get index, count, in, reversed free
print(r.index(20), r.count(30), 30 in r, list(reversed(r)))
`,
        output: `
1 1 True [30, 20, 10]
`,
      },
    ],
    quiz: [
      {
        id: "abstract-base-classes-abc-q1",
        question: "What happens when you instantiate a subclass that doesn't implement all abstract methods?",
        options: ["TypeError", "It works", "The method returns None", "A warning"],
        answer: 0,
        explanation: "Python refuses to instantiate it.",
      },
      {
        id: "abstract-base-classes-abc-q2",
        question: "Can an ABC contain normal (concrete) methods?",
        options: ["No", "Only static ones", "Yes", "Only properties"],
        answer: 2,
        explanation: "ABCs can mix abstract and concrete methods.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Create abstract class `PaymentMethod(ABC)` with abstract method `pay(amount)`. Create `Card` → `pay(100)` returns `'Paid 100 by card'`, and `Transfer` → `pay(50)` returns `'Paid 50 by transfer'`." },
      ],
      starter: `
from abc import ABC, abstractmethod

class PaymentMethod(ABC):
    ...
`,
      hint: "Decorate `pay` with `@abstractmethod` in `PaymentMethod`, then implement it in each subclass.",
      solution: `
from abc import ABC, abstractmethod

class PaymentMethod(ABC):
    @abstractmethod
    def pay(self, amount):
        ...

class Card(PaymentMethod):
    def pay(self, amount):
        return f'Paid {amount} by card'

class Transfer(PaymentMethod):
    def pay(self, amount):
        return f'Paid {amount} by transfer'
`,
    },
  },
  {
    slug: "multiple-inheritance-mro-and-mixins",
    title: "Multiple Inheritance, MRO and Mixins",
    minutes: 8,
    blocks: [
      { type: "p", text: "A class can inherit from several parents. Python decides lookup order with the C3 linearisation algorithm → the MRO. Rules of thumb:" },
      {
        type: "list",
        items: [
          "children before parents",
          "parents in the order listed",
          "each class appears once",
        ],
      },
      { type: "p", text: "The classic \"diamond\":" },
      {
        type: "code",
        code: `
class A:
    def hello(self): return "A"
class B(A):
    def hello(self): return "B -> " + super().hello()
class C(A):
    def hello(self): return "C -> " + super().hello()
class D(B, C):
    def hello(self): return "D -> " + super().hello()

print([k.__name__ for k in D.__mro__])
print(D().hello())     # note: B's super() goes to C, not A!
`,
        output: `
['D', 'B', 'C', 'A', 'object']
D -> B -> C -> A
`,
      },
      { type: "p", text: "That's why `super()` is called \"next in the MRO\", not \"parent\". Cooperative classes all call `super()` so every class runs exactly once." },
      { type: "p", text: "The most practical use of multiple inheritance is **mixins**: small classes that add **one** capability and are not meant to stand alone." },
      {
        type: "code",
        code: `
import json

class JsonMixin:
    def to_json(self):
        return json.dumps(vars(self))

class ReprMixin:
    def __repr__(self):
        fields = ", ".join(f"{k}={v!r}" for k, v in vars(self).items())
        return f"{type(self).__name__}({fields})"

class Product(ReprMixin, JsonMixin):
    def __init__(self, name, price):
        self.name, self.price = name, price

p = Product("Pen", 2.5)
print(p)
print(p.to_json())
`,
        output: `
Product(name='Pen', price=2.5)
{"name": "Pen", "price": 2.5}
`,
      },
      { type: "p", text: "Guidelines: keep mixins small, stateless and named `...Mixin`; list them **before** the main base class; use `super()` in every `__init__` when combining classes that have state." },
    ],
    quiz: [
      {
        id: "multiple-inheritance-mro-and-mixins-q1",
        question: "In class D(B, C) where both inherit A, what is D's MRO?",
        options: ["D, A, B, C", "D, B, A, C, object", "D, C, B, A", "D, B, C, A, object"],
        answer: 3,
        explanation: "C3 linearisation: D, B, C, A, object.",
      },
      {
        id: "multiple-inheritance-mro-and-mixins-q2",
        question: "A mixin is...",
        options: ["A class you instantiate on its own", "A small class adding one reusable capability", "A metaclass", "A module"],
        answer: 1,
        explanation: "Mixins bolt on behaviour like serialisation or logging.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Create `JsonMixin` with `to_json()` returning `json.dumps` of the object's attributes, and `User(name, age)` that uses the mixin. `User('ada', 30).to_json()` → `'{\"name\": \"ada\", \"age\": 30}'`" },
      ],
      starter: `
import json

class JsonMixin:
    ...
`,
      hint: "`vars(self)` returns the instance's attributes as a dict, and `json.dumps` turns a dict into a string.",
      solution: `
import json

class JsonMixin:
    def to_json(self):
        return json.dumps(vars(self))

class User(JsonMixin):
    def __init__(self, name, age):
        self.name = name
        self.age = age
`,
    },
  },
  {
    slug: "dataclasses-less-boilerplate",
    title: "Dataclasses — Less Boilerplate",
    minutes: 8,
    blocks: [
      { type: "p", text: "Many classes just hold data. `@dataclass` auto-generates `__init__`, `__repr__` and `__eq__` from type-annotated fields." },
      { type: "p", text: "Options:" },
      { type: "table", text: `
@dataclass(frozen=True)  → immutable & hashable
@dataclass(order=True)   → adds < <= > >=
@dataclass(slots=True)   → uses __slots__ (Python 3.10+)
` },
      {
        type: "code",
        code: `
from dataclasses import dataclass, field, asdict

@dataclass
class Item:
    name: str
    price: float
    qty: int = 1                            # default value
    tags: list = field(default_factory=list) # safe mutable default

    def total(self):
        return self.price * self.qty

a = Item("Pen", 2.5, 4)
print(a)
print(a.total(), a == Item("Pen", 2.5, 4))
print(asdict(a))
`,
        output: `
Item(name='Pen', price=2.5, qty=4, tags=[])
10.0 True
{'name': 'Pen', 'price': 2.5, 'qty': 4, 'tags': []}
`,
      },
      { type: "p", text: "`__post_init__` runs after the generated `__init__` — perfect for validation or computed fields." },
      {
        type: "code",
        code: `
from dataclasses import dataclass, field

@dataclass(frozen=True, order=True)
class Version:
    major: int
    minor: int = 0
    patch: int = 0

    def __post_init__(self):
        if min(self.major, self.minor, self.patch) < 0:
            raise ValueError("negative version")

vs = [Version(2, 1), Version(1, 9, 9), Version(2, 0, 5)]
print(sorted(vs))
print({Version(1): "hashable because frozen"})
try:
    vs[0].major = 9
except Exception as e:
    print(type(e).__name__)
`,
        output: `
[Version(major=1, minor=9, patch=9), Version(major=2, minor=0, patch=5), Version(major=2, minor=1, patch=0)]
{Version(major=1, minor=0, patch=0): 'hashable because frozen'}
FrozenInstanceError
`,
      },
      { type: "p", text: "**Why `default_factory`?** A plain `tags: list = []` would be **one** list shared by all instances (the trap from Class Attributes vs Instance Attributes, in the Basics lesson). Dataclasses actually refuse that and raise `ValueError` to protect you." },
    ],
    quiz: [
      {
        id: "dataclasses-less-boilerplate-q1",
        question: "Which methods does @dataclass generate by default?",
        options: ["__init__, __repr__, __eq__", "__init__ only", "__hash__ and __lt__", "None"],
        answer: 0,
        explanation: "Ordering and hashing need extra options (order=True, frozen=True).",
      },
      {
        id: "dataclasses-less-boilerplate-q2",
        question: "How do you give a dataclass field an empty list default?",
        options: ["tags: list = []", "tags: list = field(default_factory=list)", "tags = list", "You can't"],
        answer: 1,
        explanation: "default_factory creates a fresh list per instance.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Create `@dataclass` `Product` with fields `name: str`, `price: float`, `quantity: int = 0` and `tags: list` (an empty list by default). Add `total()`, returning `price * quantity`, and raise `ValueError` in `__post_init__` if the price is negative." },
      ],
      starter: `
from dataclasses import dataclass, field

@dataclass
class Product:
    ...
`,
      hint: "For the list: `tags: list = field(default_factory=list)`.",
      solution: `
from dataclasses import dataclass, field

@dataclass
class Product:
    name: str
    price: float
    quantity: int = 0
    tags: list = field(default_factory=list)

    def __post_init__(self):
        if self.price < 0:
            raise ValueError('negative price')

    def total(self):
        return self.price * self.quantity
`,
    },
  },
  {
    slug: "protocols-iterators-generators-and-context-managers",
    title: "Protocols: Iterators, Generators and Context Managers",
    minutes: 8,
    blocks: [
      { type: "p", text: "A **protocol** is a set of dunder methods Python expects for a feature." },
      { type: "p", text: "**Iteration protocol**" },
      { type: "table", text: `
__iter__()  → returns an iterator
__next__()  → returns the next value or raises StopIteration
` },
      { type: "p", text: "The easiest way: make `__iter__` a **generator** (use `yield`). Then each for-loop gets a fresh iterator, so the object is re-iterable." },
      {
        type: "code",
        code: `
class Countdown:
    def __init__(self, start): self.start = start
    def __iter__(self):
        n = self.start
        while n > 0:
            yield n
            n -= 1

c = Countdown(3)
print(list(c), list(c))      # re-iterable
it = iter(c)
print(next(it), next(it))
`,
        output: `
[3, 2, 1] [3, 2, 1]
3 2
`,
      },
      { type: "p", text: "**Context manager protocol** (the `with` statement)" },
      { type: "table", text: `
__enter__()                   → setup, value bound by \`as\`
__exit__(exc_type, exc, tb)   → cleanup, always runs (even on errors)
                                 return True to swallow the exception
` },
      { type: "p", text: "Used for files, locks, DB transactions, timers..." },
      {
        type: "code",
        code: `
import time

class Transaction:
    def __init__(self, name): self.name = name
    def __enter__(self):
        print(f"BEGIN {self.name}")
        return self
    def __exit__(self, exc_type, exc, tb):
        if exc_type:
            print(f"ROLLBACK {self.name} because: {exc}")
        else:
            print(f"COMMIT {self.name}")
        return True               # suppress the error for this demo

with Transaction("pay-1"):
    print("  moving money...")
with Transaction("pay-2"):
    raise RuntimeError("card declined")
print("program continues")
`,
        output: `
BEGIN pay-1
  moving money...
COMMIT pay-1
BEGIN pay-2
ROLLBACK pay-2 because: card declined
program continues
`,
      },
      { type: "p", text: "Shortcut: `contextlib.contextmanager` turns a generator into a context manager — code before `yield` is `__enter__`, after is `__exit__`." },
    ],
    quiz: [
      {
        id: "protocols-iterators-generators-and-context-managers-q1",
        question: "What must __next__ do when there are no more items?",
        options: ["Return None", "Return -1", "Loop forever", "Raise StopIteration"],
        answer: 3,
        explanation: "StopIteration signals the end to for-loops.",
      },
      {
        id: "protocols-iterators-generators-and-context-managers-q2",
        question: "When does __exit__ run?",
        options: ["Only on success", "Always when leaving the with block", "Only on error", "Never automatically"],
        answer: 1,
        explanation: "That's the point: guaranteed cleanup.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Write two classes:" },
        {
          type: "list",
          items: [
            "`Countdown(n)`, which is re-iterable: `list(Countdown(3))` → `[3, 2, 1]`, every time.",
            "`Timer`, a context manager: after `with Timer() as t:`, the attribute `t.elapsed` holds the seconds taken, as a float. Use `time.perf_counter()`.",
          ],
        },
      ],
      starter: `
import time

class Countdown:
    ...

class Timer:
    ...
`,
      hint: "`__enter__` stores `self.start` and returns `self`; `__exit__` sets `self.elapsed`.",
      solution: `
import time

class Countdown:
    def __init__(self, n):
        self.n = n
    def __iter__(self):
        for i in range(self.n, 0, -1):
            yield i

class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self
    def __exit__(self, *exc):
        self.elapsed = time.perf_counter() - self.start
        return False
`,
    },
  },
  {
    slug: "descriptors-how-properties-really-work",
    title: "Descriptors — How Properties Really Work",
    minutes: 8,
    blocks: [
      { type: "p", text: "A **descriptor** is an object, stored as a **class** attribute, that controls what happens when that attribute is accessed on instances. It implements any of:" },
      { type: "table", text: `
__get__(self, obj, objtype)     __set__(self, obj, value)
__delete__(self, obj)           __set_name__(self, owner, name)
` },
      { type: "p", text: "`@property`, `@classmethod`, `@staticmethod` and even normal methods are all built on descriptors. Write your own to **reuse** validation logic across many attributes and classes." },
      {
        type: "code",
        code: `
class Typed:
    def __init__(self, kind): self.kind = kind
    def __set_name__(self, owner, name):        # learns its attribute name
        self.private = "_" + name
    def __get__(self, obj, objtype=None):
        if obj is None:                         # accessed on the class
            return self
        return getattr(obj, self.private)
    def __set__(self, obj, value):
        if not isinstance(value, self.kind):
            raise TypeError(f"{self.private[1:]} must be {self.kind.__name__}")
        setattr(obj, self.private, value)

class Person:
    name = Typed(str)
    age = Typed(int)
    def __init__(self, name, age):
        self.name, self.age = name, age

p = Person("Ada", 30)
print(p.name, p.age)
try:
    p.age = "thirty"
except TypeError as e:
    print("TypeError:", e)
`,
        output: `
Ada 30
TypeError: age must be int
`,
      },
      { type: "p", text: "Data descriptors (with `__set__`) take priority over the instance `__dict__`. Non-data descriptors (only `__get__`) — like functions — can be shadowed by instance attributes. That's how methods bind `self`: `function.__get__` returns a bound method." },
      {
        type: "code",
        code: `
class K:
    def hi(self): return "hi"
k = K()
print(K.__dict__["hi"])                 # plain function
print(K.__dict__["hi"].__get__(k, K))   # bound method — this is what k.hi gives
`,
        output: `
<function K.hi at 0x7b831f93cea0>
<bound method K.hi of <__main__.K object at 0x7b831f91bda0>>
`,
      },
    ],
    quiz: [
      {
        id: "descriptors-how-properties-really-work-q1",
        question: "Where must a descriptor object be stored to work?",
        options: ["On the instance", "In a global", "In __slots__", "As a class attribute"],
        answer: 3,
        explanation: "Descriptors only work as class attributes.",
      },
      {
        id: "descriptors-how-properties-really-work-q2",
        question: "What does __set_name__ give the descriptor?",
        options: ["The value", "The instance", "The owner class and the attribute name", "The MRO"],
        answer: 2,
        explanation: "Called once at class creation so it knows its own name.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Write descriptor `Positive` that raises `ValueError` when assigned a value <= 0. Use it in `Order(qty, price)` for both `qty` and `price`. Each `Order` must store its own values." },
      ],
      starter: `
class Positive:
    ...

class Order:
    qty = Positive()
    price = Positive()
`,
      hint: "Use `__set_name__` to save a private name such as `'_qty'`, then `getattr` and `setattr` on `obj` with it.",
      solution: `
class Positive:
    def __set_name__(self, owner, name):
        self.private = '_' + name
    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, self.private)
    def __set__(self, obj, value):
        if value <= 0:
            raise ValueError('must be positive')
        setattr(obj, self.private, value)

class Order:
    qty = Positive()
    price = Positive()
    def __init__(self, qty, price):
        self.qty = qty
        self.price = price
`,
    },
  },
  {
    slug: "slots-and-memory-efficient-objects",
    title: "__slots__ and Memory-Efficient Objects",
    minutes: 7,
    blocks: [
      { type: "p", text: "Normally each object stores attributes in a dict (`__dict__`), which is flexible but uses memory. `__slots__` declares a **fixed** set of attributes and removes the per-instance dict." },
      { type: "p", text: "Benefits: less memory (great for millions of small objects), slightly faster attribute access, and typos like `p.colr = 1` raise errors. Cost: you can't add new attributes dynamically." },
      {
        type: "code",
        code: `
import sys

class Normal:
    def __init__(self, x, y): self.x, self.y = x, y

class Slotted:
    __slots__ = ("x", "y")
    def __init__(self, x, y): self.x, self.y = x, y

n, s = Normal(1, 2), Slotted(1, 2)
print("Normal :", sys.getsizeof(n) + sys.getsizeof(n.__dict__), "bytes")
print("Slotted:", sys.getsizeof(s), "bytes")
try:
    s.z = 3
except AttributeError as e:
    print("AttributeError:", e)
`,
        output: `
Normal : 344 bytes
Slotted: 48 bytes
AttributeError: 'Slotted' object has no attribute 'z'
`,
      },
      { type: "p", text: "Notes:" },
      {
        type: "list",
        items: [
          "Subclasses must declare their own `__slots__` too, or they regain a `__dict__`.",
          "Slots are implemented with descriptors (see the previous part).",
          "`@dataclass(slots=True)` does it for you on Python 3.10+.",
        ],
      },
    ],
    quiz: [
      {
        id: "slots-and-memory-efficient-objects-q1",
        question: "What does __slots__ remove from instances?",
        options: ["Methods", "The class", "The per-instance __dict__", "__init__"],
        answer: 2,
        explanation: "Attributes live in fixed slots instead of a dict.",
      },
      {
        id: "slots-and-memory-efficient-objects-q2",
        question: "With __slots__ = ('x',), what does obj.y = 1 do?",
        options: ["Raises AttributeError", "Works", "Creates a class attribute", "Silently ignored"],
        answer: 0,
        explanation: "Only declared slots can be assigned.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Create `Pixel(x, y, color)` that uses `__slots__` so instances have no `__dict__` and adding other attributes raises `AttributeError`." },
      ],
      starter: `
class Pixel:
    ...
`,
      hint: "One line in the class body does it: `__slots__ = ('x', 'y', 'color')`.",
      solution: `
class Pixel:
    __slots__ = ('x', 'y', 'color')

    def __init__(self, x, y, color):
        self.x, self.y, self.color = x, y, color
`,
    },
  },
  {
    slug: "metaclasses-and-init-subclass",
    title: "Metaclasses and __init_subclass__",
    minutes: 8,
    blocks: [
      { type: "p", text: "Classes are objects too — so what creates them? A **metaclass**. The default metaclass is `type`." },
      { type: "table", text: `
obj  is an instance of  MyClass
MyClass  is an instance of  type
` },
      { type: "p", text: "You can even build a class by calling `type(name, bases, namespace)`." },
      {
        type: "code",
        code: `
class Foo: pass
print(type(Foo), type(type))

Bar = type("Bar", (), {"greet": lambda self: "hello from Bar"})
print(Bar().greet())
`,
        output: `
<class 'type'> <class 'type'>
hello from Bar
`,
      },
      { type: "p", text: "A custom metaclass can intercept **class creation** — enforce rules, register classes, add methods. Frameworks (Django models, SQLAlchemy, enum) use this." },
      {
        type: "code",
        code: `
class RequireDocs(type):
    def __new__(mcls, name, bases, ns):
        for attr, val in ns.items():
            if callable(val) and not attr.startswith("_") and not val.__doc__:
                raise TypeError(f"{name}.{attr} needs a docstring")
        return super().__new__(mcls, name, bases, ns)

class Good(metaclass=RequireDocs):
    def run(self):
        "Runs the thing."
try:
    class Bad(metaclass=RequireDocs):
        def run(self): pass
except TypeError as e:
    print("TypeError:", e)
`,
        output: `
TypeError: Bad.run needs a docstring
`,
      },
      { type: "p", text: "\"Metaclasses are deeper magic than 99% of users should ever worry about.\" — Tim Peters. Usually `__init_subclass__` (Python 3.6+) is a much simpler way to hook into subclass creation — e.g. a **plugin registry**:" },
      {
        type: "code",
        code: `
class Exporter:
    registry = {}
    def __init_subclass__(cls, fmt=None, **kwargs):
        super().__init_subclass__(**kwargs)
        if fmt:
            Exporter.registry[fmt] = cls

class CSVExporter(Exporter, fmt="csv"): pass
class PDFExporter(Exporter, fmt="pdf"): pass

print(Exporter.registry)
print(Exporter.registry["pdf"]())
`,
        output: `
{'csv': <class '__main__.CSVExporter'>, 'pdf': <class '__main__.PDFExporter'>}
<__main__.PDFExporter object at 0x7b831f91b890>
`,
      },
    ],
    quiz: [
      {
        id: "metaclasses-and-init-subclass-q1",
        question: "What is the default metaclass in Python?",
        options: ["object", "class", "meta", "type"],
        answer: 3,
        explanation: "Every class is an instance of type by default.",
      },
      {
        id: "metaclasses-and-init-subclass-q2",
        question: "Which is usually the simpler way to run code whenever a subclass is created?",
        options: ["A metaclass", "__init_subclass__", "__new__ on instances", "A decorator on every method"],
        answer: 1,
        explanation: "__init_subclass__ covers most metaclass use cases.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Create `Plugin` with a class attribute `registry` (dict). Every subclass that sets a class attribute `name` should be added automatically: `Plugin.registry[name] = subclass`." },
      ],
      starter: `
class Plugin:
    registry = {}
    ...
`,
      hint: "In `__init_subclass__(cls, **kwargs)`, read the subclass's own `name` with `cls.__dict__.get('name')` and store the class under it. (`getattr` would also find a name inherited from a parent.)",
      solution: `
class Plugin:
    registry = {}

    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        name = cls.__dict__.get('name')
        if name:
            Plugin.registry[name] = cls
`,
    },
  },
  {
    slug: "typing-protocol-static-duck-typing",
    title: "typing.Protocol — Static Duck Typing",
    minutes: 8,
    blocks: [
      { type: "p", text: "Duck typing is flexible, but how do you **document** and **check** \"anything with a `send()` method\"? `typing.Protocol` defines a structural interface: any class with matching methods satisfies it — **no** inheritance required. Type checkers like mypy/pyright verify it." },
      { type: "table", text: `
ABC      = nominal     ("you must inherit from me")
Protocol = structural  ("you just need to look like me")
` },
      {
        type: "code",
        code: `
from typing import Protocol, runtime_checkable

@runtime_checkable
class SupportsClose(Protocol):
    def close(self) -> None: ...

class FileHandle:
    def close(self) -> None: print("file closed")
class Socket:
    def close(self) -> None: print("socket closed")
class Number: pass

def shutdown(resources: list[SupportsClose]) -> None:
    for r in resources:
        r.close()

shutdown([FileHandle(), Socket()])
print(isinstance(Socket(), SupportsClose), isinstance(Number(), SupportsClose))
`,
        output: `
file closed
socket closed
True False
`,
      },
      { type: "p", text: "Type hints in classes also help readers and tools. Useful pieces:" },
      {
        type: "list",
        items: [
          "`-> \"ClassName\"` or `from __future__ import annotations` for self-references",
          "`typing.Self` (3.11+) for methods returning `self`",
          "Generic classes: `class Box(Generic[T])`, or `class Box[T]` on 3.12+",
        ],
      },
      {
        type: "code",
        code: `
from typing import Generic, TypeVar
T = TypeVar("T")

class Stack(Generic[T]):
    def __init__(self) -> None: self._items: list[T] = []
    def push(self, item: T) -> None: self._items.append(item)
    def pop(self) -> T: return self._items.pop()

s: Stack[int] = Stack()
s.push(1); s.push(2)
print(s.pop(), s.pop())
`,
        output: `
2 1
`,
      },
    ],
    quiz: [
      {
        id: "typing-protocol-static-duck-typing-q1",
        question: "How does a class satisfy a Protocol?",
        options: ["By having the required methods/attributes", "By inheriting from it", "By registering it", "By using a metaclass"],
        answer: 0,
        explanation: "Protocols are structural — matching shape is enough.",
      },
      {
        id: "typing-protocol-static-duck-typing-q2",
        question: "What does @runtime_checkable add?",
        options: ["Speed", "Support for isinstance() checks", "Automatic method generation", "Nothing"],
        answer: 1,
        explanation: "Without it, isinstance() against a Protocol raises TypeError.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Define `@runtime_checkable` Protocol `Notifier` with `send(msg) -> str`. Create `Email` (`send` returns `'email: <msg>'`) and `SMS` (`send` returns `'sms: <msg>'`) **without** inheriting `Notifier`, and `notify_all(notifiers, msg)` returning a list of results." },
      ],
      starter: `
from typing import Protocol, runtime_checkable

@runtime_checkable
class Notifier(Protocol):
    ...
`,
      hint: "`notify_all` can be one line: `return [n.send(msg) for n in notifiers]`.",
      solution: `
from typing import Protocol, runtime_checkable

@runtime_checkable
class Notifier(Protocol):
    def send(self, msg: str) -> str: ...

class Email:
    def send(self, msg):
        return f'email: {msg}'

class SMS:
    def send(self, msg):
        return f'sms: {msg}'

def notify_all(notifiers, msg):
    return [n.send(msg) for n in notifiers]
`,
    },
  },
  {
    slug: "solid-principles-and-design-patterns-capstone",
    title: "SOLID Principles and Design Patterns (Capstone)",
    minutes: 10,
    blocks: [
      { type: "p", text: "SOLID — five principles for maintainable OOP:" },
      { type: "table", text: `
S  Single Responsibility  — a class should have one reason to change
O  Open/Closed            — open for extension, closed for modification
L  Liskov Substitution    — subclasses must work wherever parents do
I  Interface Segregation  — many small interfaces beat one huge one
D  Dependency Inversion   — depend on abstractions, not concretions
` },
      { type: "p", text: "Design patterns are proven solutions to recurring design problems. Here are four you will use constantly." },
      {
        type: "code",
        code: `
# STRATEGY — swap algorithms at runtime (Open/Closed in action)
class NoDiscount:
    def apply(self, price): return price
class PercentOff:
    def __init__(self, pct): self.pct = pct
    def apply(self, price): return price * (1 - self.pct / 100)

class Checkout:
    def __init__(self, discount): self.discount = discount   # Dependency Inversion
    def total(self, price): return round(self.discount.apply(price), 2)

print(Checkout(NoDiscount()).total(100), Checkout(PercentOff(15)).total(100))
`,
        output: `
100 85.0
`,
      },
      {
        type: "code",
        code: `
# OBSERVER — notify many listeners when something happens
class EventBus:
    def __init__(self): self._subs = []
    def subscribe(self, fn): self._subs.append(fn)
    def publish(self, event):
        for fn in self._subs: fn(event)

bus = EventBus()
bus.subscribe(lambda e: print("Email team about", e))
bus.subscribe(lambda e: print("Log:", e))
bus.publish("new order #42")
`,
        output: `
Email team about new order #42
Log: new order #42
`,
      },
      {
        type: "code",
        code: `
# FACTORY — centralise object creation
class Pdf:
    def render(self): return "PDF"
class Html:
    def render(self): return "HTML"

class ReportFactory:
    _kinds = {"pdf": Pdf, "html": Html}
    @classmethod
    def create(cls, kind):
        try: return cls._kinds[kind]()
        except KeyError: raise ValueError(f"unknown kind {kind!r}") from None

print(ReportFactory.create("pdf").render())
`,
        output: `
PDF
`,
      },
      {
        type: "code",
        code: `
# SINGLETON (Pythonic: often just use a module!) — one shared instance
class Settings:
    _instance = None
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.theme = "dark"
        return cls._instance

print(Settings() is Settings(), Settings().theme)
`,
        output: `
True dark
`,
      },
      { type: "p", text: "**Congratulations:** you've covered Python OOP from your first class to metaclasses. Next steps:" },
      {
        type: "list",
        items: [
          "Read real code: the standard library (collections, pathlib, enum)",
          "Build a project: inventory system, bank simulator, game engine",
          "Learn testing (pytest) and type checking (mypy) for your classes",
        ],
      },
    ],
    quiz: [
      {
        id: "solid-principles-and-design-patterns-capstone-q1",
        question: "Which principle says 'add new behaviour without editing existing code'?",
        options: ["Single Responsibility", "Liskov Substitution", "Interface Segregation", "Open/Closed"],
        answer: 3,
        explanation: "The Strategy example adds discounts without touching Checkout.",
      },
      {
        id: "solid-principles-and-design-patterns-capstone-q2",
        question: "Which pattern lets many listeners react to one event?",
        options: ["Factory", "Singleton", "Strategy", "Observer"],
        answer: 3,
        explanation: "Subscribers register; the subject notifies them all.",
      },
      {
        id: "solid-principles-and-design-patterns-capstone-q3",
        question: "A subclass that throws errors where the parent worked violates...",
        options: ["Dependency Inversion", "Single Responsibility", "Liskov Substitution", "DRY"],
        answer: 2,
        explanation: "Subtypes must be substitutable for their base types.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "**Capstone:** bring the patterns together." },
        {
          type: "list",
          items: [
            "`Subject`, with `subscribe(callback)` and `notify(event)`, which calls every callback in the order they subscribed.",
            "`ShapeFactory.create(kind, size)` (a classmethod or staticmethod) returning an object with `area()`: `'circle'` → pi × size², `'square'` → size². An unknown kind raises `ValueError`.",
          ],
        },
      ],
      starter: `
import math

class Subject:
    ...

class ShapeFactory:
    ...
`,
      hint: "Keep a dict inside `ShapeFactory` that maps each kind to a class, such as `{'circle': Circle, 'square': Square}`.",
      solution: `
import math

class Subject:
    def __init__(self):
        self._subs = []
    def subscribe(self, fn):
        self._subs.append(fn)
    def notify(self, event):
        for fn in self._subs:
            fn(event)

class Circle:
    def __init__(self, r):
        self.r = r
    def area(self):
        return math.pi * self.r ** 2

class Square:
    def __init__(self, s):
        self.s = s
    def area(self):
        return self.s ** 2

class ShapeFactory:
    _kinds = {'circle': Circle, 'square': Square}

    @classmethod
    def create(cls, kind, size):
        if kind not in cls._kinds:
            raise ValueError(f'unknown shape {kind}')
        return cls._kinds[kind](size)
`,
    },
  },
];
