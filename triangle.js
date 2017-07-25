var $canvas = d3.select('#mycanvas');

var size = Math.min($canvas.attr('width'), $canvas.attr('height'))
var lineFn = d3.line()
    .y(function(d){return size - d[1]});


function drawLine(pts) {
    $canvas.append('path').attr('d', lineFn(pts))
        .attr('stroke', 'blue')
        .attr('stroke-width', 1)
        .attr('fill', 'none')
}

function drawTriangle(x, y, size, depth, maxDepth) {
    var quarter = 0.25 * size;
    var half = 0.5 * size;
    var pts = [[x, y], [half + x, y + size], [size + x, y], [x, y]];
    drawLine(pts);

    if (depth <= maxDepth) {
        drawTriangle(x + quarter, y + half, half, depth + 1, maxDepth);
        drawTriangle(x + half, y, half, depth + 1, maxDepth);
        drawTriangle(x, y, half, depth + 1, maxDepth);
    }

}

drawTriangle(0, 0, size, 0, 6);

