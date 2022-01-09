// globals 
var canvas;;
var ctx;
var x1 = 0;
var y1 = 0;
var x2 = 0;
var y2 = 0;

var myWorker1 = null;

// call main
main();

function main() {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    window.requestAnimationFrame(draw);

    // if (window.Worker) {
    //     myWorker1 = new Worker("mover.js");
    //     myWorker1.onmessage = function(e) {
    //         //console.log('Message received from worker:', e.data[0], e.data[1]);
    //         x1 = e.data[0];
    //         y1 = e.data[1];
    //     }
    // } 
    // else {
    //     console.log('Your browser doesn\'t support web workers.')
    // }
}

let w = undefined;

function btn_onClick() {
    noerr = true;

    if (w != undefined) {
        w.terminate();
        w = undefined;
    };
    //myWorker2 = new Worker("slider.js");

    let code = document.getElementById("robotCode").value;
    var blob = new Blob([code], { type: "application/javascript" });  
    var blobURL = window.URL.createObjectURL(blob);  
    w = new Worker(blobURL);  

    w.onmessage = function(e) {
        x2 = e.data[0];
        y2 = e.data[1];
    }

    w.onerror = function (e) {
        noerr = false;
        // console.log("filename: " + e.filename + ", line: " + e.lineno + ", message: " + e.message + ", all: " + e);
        var s = "Line " + e.lineno + ": " + e.message;
        console.log(s);
        alert(s);
    }
}

var skip = 0;
var noerr = true;
function draw() {
    if (++skip > 0 && noerr) 
    {
        skip = 0;
        if (w) w.postMessage(0);
        if (myWorker1) myWorker1.postMessage(0);
    }

    // Store the current transformation matrix
    ctx.save();
    // Use the identity matrix while clearing the canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Restore the transform
    ctx.restore();

    // ctx.rect(0, 0, canvas.width, canvas.height);
    // ctx.stroke();    

    drawRobot(x1, y1);
    drawRobot(x2, y2);

    window.requestAnimationFrame(draw);
}

function drawRobot(x, y) {

    ctx.beginPath();
    ctx.rect(x-10, y-10, 20, 20);
    // ctx.arc(x, y, 50, 0, Math.PI * 2, true); // Outer circle
    // ctx.moveTo(x+35, y);
    // ctx.arc(x, y, 35, 0, Math.PI, false);  // Mouth (clockwise)
    // ctx.moveTo(x-10, y-10);
    // ctx.arc(x-15, y-10, 5, 0, Math.PI * 2, true);  // Left eye
    // ctx.moveTo(x+20, y-10);
    // ctx.arc(x+20, y-10, 5, 0, Math.PI * 2, true);  // Right eye
    ctx.stroke();
}

