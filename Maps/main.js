function best(g, state) {
    let p = -1;
    if (state > 10) {
        p = getAny(g);
    } else {
        p = getBest(g);
    }
    collapse(g, p);
    propagate(g);
    if (failed(g)) {
        return state + 1;
    } else {
        return 0;
    }
}

function run(f, grid, state) {
    const n = [...grid];
    state = f(n, state);
    if (!failed(n)) {
        grid = n;
    }
    return [grid, state];
}

let start;
function runAll(f) {
    SIZE = +document.getElementById('size').value;
    if (SIZE > 60) {
        SIZE = 60;
    } else if (SIZE < 5) {
        SIZE = 5;
    }
    document.getElementById('size').value = SIZE;
    start = Date.now();
    runMany(f, empty(), 0);
}

function runMany(f, grid, state) {
    // grid = empty();
    // updateCanvas();
    // let state = 0;
    let i = 0;
    while (!done(grid) && state < 100 && i < 10) {
        [grid, state] = run(f, grid, state);
        i++;
    }
    if (i == 10) {
        setTimeout(function () {
            runMany(f, grid, state);
        }, 1);
        drawGrid(grid);
    } else {
        console.log("DONE", i, state, done(grid), Date.now() - start);
        drawGrid(grid);
    }
    
}
