const hello = `print('Hello, world!')`;

const square = `func square(n: Int64) -> Int64:
    return n * n

print(square(9))`;

const ack = `func ack(m: Int64, n: Int64) -> Int64:
    if m == 0:
        return n + 1
    elseif n == 0:
        return ack(m - 1, 1)
    else:
        return ack(m - 1, ack(m, n - 1))

print(ack(3, 2))`;

const structs = `struct Simple:
    a: Int64
    b: Int64

s = Simple(1, 2)
print(s.a + s.b)`;

const template = `struct Template[T]:
    c: T
    d: T

ints = Template(3, 4)
floats = Template(5.6, 6.7)
print(ints.c + ints.d + toInt(floats.c + floats.d))`;

const list = `func sum(l: List[Int64]) -> Int64:
    total = 0
    for n in l:
        total = total + n
    return total

print(sum([13, 14, 15]))`;
