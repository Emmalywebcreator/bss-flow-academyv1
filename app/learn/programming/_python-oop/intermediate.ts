// Generated from oop_tutor.py (the terminal Python OOP course), then kept here as the
// source for the website version. Example outputs were recorded with Python 3.12.
import type { Topic } from "./topic";

export const INTERMEDIATE_TOPICS: readonly Topic[] = [
  {
    slug: "encapsulation-private-names-and-property",
    title: "Encapsulation, Private Names and @property",
    minutes: 8,
    blocks: [
      { type: "p", text: "**Encapsulation** means hiding internal details and exposing a safe interface. Python relies on **conventions** rather than strict rules:" },
      { type: "table", text: `
name      → public
_name     → "internal, please don't touch" (convention)
__name    → name-mangled to _ClassName__name (avoids clashes in subclasses)
` },
      {
        type: "code",
        code: `
class Wallet:
    def __init__(self):
        self._balance = 0       # internal
        self.__pin = "1234"     # name-mangled

w = Wallet()
print(w._balance)               # works, but you've been warned
print(hasattr(w, "__pin"), w._Wallet__pin)
`,
        output: `
0
False 1234
`,
      },
      { type: "p", text: "`@property` lets you keep simple attribute syntax (`obj.x`) while running code behind the scenes — for validation, computed values or read-only data. This is the Pythonic replacement for Java-style `get_x()`/`set_x()` methods." },
      {
        type: "code",
        code: `
class Circle:
    def __init__(self, radius):
        self.radius = radius        # goes through the setter!

    @property
    def radius(self):               # getter
        return self._radius

    @radius.setter
    def radius(self, value):        # setter with validation
        if value < 0:
            raise ValueError("radius must be >= 0")
        self._radius = value

    @property
    def area(self):                 # computed, read-only
        return 3.14159 * self._radius ** 2

c = Circle(2)
print(c.radius, round(c.area, 2))
c.radius = 3
print(round(c.area, 2))
for bad in (lambda: setattr(c, "radius", -1), lambda: setattr(c, "area", 5)):
    try: bad()
    except (ValueError, AttributeError) as e: print(type(e).__name__, "-", e)
`,
        output: `
2 12.57
28.27
ValueError - radius must be >= 0
AttributeError - property 'area' of 'Circle' object has no setter
`,
      },
      { type: "p", text: "**Tip:** Start with plain public attributes. Turn them into properties **later** if you need validation — callers' code does not have to change." },
    ],
    quiz: [
      {
        id: "encapsulation-private-names-and-property-q1",
        question: "What does a single leading underscore (_x) mean?",
        options: ["It is truly private", "It makes the attribute read-only", "It is a convention for 'internal use'", "It is a syntax error"],
        answer: 2,
        explanation: "Python doesn't enforce it — it's a signal to other programmers.",
      },
      {
        id: "encapsulation-private-names-and-property-q2",
        question: "A @property without a setter is...",
        options: ["Writable", "Deleted", "Read-only (assigning raises AttributeError)", "A class attribute"],
        answer: 2,
        explanation: "Without a setter, assignment fails with AttributeError.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Create `Temperature(celsius)`:" },
        {
          type: "list",
          items: [
            "`celsius` is a property; setting it below -273.15 raises `ValueError`",
            "the constructor must also validate",
            "`fahrenheit` is a read-only property: `celsius * 9 / 5 + 32`",
          ],
        },
      ],
      starter: `
class Temperature:
    ...
`,
      hint: "In `__init__` write `self.celsius = celsius` so the setter runs. Store the real value in `self._celsius`.",
      solution: `
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError('below absolute zero')
        self._celsius = value

    @property
    def fahrenheit(self):
        return self._celsius * 9 / 5 + 32
`,
    },
  },
  {
    slug: "inheritance-reusing-and-extending-classes",
    title: "Inheritance — Reusing and Extending Classes",
    minutes: 7,
    blocks: [
      { type: "p", text: "**Inheritance** lets a new class (child / subclass) reuse the code of an existing class (parent / base class). It models an \"IS-A\" relationship: a Cat **is an** Animal." },
      { type: "p", text: "The child automatically gets every method and attribute of the parent, and can:" },
      {
        type: "list",
        items: [
          "**Add** new methods",
          "**Override** (replace) existing ones",
        ],
      },
      {
        type: "code",
        code: `
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return f"{self.name} makes a sound"
    def sleep(self):
        return f"{self.name} is sleeping"

class Dog(Animal):              # Dog inherits from Animal
    def speak(self):            # override
        return f"{self.name} says Woof"
    def fetch(self):            # new behaviour
        return f"{self.name} fetches the ball"

d = Dog("Rex")
print(d.speak())     # overridden
print(d.sleep())     # inherited
print(d.fetch())     # new
print(isinstance(d, Animal), issubclass(Dog, Animal))
`,
        output: `
Rex says Woof
Rex is sleeping
Rex fetches the ball
True True
`,
      },
      { type: "p", text: "Every class ultimately inherits from `object`. You can see the chain with `Class.__mro__` (Method Resolution Order) — the order Python searches for attributes." },
      {
        type: "code",
        code: `
class Animal: pass
class Dog(Animal): pass
class Puppy(Dog): pass
print([c.__name__ for c in Puppy.__mro__])
`,
        output: `
['Puppy', 'Dog', 'Animal', 'object']
`,
      },
      { type: "p", text: "**When to inherit:** only when the \"is-a\" relationship is genuinely true and the child can be used anywhere the parent is expected (this is the Liskov Substitution Principle). Otherwise prefer composition." },
    ],
    quiz: [
      {
        id: "inheritance-reusing-and-extending-classes-q1",
        question: "If Dog doesn't define sleep() but Animal does, d.sleep() ...",
        options: ["Uses Animal.sleep", "Raises AttributeError", "Returns None", "Must be imported"],
        answer: 0,
        explanation: "Python looks up the MRO and finds sleep on Animal.",
      },
      {
        id: "inheritance-reusing-and-extending-classes-q2",
        question: "What relationship does inheritance model?",
        options: ["HAS-A", "IS-A", "USES-A", "CREATES-A"],
        answer: 1,
        explanation: "Inheritance = IS-A. Composition = HAS-A.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Build:" },
        {
          type: "list",
          items: [
            "`Shape` with a method `describe()` returning `f'{type(self).__name__} with area {self.area()}'`",
            "`Rectangle(Shape)` with `__init__(w, h)` and `area()`",
            "`Square(Rectangle)` with `__init__(side)` — reuse Rectangle!",
          ],
        },
      ],
      starter: `
class Shape:
    ...
`,
      hint: "`Square.__init__` can call `super().__init__(side, side)`. `type(self).__name__` gives the class name.",
      solution: `
class Shape:
    def area(self):
        return 0
    def describe(self):
        return f'{type(self).__name__} with area {self.area()}'

class Rectangle(Shape):
    def __init__(self, w, h):
        self.w, self.h = w, h
    def area(self):
        return self.w * self.h

class Square(Rectangle):
    def __init__(self, side):
        super().__init__(side, side)
`,
    },
  },
  {
    slug: "super-and-method-overriding",
    title: "super() and Method Overriding",
    minutes: 7,
    blocks: [
      { type: "p", text: "When you override a method you often want to **extend** the parent's behaviour, not throw it away. `super()` gives you access to the parent's version." },
      { type: "p", text: "Most common use: calling the parent's `__init__` so its attributes are set up, then adding the child's own." },
      {
        type: "code",
        code: `
class Vehicle:
    def __init__(self, brand, wheels):
        self.brand = brand
        self.wheels = wheels
    def info(self):
        return f"{self.brand} with {self.wheels} wheels"

class Truck(Vehicle):
    def __init__(self, brand, capacity_tons):
        super().__init__(brand, wheels=6)   # parent sets brand & wheels
        self.capacity = capacity_tons       # child adds its own
    def info(self):
        base = super().info()               # extend, don't replace
        return f"{base}, carries {self.capacity}t"

print(Truck("Volvo", 20).info())
`,
        output: `
Volvo with 6 wheels, carries 20t
`,
      },
      { type: "p", text: "**Forgetting** `super().__init__()` is a very common bug: the parent's attributes are never created and you get AttributeError later." },
      {
        type: "code",
        code: `
class Base:
    def __init__(self): self.ready = True
class Broken(Base):
    def __init__(self): self.extra = 1          # no super() call!
try:
    Broken().ready
except AttributeError as e:
    print("AttributeError:", e)
`,
        output: `
AttributeError: 'Broken' object has no attribute 'ready'
`,
      },
      { type: "p", text: "`super()` follows the MRO, not just \"the parent\". This matters with multiple inheritance (covered in the Advanced lesson), and is why you should always use `super()` rather than hard-coding `Parent.method(self)`." },
    ],
    quiz: [
      {
        id: "super-and-method-overriding-q1",
        question: "Why call super().__init__(...) in a child's __init__?",
        options: ["It's required syntax", "To delete the parent", "To make the class abstract", "So the parent can set up its own attributes"],
        answer: 3,
        explanation: "Without it, anything the parent's __init__ sets up is missing.",
      },
      {
        id: "super-and-method-overriding-q2",
        question: "super().info() inside Truck.info() calls...",
        options: ["The next info() in the MRO (Vehicle.info)", "Truck.info (infinite loop)", "object.info", "Nothing"],
        answer: 0,
        explanation: "super() delegates to the next class in the MRO.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Create `Animal(name)` with `speak()` returning `f'{self.name} makes a sound.'`. Create `Cat(Animal)` with `__init__(name, indoor=False)` and a `speak()` that returns the parent's text plus `' Meow!'`, so a cat named Tom says `'Tom makes a sound. Meow!'`" },
      ],
      starter: `
class Animal:
    ...
`,
      hint: "In `Cat.speak`: `return super().speak() + ' Meow!'`",
      solution: `
class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return f'{self.name} makes a sound.'

class Cat(Animal):
    def __init__(self, name, indoor=False):
        super().__init__(name)
        self.indoor = indoor
    def speak(self):
        return super().speak() + ' Meow!'
`,
    },
  },
  {
    slug: "polymorphism-and-duck-typing",
    title: "Polymorphism and Duck Typing",
    minutes: 8,
    blocks: [
      { type: "p", text: "**Polymorphism** (\"many forms\") means different objects can respond to the **same** method call in their own way. Code can work with any of them without knowing the exact type." },
      {
        type: "code",
        code: `
class Email:
    def send(self, msg): return f"Emailing: {msg}"
class SMS:
    def send(self, msg): return f"Texting: {msg}"
class Push:
    def send(self, msg): return f"Push notification: {msg}"

for channel in [Email(), SMS(), Push()]:
    print(channel.send("Your order shipped"))
`,
        output: `
Emailing: Your order shipped
Texting: Your order shipped
Push notification: Your order shipped
`,
      },
      { type: "p", text: "Notice: Email, SMS and Push share **no** parent class! Python uses **duck typing**: \"If it walks like a duck and quacks like a duck, it's a duck.\" What matters is whether the object **has** the method, not its type." },
      { type: "p", text: "Built-ins work the same way: `len()` works on anything with `__len__`, a for loop works on anything with `__iter__`." },
      {
        type: "code",
        code: `
class Playlist:
    def __init__(self, songs): self.songs = songs
    def __len__(self): return len(self.songs)
    def __iter__(self): return iter(self.songs)

p = Playlist(["Song A", "Song B"])
print(len(p))
for s in p: print("-", s)
`,
        output: `
2
- Song A
- Song B
`,
      },
      { type: "p", text: "EAFP vs LBYL: Pythonic code tends to \"try it and handle failure\" (Easier to Ask Forgiveness than Permission) rather than checking `isinstance()` everywhere." },
      {
        type: "code",
        code: `
def total_length(things):
    total = 0
    for t in things:
        try:
            total += len(t)
        except TypeError:
            pass                # skip things without a length
    return total

print(total_length(["abc", [1, 2], 42, {"k": 1}]))
`,
        output: `
6
`,
      },
    ],
    quiz: [
      {
        id: "polymorphism-and-duck-typing-q1",
        question: "Duck typing means...",
        options: ["Objects must inherit from Duck", "Types are checked at compile time", "An object's suitability depends on its methods, not its type", "Only built-ins can be iterated"],
        answer: 2,
        explanation: "Python cares what an object can DO.",
      },
      {
        id: "polymorphism-and-duck-typing-q2",
        question: "For len(obj) to work, the class must implement...",
        options: ["__len__", "length()", "__size__", "count()"],
        answer: 0,
        explanation: "len() calls obj.__len__().",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Create classes `Circle(r)` and `Sq(side)`, each with `area()` (use 3.14159 for pi), and a function `total_area(shapes)` that returns the sum of all areas — without using `isinstance()`." },
      ],
      starter: `
class Circle:
    ...
`,
      hint: "`total_area` can be one line: `return sum(s.area() for s in shapes)`.",
      solution: `
class Circle:
    def __init__(self, r):
        self.r = r
    def area(self):
        return 3.14159 * self.r ** 2

class Sq:
    def __init__(self, side):
        self.side = side
    def area(self):
        return self.side ** 2

def total_area(shapes):
    return sum(s.area() for s in shapes)
`,
    },
  },
  {
    slug: "classmethod-and-staticmethod",
    title: "@classmethod and @staticmethod",
    minutes: 7,
    blocks: [
      { type: "p", text: "Three kinds of methods:" },
      { type: "table", text: `
Instance method   def m(self, ...)    works with one object
@classmethod      def m(cls, ...)     works with the class itself
@staticmethod     def m(...)          a plain function grouped in the class
` },
      { type: "p", text: "The #1 use of `@classmethod` is **alternative constructors** — other ways to create objects (from a string, a dict, a file...). Because it receives `cls`, it works correctly for subclasses too." },
      {
        type: "code",
        code: `
class User:
    def __init__(self, name, email):
        self.name, self.email = name, email

    @classmethod
    def from_csv(cls, line):
        name, email = line.split(",")
        return cls(name.strip(), email.strip())   # cls, not User!

    @staticmethod
    def is_valid_email(email):
        return "@" in email and "." in email.split("@")[-1]

    def __repr__(self):
        return f"{type(self).__name__}({self.name!r})"

class Admin(User):
    pass

print(User.from_csv("Ada, ada@x.com"))
print(Admin.from_csv("Bola, bola@x.com"))   # an Admin, thanks to cls
print(User.is_valid_email("nope"), User.is_valid_email("a@b.co"))
`,
        output: `
User('Ada')
Admin('Bola')
False True
`,
      },
      { type: "p", text: "You know classmethods already: `dict.fromkeys()`, `datetime.now()`, `int.from_bytes()` are all alternative constructors." },
      { type: "p", text: "Use `@staticmethod` when the function is logically related to the class but needs neither the instance nor the class." },
    ],
    quiz: [
      {
        id: "classmethod-and-staticmethod-q1",
        question: "What is the first parameter of a @classmethod?",
        options: ["self", "Nothing", "The parent class", "cls — the class"],
        answer: 3,
        explanation: "It receives the class it was called on.",
      },
      {
        id: "classmethod-and-staticmethod-q2",
        question: "Why use cls(...) instead of the class name in an alternative constructor?",
        options: ["It's faster", "So subclasses create instances of themselves", "Class names are not allowed", "It's required by Python"],
        answer: 1,
        explanation: "Admin.from_csv returns an Admin because cls is Admin.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Create `Date(year, month, day)` with:" },
        {
          type: "list",
          items: [
            "`@classmethod` `from_string('YYYY-MM-DD')` → Date",
            "`@staticmethod` `is_leap(year)` → `True`/`False` (divisible by 4, except centuries unless divisible by 400)",
          ],
        },
      ],
      starter: `
class Date:
    ...
`,
      hint: "Split the string and convert each piece: `y, m, d = map(int, s.split('-'))`, then `return cls(y, m, d)`.",
      solution: `
class Date:
    def __init__(self, year, month, day):
        self.year, self.month, self.day = year, month, day

    @classmethod
    def from_string(cls, s):
        y, m, d = map(int, s.split('-'))
        return cls(y, m, d)

    @staticmethod
    def is_leap(year):
        return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
`,
    },
  },
  {
    slug: "operator-overloading-with-dunder-methods",
    title: "Operator Overloading with Dunder Methods",
    minutes: 8,
    blocks: [
      { type: "p", text: "Dunder methods let your objects work with Python's operators and built-ins, so they feel like native types." },
      { type: "table", text: `
Arithmetic   __add__ +   __sub__ -   __mul__ *   __truediv__ /
Reflected    __radd__, __rmul__ ...  (when your object is on the RIGHT)
Comparison   __eq__ ==   __lt__ <    __le__ <=   (functools.total_ordering helps)
Containers   __len__  __getitem__  __setitem__  __contains__  __iter__
Other        __bool__  __abs__  __hash__  __call__
` },
      {
        type: "code",
        code: `
import math

class Vector:
    def __init__(self, x, y): self.x, self.y = x, y
    def __add__(self, other):  return Vector(self.x + other.x, self.y + other.y)
    def __mul__(self, k):      return Vector(self.x * k, self.y * k)
    __rmul__ = __mul__                 # so 3 * v also works
    def __abs__(self):         return math.hypot(self.x, self.y)
    def __eq__(self, other):
        if not isinstance(other, Vector):
            return NotImplemented      # let Python try the other side
        return (self.x, self.y) == (other.x, other.y)
    def __repr__(self):        return f"Vector({self.x}, {self.y})"

v = Vector(1, 2) + Vector(3, 4)
print(v, v * 2, 3 * v, abs(Vector(3, 4)), v == Vector(4, 6))
`,
        output: `
Vector(4, 6) Vector(8, 12) Vector(12, 18) 5.0 True
`,
      },
      { type: "p", text: "**Important:** if you define `__eq__`, Python sets `__hash__` to `None` and your objects can't go in sets or be dict keys — unless you also define `__hash__` (only for objects that won't change!)." },
      { type: "p", text: "Container dunders make objects indexable and callable:" },
      {
        type: "code",
        code: `
class Deck:
    def __init__(self): self.cards = [f"{r}{s}" for s in "♠♥" for r in "AKQ"]
    def __len__(self): return len(self.cards)
    def __getitem__(self, i): return self.cards[i]     # enables [] , slicing, iteration
    def __contains__(self, c): return c in self.cards

class Multiplier:
    def __init__(self, n): self.n = n
    def __call__(self, x): return x * self.n           # obj(...) syntax

d = Deck()
print(len(d), d[0], d[-1], d[1:3], "A♥" in d)
triple = Multiplier(3)
print(triple(10))
`,
        output: `
6 A♠ Q♥ ['K♠', 'Q♠'] True
30
`,
      },
    ],
    quiz: [
      {
        id: "operator-overloading-with-dunder-methods-q1",
        question: "Which method makes a + b work?",
        options: ["__plus__", "__add__", "__sum__", "__concat__"],
        answer: 1,
        explanation: "a + b calls a.__add__(b).",
      },
      {
        id: "operator-overloading-with-dunder-methods-q2",
        question: "What happens to __hash__ when you define only __eq__?",
        options: ["Nothing", "It uses id()", "Error at definition", "It's set to None — instances become unhashable"],
        answer: 3,
        explanation: "Define __hash__ too if objects must be used in sets/dicts.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Create `Vector(x, y)` supporting `v1 + v2`, `v * number`, `==`, `abs(v)` (its length), and hashing (equal vectors → same hash)." },
      ],
      starter: `
class Vector:
    ...
`,
      hint: "Hash a tuple of the coordinates: `def __hash__(self): return hash((self.x, self.y))`.",
      solution: `
class Vector:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __add__(self, o):
        return Vector(self.x + o.x, self.y + o.y)
    def __mul__(self, k):
        return Vector(self.x * k, self.y * k)
    def __eq__(self, o):
        return isinstance(o, Vector) and (self.x, self.y) == (o.x, o.y)
    def __hash__(self):
        return hash((self.x, self.y))
    def __abs__(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5
`,
    },
  },
  {
    slug: "composition-over-inheritance",
    title: "Composition over Inheritance",
    minutes: 7,
    blocks: [
      { type: "p", text: "**Composition** builds objects out of other objects — a \"HAS-A\" relationship. A Car **has an** Engine; a Car is **not** an Engine." },
      { type: "p", text: "Why designers often prefer composition:" },
      {
        type: "list",
        items: [
          "Looser coupling — parts can be swapped (petrol → electric engine)",
          "No deep, fragile inheritance trees",
          "Easier testing — pass in fake parts",
        ],
      },
      { type: "p", text: "\"Favour object composition over class inheritance.\" — Gang of Four" },
      {
        type: "code",
        code: `
class PetrolEngine:
    def start(self): return "Vroom"
class ElectricEngine:
    def start(self): return "Hmmm (silent)"

class Car:
    def __init__(self, model, engine):
        self.model = model
        self.engine = engine            # Car HAS an engine
    def start(self):
        return f"{self.model}: {self.engine.start()}"   # DELEGATION

print(Car("Corolla", PetrolEngine()).start())
print(Car("Model 3", ElectricEngine()).start())
`,
        output: `
Corolla: Vroom
Model 3: Hmmm (silent)
`,
      },
      { type: "p", text: "This technique — passing the parts in rather than creating them inside — is called **dependency injection**. It makes testing trivial:" },
      {
        type: "code",
        code: `
class FakeEngine:
    def start(self): return "TEST"

class Car:
    def __init__(self, model, engine): self.model, self.engine = model, engine
    def start(self): return f"{self.model}: {self.engine.start()}"

assert Car("X", FakeEngine()).start() == "X: TEST"
print("Test passed with a fake engine")
`,
        output: `
Test passed with a fake engine
`,
      },
      { type: "p", text: "**Rule:** Ask \"Is X really a kind of Y, everywhere and always?\" If yes → inheritance may fit. If X merely **uses** Y → composition." },
    ],
    quiz: [
      {
        id: "composition-over-inheritance-q1",
        question: "Composition models which relationship?",
        options: ["IS-A", "Parent-child", "Friend", "HAS-A"],
        answer: 3,
        explanation: "An object contains/uses other objects.",
      },
      {
        id: "composition-over-inheritance-q2",
        question: "Passing collaborators into __init__ instead of creating them inside is called...",
        options: ["Dependency injection", "Monkey patching", "Overriding", "Name mangling"],
        answer: 0,
        explanation: "It decouples the class from concrete implementations.",
      },
    ],
    challenge: {
      task: [
        { type: "p", text: "Create `Engine` with `start()` returning `'Engine started'`, and `Car(brand)` that **has** an Engine as `car.engine` (create it in `__init__`). `Car('Toyota').start()` → `'Toyota: Engine started'`." },
      ],
      starter: `
class Engine:
    ...
`,
      hint: "In `Car.__init__`, create the part: `self.engine = Engine()`. Then delegate to it with `self.engine.start()`.",
      solution: `
class Engine:
    def start(self):
        return 'Engine started'

class Car:
    def __init__(self, brand):
        self.brand = brand
        self.engine = Engine()
    def start(self):
        return f'{self.brand}: {self.engine.start()}'
`,
    },
  },
];
