function empty() {
    let grid = new Map();
    for (let x = 0; x < SIZE; x++) {
        for (let y = 0; y < SIZE; y++) {
            grid.set(y * 1000 + x, ['~', '.', '#']);
        }
    }
    return grid;
}

function neighbors(grid, p) {
    let n = [];
    for (const d of [-1, 1, -1000, 1000]) {
        if (grid.has(p + d)) {
            n.push(p + d);
        }
    }
    return n;
}


function bounds(grid, p) {
    // const outside = n.length;
    let fixed = new Map();
    for (const t in tiles) {
        fixed.set(t, 0);
    }
    let possible = new Map(fixed);

    for (const n of neighbors(grid, p)) {
        options = grid.get(n);
        if (options.length == 1) {
            fixed.set(options[0], fixed.get(options[0]) + 1);
        }
        for (const t of options) {
            possible.set(t, possible.get(t) + 1);
        }
    }
    return [fixed, possible];
}

function isPossible(grid, p, tile) {
    const [bottom, top] = bounds(grid, p);
    // let n = [];
    for (const t in tiles) {
        rMin = tiles[tile][t + '_min'];
        rMax = tiles[tile][t + '_max'];
        nMin = bottom.get(t);
        nMax = top.get(t);
        if (nMin > rMax || nMax < rMin) {
            return false;
        }
    }
    return true;
}

function possible(grid, p) {
    let options = [];
    for (const t of grid.get(p)) {
        if (isPossible(grid, p, t)) {
            options.push(t);
        }
    }
    return options;
}

function failed(grid) {
    for (p of grid.keys()) {
        if (possible(grid, p).length == 0) {
            return true;
        }
    }
    return false;
}

function done(grid) {
    for (p of grid.keys()) {
        if (possible(grid, p).length != 1) {
            return false;
        }
    }
    return true;
}