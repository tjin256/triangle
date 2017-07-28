var $canvas = d3.select('#mycanvas');

var ctx = $canvas.node().getContext('2d');

var size = Math.min($canvas.attr('width'), $canvas.attr('height'))
var zoom = d3.zoom().on('zoom', zoomed);

$canvas.call(zoom);

var numDrawn = 0, numLogicDrawn = 0;

var scale = 1, dx = 0, dy = 0, minX = 0, maxX = size, minY = 0, maxY = size;


function zoomed() {
    ctx.save();
    ctx.clearRect(0, 0, size, size);
    var transform = d3.event && d3.event.transform || {  x: dx, y: dy, k: scale};

    if (lockTranslate.checked) {
        transform.x = transform.y = 0;
    }

    dx = transform.x;
    dy = transform.y;
    scale = transform.k;
    $transform.innerHTML = 'x: ' + dx.toFixed(1) + ' y:' + dy.toFixed(1) + ' scale:' + scale.toFixed(1);
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.k, transform.k);
    minX = -dx / scale;
    minY = -dy / scale;
    maxX = (size - dx) / scale;
    maxY = (size - dy) / scale;

    if ($math.checked) {
        ctx.strokeStyle = '#FF0000';
        draw();
    }
    ctx.restore();

    if ($logic.checked) {
        ctx.strokeStyle = '#0000FF'
        var tempDx = dx, tempDy = dy, tempScale = scale
        while (tempScale > 4) {
            tempScale/=2;
        }
        numLogicDrawn = 0;
        var tempSize = size * tempScale;
        drawLogicTriangle(2+tempDx, tempDy, tempSize, 0, 5);

        $logicLabel.innerHTML = 'scale: ' + Math.round(scale) + ' triangles: ' + numLogicDrawn;
    }
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

function drawLogicTriangle(x, y, size, depth, maxDepth) {
    var quarter = 0.25 * size;
    var half = 0.5 * size;

    ctx.beginPath();
    ctx.lineWidth = 0.1;
    ctx.moveTo(x, y);
    ctx.lineTo(half + x, y + size);
    ctx.lineTo(size + x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();

    ++numLogicDrawn;

    if (depth <= maxDepth) {
        drawLogicTriangle(x + quarter, y + half, half, depth + 1, maxDepth);
        drawLogicTriangle(x + half, y, half, depth + 1, maxDepth);
        drawLogicTriangle(x, y, half, depth + 1, maxDepth);
    }

}


var $label = document.getElementById('label');
var $logicLabel = document.getElementById('logicLabel');
var $math = document.getElementById('math');
var $logic = document.getElementById('logic');
var $transform = document.getElementById('transform');
var $lockTranslate = document.getElementById('lockTranslate');

$math.onchange = $logic.onchange = function(){
    zoomed()
};

function draw(){
    numDrawn = 0;
    var levels = 6 + Math.log(scale)/Math.log(2);
    drawTriangle(0, 0, size, 0, levels);
    document.title = Math.round(scale) + ', ' + levels.toFixed(1) + ', ' + numDrawn;
    $label.innerHTML = 'scale: ' + Math.round(scale) + ' levels:' + levels.toFixed(1) + ' triangles: ' + numDrawn;
}

draw();