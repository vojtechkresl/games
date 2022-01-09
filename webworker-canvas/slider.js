var x = 150;
var y = 150;
var sig = 7;

var x = 150;
var y = 150;
var sig = 11;

var update = setInterval(function () {
//    let newx = Math.ceil(Math.random() * 4 - 2);
//    let newy = Math.ceil(Math.random() * 4 - 2);
    x += sig;
    if (x > 300) {
        sig = -sig;
        x = 299;
    }
    else if (x < 0) {
        sig = -sig;
        x = 1;
    }
    postMessage([x, y + 30]);
    }, 
    90
);
