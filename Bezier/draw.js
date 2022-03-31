let points = [[50, 450], [110, 50], [250, 250], [400, 450], [450, 100]];
const colors = ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff"];

function getColor(i, total) {
    if (document.getElementById('animate').checked) {
        return `hsl(${i / total * 360}, 100%, 50%)`;
    } else {
        return '#ff0000'
    }
    
}

function drawFrame(tEnd) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 500, 500);

    if (document.getElementById('points').checked) {
        for (let i = 0; i < points.length; i++) {
            const [x, y] = points[i];
            ctx.beginPath();
            if (i === current) {
                ctx.fillStyle = '#808080';
            } else {
                ctx.fillStyle = '#000000';
            }
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    let trace = [];
    for (let t = 0; t <= tEnd; t += 1) {
        trace.push(bezierAll(points, t / 100));
    }
    drawPoints(ctx, trace, "#808080");

    if (document.getElementById('segments').checked) {
        let b = points;
        let i = 0;
        while (b.length > 1) {
            drawPoints(ctx, b, getColor(i, points.length));
            i++;
            b = bezier(b, tEnd / 100);
        }
    }
    
    return trace;
}

function test() {
    let points = [[0, 500], [60, 0], [250, 250], [400, 500], [480, 100]];
    return bezierAll(points, 0.5);
}

function interpolate(p0, p1, t) {
    const xDiff = p1[0] - p0[0];
    const yDiff = p1[1] - p0[1];
    return [p0[0] + t * xDiff, p0[1] + t * yDiff];
}

function bezier(points, t) {
    let new_points = [];
    let [last, ...rest] = points;
    for (const p of rest) {
        new_points.push(interpolate(last, p, t));
        last = p;
    }
    return new_points;
}

function bezierAll(points, t) {
    let current = points;
    while (current.length > 1) {
        current = bezier(current, t);
    }
    return current[0];
}

function drawPoints(ctx, points, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(points[0][0], points[0][1]);
    let [, ...rest] = points;
    for (const p of rest) {
        ctx.lineTo(p[0], p[1]);
    }
    ctx.stroke();
}

frame = 0;
direction = 1;
function tick() {
    if (document.getElementById('animate').checked) {
        drawFrame(frame);
    } else {
        drawFrame(100);
    }
    frame += direction;
    if (frame >= 100 || frame < 0) {
        direction = -direction;
        frame += direction * 2;
    }
}

function connectingPoint(x, y) {
    const xNew = x + Math.floor(Math.random() * 400 - 200);
    const yNew = y + Math.floor(Math.random() * 400 - 200);
    if (50 < xNew && xNew < 450 && 50 < yNew && yNew < 450) {
        return [xNew, yNew];
    } else {
        return connectingPoint(x, y)
    }
}

function randomize() {
    let current = [Math.floor(Math.random() * 400 + 50), Math.floor(Math.random() * 400 + 50)];
    points = [current];
    const count = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < count; i++) {
        current = connectingPoint(current[0], current[1]);
        points.push(current);
    }
    return points;
}
function addPoint() {
    const [x, y] = points[points.length - 1];
    points.push(connectingPoint(x, y));
}

function start() {
    setInterval(tick, 20);
    const canvas = document.getElementById('canvas');
    canvas.addEventListener('mousedown', mousedown);
    canvas.addEventListener('mousemove', mousemove);
}

function copy() {
    let l = [];
    for (const [x, y] of points) {
        l.push(`(${(x / 500).toFixed(3)}, ${(y / 500).toFixed(3)})`);
    }
    navigator.clipboard.writeText(l.join(', '));
}
