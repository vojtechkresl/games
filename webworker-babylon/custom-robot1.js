var x = 150;
var y = 150;
var sig = 7;

var i = 0;
const SCAN_DEGREE = i++;
const SCAN_RESOLUTION = i++;
const CANNON_DEGREE = i++;
const CANNON_RANGE = i++;
const DRIVE_DEGREE = i++;
const DRIVE_SPEED = i++;

const SCAN_RETVAL = i++;
const CANNON_RETVAL = i++;
const DAMAGE_RETVAL = i++;
const SPEED_RETVAL = i++;
const LOCX_RETVAL = i++;
const LOCY_RETVAL = i++;


var drive_speed = 0; // %
var drive_degree = 0; // degree
var sum = 0

var update = setInterval(function () {
// //    let newx = Math.ceil(Math.random() * 4 - 2);
// //    let newy = Math.ceil(Math.random() * 4 - 2);
//     x += sig;
//     if (x > 300) {
//         sig = -sig;
//         x = 299;
//     }
//     else if (x < 0) {
//         sig = -sig;
//         x = 1;
//     }
    drive_degree += 5 % 360;
    drive_speed += 1.2 //% 10;
    postMessage([drive_degree, drive_speed]);
    }, 
    30
);
