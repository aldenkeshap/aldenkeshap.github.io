const stdlib = ``;

const square = `func square(n: Int64) -> Int64:
    return n * n

func main() -> Int64:
    return square(9)`;

const ack = `func ack(m: Int64, n: Int64) -> Int64:
    if m == 0:
        return n + 1
    elseif n == 0:
        return ack(m - 1, 1)
    else:
        return ack(m - 1, ack(m, n - 1))

func main() -> Int64:
    return ack(3, 2)`;

const structs = `struct Simple:
    a: Int64
    b: Int64

func main() -> Int64:
    s = Simple(1, 2)
    return s.a + s.b`;

const template = `struct Template[T]:
    c: T
    d: T

func main() -> Int64:
    ints = Template(3, 4)
    floats = Template(5.6, 6.7)
    return ints.c + ints.d + toInt(floats.c + floats.d)`;
