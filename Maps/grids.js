function empty() {
    // let grid = new Map();
    let grid = [];
    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            // grid.push(['~', '.', '#']);
            grid.push([0, 1, 2]);
            // grid.set(y * 1000 + x, );
        }
    }
    return grid;
}

function neighbors(p) {
    const x = p % SIZE;
    const y = Math.floor(p / SIZE);

    let n = [];
    if (x > 0) {
        n.push(p - 1);
    }
    if (x < SIZE - 1) {
        n.push(p + 1);
    }
    if (y > 0) {
        n.push(p - SIZE);
    }
    if (y < SIZE - 1) {
        n.push(p + SIZE);
    }
    return n;
}

function bounds(grid, p) {
    let limits = new Array(tiles2.length * 2);
    for (let i = 0; i < tiles2.length * 2; i++) {
        limits[i] = 0;
    }

    for (const n of neighbors(p)) {
        const options = grid[n];
        if (options.length == 1) {
            const tN = options[0]
            limits[tN] += 1;
            limits[tN + tiles2.length] += 1;
        } else {
            for (const tN of options) {
                limits[tN + tiles2.length] += 1;
            }
        }
        
    }
    return limits;
}

function isPossible(grid, p, tile) {
    const limits = bounds(grid, p);
    const q = tiles2[tile];
    for (let tN = 0; tN < tiles2.length; tN++) {
        const [rMin, rMax] = q[tN];
        if (limits[tN] > rMax || limits[tN + tiles2.length] < rMin) {
            return false;
        }
    }
    return true;
}

function possible(grid, p) {
    let options = [];
    for (const t of grid[p]) {
        if (isPossible(grid, p, t)) {
            options.push(t);
        }
    }
    return options;
}

function failed(grid) {
    for (let p = 0; p < grid.length; p++) {
        if (possible(grid, p).length == 0) {
            return true;
        }
    }
    return false;
}

function done(grid) {
    for (let p = 0; p < grid.length; p++) {
        if (possible(grid, p).length != 1) {
            return false;
        }
    }
    return true;
}
