function entropy(grid, p) {
    return grid[p].length;
}

function getBest(grid) {
    let best = [];
    minEntropy = 1000;
    for (let p = 0; p < grid.length; p++) {
        const options = grid[p];
        if (options.length == 1) {
            continue;
        }
        const e = options.length;
        if (e < minEntropy) {
            minEntropy = e;
            best = [];
        }
        if (e <= minEntropy) {
            best.push(p);
        }
    }
    const i = Math.floor(Math.random() * best.length);
    return best[i];
}

function getAny(grid) {
    let l = [];
    for (let p = 0; p < grid.length; p++) {
        const options = grid[p];
        if (options.length != 1) {
            l.push(p);
        }
    }
    const i = Math.floor(Math.random() * l.length);
    return l[i];
}

function weightedChoice(options) {
    let sum = 0;
    for (const t of options) {
        sum += weights[fromNumber[t]];
    }
    let i = Math.floor(Math.random() * sum);
    for (const t of options) {
        i -= weights[fromNumber[t]];
        if (i < 0) {
            return t;
        }
    }
}

function collapse(grid, p) {
    // const i = Math.floor(Math.random() * grid.get(p).length);
    // grid.set(p, grid.get(p)[i]);
    grid[p] = [weightedChoice(grid[p])];
}