function equal(x, y) {
    for (let i = 0; i < x.length; i++) {
        if (x[i] != y[i]) {
            return false;
        }
    }
    return true;
}

function run() {
    let seq_a = document.getElementById("input_a").value.split(',');
    let seq_b = document.getElementById("input_b").value.split(',');

    let result = document.getElementById("result");
    // result.innerText = "ABC";
    if (seq_a.length != seq_b.length) {
        result.innerText = "Error, sequences are of different length (different number of cups)";
        return;
    }
    let sum_a = 0;
    let sum_b = 0;
    let start = [];
    for (let i = 0; i < seq_a.length; i++) {
        seq_a[i] = parseInt(seq_a[i]);
        sum_a += seq_a[i];
        seq_b[i] = parseInt(seq_b[i]);
        sum_b += seq_b[i];
        start.push(0);
    }
    seq_a.sort();
    seq_b.sort();

    if (sum_a != sum_b) {
        result.innerText = "Error, sequences have different sums (different number of balls)";
        return;
    }

    let [a, b] = [0, 0];
    function iter(n) {
        let [d_a, d_b] = simulate(seq_a, seq_b, sum_a, start);
        a += d_a;
        b += d_b;
        if (a > b) {
            result.innerHTML = `Sequence A is ${Math.round(a / b * 100) / 100}x more likely than sequence B.`;
        } else if (b > a) {
            result.innerHTML = `Sequence B is ${Math.round(b / a * 100) / 100}x more likely than sequence A.`;
        }
        if (n > 0) {
            setTimeout(iter, 5, n - 1);
        }
    }
    iter(20);
    
}

function simulate(x, y, count, start) {
    // console.log("3", x, y, count, start);
    let a = 0;
    let b = 0;

    for (let i = 0; i < 500_000; i++) {
        let l = start.slice();
        for (let n = 0; n < count; n++) {
            l[Math.floor(Math.random() * start.length)] += 1;
        }
        // console.log('L', l);
        l.sort();
        // console.log('LS', l);
        if (equal(l, x)) {
            a++;
        } else if (equal(l, y)) {
            b++;
        }
    }
    return [a, b];
}

