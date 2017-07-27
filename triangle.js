var $canvas = d3.select('#mycanvas');

var ctx = $canvas.node().getContext('2d');

var size = Math.min($canvas.attr('width'), $canvas.attr('height'))
var zoom = d3.zoom().on('zoom', zoomed);

$canvas.call(zoom);

var numDrawn = 0;

var scale = 1, dx = 0, dy = 0, minX = 0, maxX = size, minY = 0, maxY = size;


function zoomed() {
    ctx.save();
    ctx.clearRect(0, 0, size, size);
    var transform = d3.event.transform;
    dx = transform.x;
    dy = transform.y;
    scale = transform.k;
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);
    minX = -dx / scale;
    minY = -dy / scale;
    maxX = (size) / scale - dx;
    maxY = (size) / scale - dy;
    draw();
    ctx.restore();
}

function drawTriangle(x, y, size, depth, maxDepth) {
    var quarter = 0.25 * size;
    var half = 0.5 * size;

    if (x + size <= minX || x >= maxX || y + size <= minY || y >= maxY) {
        return;
    }

    ctx.beginPath();
    ctx.lineWidth = 0.1 / scale;
    ctx.moveTo(x, y);
    ctx.lineTo(half + x, y + size);
    ctx.lineTo(size + x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    ++numDrawn;

    if (depth <= maxDepth) {
        drawTriangle(x + quarter, y + half, half, depth + 1, maxDepth);
        drawTriangle(x + half, y, half, depth + 1, maxDepth);
        drawTriangle(x, y, half, depth + 1, maxDepth);
    }

}

function draw(){
    numDrawn = 0;
    var levels = 6 + Math.log(scale)/Math.log(2);
    drawTriangle(0, 0, size, 0, levels);
    document.title = Math.round(scale) + ', ' + levels.toFixed(1) + ', ' + numDrawn;
}

draw();