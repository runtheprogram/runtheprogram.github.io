var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

let lastX, lastY;

let animRequestId = null;




document.addEventListener('pointerdown', evt => {
    lastX = evt.x;
    lastY = evt.y;

    return scheduleNextDraw(lastX, lastY);
});

document.addEventListener('pointermove', evt => {
    lastX = evt.x;
    lastY = evt.y;

    return scheduleNextDraw(lastX, lastY);
});

const setContextSize = function() {
    context.canvas.width  = window.innerWidth;
    context.canvas.height = window.innerHeight;
}

const scheduleNextDraw = function (x, y) {

    if (animRequestId) {
        window.cancelAnimationFrame(animRequestId)
    }

    animRequestId = window.requestAnimationFrame(
        function () {
            animRequestId = null;
            if (busyDrawingFlag === false) {
                busyDrawingFlag = true;
                draw({
                    context,
                    width: context.canvas.width,
                    height: context.canvas.height,
                    x,
                    y,
                    // colors,
                });
                busyDrawingFlag = false;
            }
            else {
                scheduleNextDraw(lastX, lastY);
            }
        }
    )
}

let busyDrawingFlag = false;

const draw = function ({
    context,
    width,
    height,
    radius = 20,
    lineWidth = [ 10, 2, 5, 10, 4, 1, 18 ],
    step = [ 50, 12, 70, 80, 10, 12, 180 ],
    coresToDraw = 1,
    repeat = 7,
    x,
    y,
    colors = ['yellow', 'yellow', 'pink', 'pink'],
}) {

    // console.log('draw', {
    //     context,
    //     width,
    //     height,
    //     radius,
    //     step,
    //     coresToDraw,
    //     repeat,
    //     x,
    //     y,
    //     colors,
    // })
    
    // var centerX = 0; //canvas.width / 2;
    // var centerY = 100;//canvas.height / 2;

    context.clearRect(0, 0, width, height);

    let cores = [[[x, y]]];

    let m = 255 / coresToDraw;

    for (let i = 0; i < coresToDraw; i += 1) {

        cores[i + 1] = [];


        for (let core of cores[i]) {
            // console.log(core)
            if (core[0] > 0) {
                // add reflection left
                cores[i + 1].push([0 - core[0], core[1]]);
            }
            if (core[0] < width) {
                // add reflection right
                cores[i + 1].push([2 * width - core[0], core[1]]);
            }
            if (core[1] > 0) {
                // add reflection top
                cores[i + 1].push([core[0], 0 - core[1]]);
            }
            if (core[1] < height) {
                // add reflection bottom
                cores[i + 1].push([core[0], 2 * height - core[1]]);
            }
        }

        // cores = newCores;

        // console.log(cores);
    }

    for (let i = cores.length - 1; i >= 0; i -= 1) {

        for (let core of cores[i]) {

            // const color = i * m + 1;

            let dist = 0;
            
            for (let a = 0; a < repeat; a += 1) {

                dist += step[a];

                // console.log( colors[i] );
                // console.log(core)
                context.beginPath();
                context.arc(core[0], core[1], radius + dist, 0, 2 * Math.PI, false);
                // context.fillStyle = 'green';
                // context.fill();
                context.lineWidth = lineWidth[a];
                context.strokeStyle = colors[a];//`rgb(${color},${color},${color})`;
                // context.strokeStyle = '#F00';//`rgb(${color},${color},${color})`;
                context.stroke();
            }
        }
    }
}

window.addEventListener('resize', setContextSize);

setContextSize();

scheduleNextDraw(100,100);