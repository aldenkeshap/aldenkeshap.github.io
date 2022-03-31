function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function closest(x, y) {
    let minDist = 10_000;
    let min = -1;
    for (let i = 0; i < points.length; i++) {
        const [xP, yP] = points[i];
        const d = dist(x, y, xP, yP);
        if (d < minDist) {
            minDist = d;
            min = i;
        }
    }
    return [minDist, min];
}

let current;
function mousedown(e) {
    const [d, i] = closest(e.offsetX, e.offsetY);
    if (d < 20 && current === undefined && document.getElementById('points').checked) {
        current = i;
    } else {
        current = undefined;
    }
}

function mousemove(e) {
    if (current !== undefined) {
        points[current] = [e.offsetX, e.offsetY];
    }
}