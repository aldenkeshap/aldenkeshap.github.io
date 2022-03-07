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
    for (const t of options) {
        colors.push(tiles[t].color);
    }
    const [r, g, b] = averageColor(colors);
    // console.log("C", c);
    // return c;
    return `rgb(${r}, ${g}, ${b})`
}

function drawGrid(grid) {
    const canvas = document.getElementById('canvas');
    const scale = Math.floor(canvas.width / SIZE);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
            ctx.fillStyle = getColor(grid.get(y * 1000 + x));
            ctx.fillRect(x * scale, y * scale, scale, scale);
        }
    }
}

function test() {
    let g = empty();
    g.set(8008, '~');
    drawGrid(g);
    return g;
}