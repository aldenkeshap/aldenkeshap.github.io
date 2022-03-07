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
    const n = new Map(grid);
    state = f(n, state);
    if (failed(n)) {
        console.log('FAILED', state);
    } else {
        grid = n;
        console.log('GOOD', state);
    }
    // drawGrid(grid);
    return [grid, state];
}

function runAll(f) {
    SIZE = +document.getElementById('size').value;
    runMany(f, empty(), 0);
}

function runMany(f, grid, state) {
    // grid = empty();
    // updateCanvas();
    // let state = 0;
    let i = 0;
    while (!done(grid) && state < 100 && i < 20) {
        [grid, state] = run(f, grid, state);
        i++;
    }
    if (i == 20) {
        setTimeout(function () {
            runMany(f, grid, state);
        }, 10);
        console.log('ST');
        drawGrid(grid);
    } else {
        console.log("DONE", i, state, done(grid));
        drawGrid(grid);
    }
    
}
