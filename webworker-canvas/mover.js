var x = 150;
var y = 150;
var sig = 11;

// var update = setInterval(function () {
//     x += sig;
//     if (x > 300) {
//         sig = -sig;
//         x = 299;
//     }
//     else if (x < 0) {
//         sig = -sig;
//         x = 1;
//     }
//     postMessage([x, y - 60]);
//     }, 
//     90
// );

onmessage = function(e) {
    x += sig;
    if (x > 300) {
        sig = -sig;
        x = 299;
    }
    else if (x < 0) {
        sig = -sig;
        x = 1;
    }
    postMessage([x, y - 60]);
}