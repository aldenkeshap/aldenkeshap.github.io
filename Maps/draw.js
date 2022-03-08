function averageColor(colors) {
    let [rSum, gSum, bSum] = [0, 0, 0];
    for (const [r, g, b] of colors) {
        rSum += r;
        gSum += g;
        bSum += b;
    }
    const l = colors.length;
    return [Math.floor(rSum / l), Math.floor(gSum / l), Math.floor(bSum / l)];
}

function getColor(options) {
    // let r = options.indexOf("#") != -1;
    // let g = options.indexOf(".") != -1;
    // let b = options.indexOf("~") != -1;
    // // return [r * 255, g * 255, b * 255];
    // return `rgb(${r * 255}, ${g * 255}, ${b * 255})`;
    let colors = [];
    for (const tN of options) {
        const t = ['~', '.', '#'][tN];
        colors.push(tileColors[t]);
    }
    const [r, g, b] = averageColor(colors);
    return `rgb(${r}, ${g}, ${b})`
}

function drawGrid(grid) {
    const canvas = document.getElementById('canvas');
    const scale = Math.floor(canvas.width / SIZE);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            ctx.fillStyle = getColor(grid[y * SIZE + x]);
            ctx.fillRect(x * scale, y * scale, scale, scale);
        }
    }
}

function test() {
    SIZE = 10;
    let g = empty();
    g[45] = [0];
    g[65] = [0];
    g[54] = [0];
    g[56] = [0];
    drawGrid(g);
    return g;
}

function test2() {
    SIZE = 10;
    let g = empty();
    g[45] = [0];
    g[65] = [0];
    g[54] = [0];
    g[55] = [2];
    drawGrid(g);
    return g;
}