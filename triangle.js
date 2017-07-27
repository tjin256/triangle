var $canvas = d3.select('#mycanvas');

var ctx = $canvas.node().getContext('2d');

var size = Math.min($canvas.attr('width'), $canvas.attr('height'))
var zoom = d3.zoom().on('zoom', zoomed);

$canvas.call(zoom);

function zoomed() {
    $canvas.selectAll('path').attr('transform', d3.event.transform);
}

function drawTriangle(x, y, size, depth, maxDepth) {
    var quarter = 0.25 * size;
    var half = 0.5 * size;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(half + x, y + size);
    ctx.lineTo(size + x, y);
    // ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    if (depth <= maxDepth) {
        drawTriangle(x + quarter, y + half, half, depth + 1, maxDepth);
        drawTriangle(x + half, y, half, depth + 1, maxDepth);
        drawTriangle(x, y, half, depth + 1, maxDepth);
    }

}

drawTriangle(0, 0, size, 0, 6);

