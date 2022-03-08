function empty() {
    let grid = new Map();
    for (let x = 0; x < SIZE; x++) {
        for (let y = 0; y < SIZE; y++) {
            grid.set(y * 1000 + x, ['~', '.', '#']);
        }
    }
    return grid;
}

// function neighbors(grid, p) {
//     let n = [];
//     for (const d of [-1, 1, -1000, 1000]) {
//         if (grid.has(p + d)) {
//             n.push(p + d);
//         }
//     }
//     return n;
// }

function neighbors(grid, p) {
    const x = p % 1000;
    const y = Math.floor(p / 1000);

    let n = [];
    if (x > 0) {
        n.push(p - 1);
    }
    if (x < SIZE - 1) {
        n.push(p + 1);
    }
    if (y > 0) {
        n.push(p - 1000);
    }
    if (y < SIZE - 1) {
        n.push(p + 1000);
    }
    return n;
}

function bounds(grid, p) {
    // let fixed = {};
    // let possible = {};
    // for (const t of allTiles) {
    //     fixed[t] = 0;
    //     possible[t] = 0;
    // }
    // let fixed = Object.assign({}, zeros);
    // let possible = Object.assign({}, zeros);
    // let fixed = {'#':0, '~':0, '.':0};
    // let possible = {'#':0, '~':0, '.':0};
    let fixed = {...zeros};
    let possible = {...zeros};
    for (const n of neighbors(grid, p)) {
        const options = grid.get(n);
        if (options.length == 1) {
            const t = options[0];
            fixed[t] += 1;
            possible[t] += 1;
        } else {
            for (const t of options) {
                possible[t] += 1;
            }
        }
        
    }
    return [fixed, possible];
}

function isPossible(grid, p, tile) {
    const [bottom, top] = bounds(grid, p);
    // let n = [];
    const q = tiles[tile];
    for (const t of allTiles) {
        const [rMin, rMax] = q[t];
        if (bottom[t] > rMax || top[t] < rMin) {
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