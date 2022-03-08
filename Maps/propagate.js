// function removeOption(options, t) {
//     const i = options.indexOf(t);
//     if (i != -1) {
//         options.splice(i, 1);
//     }
// }

function removeOption(options, t) {
    let n = [];
    for (const o of options) {
        if (o != t) {
            n.push(o);
        }
    }
    return n;
}

function propagateTile(grid, p) {
    const limits = bounds(grid, p);
    const tileN = grid[p][0];
    for (let tN = 0; tN < tiles2.length; tN++) {
        const [rMin, rMax] = tiles2[tileN][tN];
        nMin = limits[tN];
        nMax = limits[tN + tiles2.length];
        if (rMax == nMin) {
            for (const n of neighbors(p)) {
                let options = grid[n];
                if (options.length == 1) {
                    continue;
                }
                options = removeOption(options, tN);
                grid[n] = options;
            }
        }
        if (rMin == nMax) {
            for (const n of neighbors(p)) {
                let options = grid[n];
                if (options.length == 1) {
                    continue;
                }
                if (options.indexOf(tN) != -1) {
                    grid[n] = [tN];
                }
            }
        }
    }
}

function propagateAll(grid) {
    for (let p = 0; p < grid.length; p++) {
        const n = possible(grid, p);
        grid[p] = n;
        if (n.length == 1) {
            propagateTile(grid, p);
        }
    }
}

function equalArray(a, b) {
    if (a.length != b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] != b[i]) {
            return false;
        }
    }
    return true;
}

function equalGrid(a, b) {
    if (a.length != b.length) {
        return false;
    }
    for (let p = 0; p < a.length; p++) {
        if (!equalArray(a[p], b[p])) {
            return false;
        }
    }
    return true;
}

function propagate(grid) {
    old = [];
    while (!equalGrid(old, grid)) {
        old = [...grid];
        propagateAll(grid);
    }
}