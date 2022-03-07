function removeOption(options, t) {
    const i = options.indexOf(t);
    if (i != -1) {
        options.splice(i, 1);
    }
}

function propagateTile(grid, p) {
    const [bottom, top] = bounds(grid, p);
    const tile = grid.get(p)[0];
    for (const t in tiles) {
        rMin = tiles[tile][t + '_min'];
        rMax = tiles[tile][t + '_max'];
        nMin = bottom.get(t);
        nMax = top.get(t);
        if (rMax == nMin) {
            for (const n of neighbors(grid, p)) {
                let options = grid.get(n);
                if (options.length == 1) {
                    continue;
                }
                removeOption(options, t);
                grid.set(n, options);
            }
        }
        if (rMin == nMax) {
            for (const n of neighbors(grid, p)) {
                let options = grid.get(n);
                if (options.length == 1) {
                    continue;
                }
                if (options.indexOf(t) != -1) {
                    grid.set(n, t);
                }
            }
        }
    }
}

function propagateAll(grid) {
    for (p of grid.keys()) {
        const n = possible(grid, p);
        grid.set(p, n);
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

function equalMap(a, b) {
    if (a.size != b.size) {
        return false;
    }
    for (const [k, v] of a) {
        if (!equalArray(v, b.get(k))) {
            return false;
        }
    }
    return true;
}

function propagate(grid) {
    old = new Map();
    while (!equalMap(old, grid)) {
        old = new Map(grid);
        propagateAll(grid);
    }
}