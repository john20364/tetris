function setupCanvas(canvas) {
    // Get the device pixel ratio, falling back to 1.
    var dpr = window.devicePixelRatio || 1;
    // Get the size of the canvas in CSS pixels.
    var rect = canvas.getBoundingClientRect();
    // Give the canvas pixel dimensions of their CSS
    // size * the device pixel ratio.
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    var ctx = canvas.getContext('2d');

    // Switch y-axis
    ctx.transform(1,0,0,-1,0,canvas.height);
    
    // Scale down by dpr and switch y-as orientation
//    ctx.transform(1/dpr,0,0,-1/dpr,0,canvas.height);
    
    // Scale all drawing operations by the dpr, so you
    // don't have to worry about the difference.
//    ctx.scale(dpr, dpr);
    
  return ctx;
}

function colorToHexStr(red, green, blue) {
    var r = 0;
    var g = 0;
    var b = 0;

    if (red !== undefined) {
        r = red;
        if (green !== undefined) {
            g = green;
            if (blue !== undefined) {
                b = blue;
            }
        } else {
            g = red;
            b = red;
        }
    }
    
    var c = (r << 16) + (g << 8) + b;
    c = c.toString(16).toUpperCase();
    
    while (c.length < 6) {
        c = "0" + c;
    }
    return "#" + c;
}

function colorToRGBStr(red, green, blue) {
    var r = 0;
    var g = 0;
    var b = 0;

    if (red !== undefined) {
        r = red;
        if (green !== undefined) {
            g = green;
            if (blue !== undefined) {
                b = blue;
            }
        } else {
            g = red;
            b = red;
        }
    }
    
    return "rgb(" + r + ", " + g + ", " + b + ")";
}

function colorToRGBAStr(red, green, blue, alpha) {
    var r = 0;
    var g = 0;
    var b = 0;
    var a = 255;

    if (red !== undefined) {
        r = red;
        if (green !== undefined) {
            g = green;
            if (blue !== undefined) {
                b = blue;
                if (alpha !== undefined) {
                    a = alpha;
                }
            }
        } else {
            g = red;
            b = red;
        }
    }
    
    return "rgba(" + r + ", " + g + ", " + b + ", " + a / 255 + ")";
}

function generate_heatmap() {
    var heatmap = [];
    for (var i=0; i<256; i++) {
        heatmap[i] = [];
    }
    
    var band = (256 / 3) | 0;
    for (var i = 0; i < 256; i++) {
        r = i * 3;
        g = 0;
        b = 0;
        if (i >= band) {
            r = 255;
            if (i > band) {
                g = (i - band) * 3;
                if (i >= 2 * band) {
                    g = 255;
                    if (i > 2 * band) {
                        b = (i - 2 * band) * 3;
                        if (i == 3 * band)
                            b = 255;
                    }
                }
            }
        }
        heatmap[i][0] = r;
        heatmap[i][1] = g;
        heatmap[i][2] = b;
    }
    return heatmap;
}

/*
**        38
**        /\
**   37 <    > 39
**        \/
**        40
*/
const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;
const KEY_SPACE = 32;
const KEY_PLUS = 107;
const KEY_MINUS = 109;
      

const VIDEO = 1;
const AUDIO = 2;

function constrain(value, min, max) {
    if (value < min) {
        value = min;
    } else if (value > max) {
        value = max;
    }
    return value;
}

function createCapture(flags, cb) {
    var camstream;
    var vWidth = 320;
    var vHeight = 240;
    var constraint = {audio: true, video: true};
    var _c = document.createElement('canvas');    
    var _ctx = _c.getContext("2d"); 
    
    constraint.audio = flags & AUDIO;
    constraint.video = flags & VIDEO;
    
    var node = document.lastChild.appendChild(
        document.createElement('video'));
    node.setAttribute("autoplay", "true");
    if (cb) {
        node.onloadeddata = cb;
    }

    if (navigator.getUserMedia) {
        navigator.getUserMedia(
            constraint,
            function (stream) {
                camstream = stream;
                node.src = window.URL.createObjectURL(stream);
            },
            function () {
                console.log("problem accessing the camera");
            }
        );
    } else {
        return null;
    }
    
    return {node: node,
            quit: function () {
                camstream.getVideoTracks().forEach(function (track) {
                    track.stop();
                })
                camstream.getAudioTracks().forEach(function (track) {
                    track.stop();
                })
                node.src = '';
            },
            size: function (width, height) {
                vWidth = width;
                vHeight = height;
                node.style.width = width.toString(10) + 'px';
                node.style.height = height.toString(10) + 'px';
            },
            image: function (ctx) {
                ctx.drawImage(node, 0, 0, 
                              vWidth, 
                              vHeight);
            },
            getImage: function () {
              _c.width = vWidth;
              _c.height = vHeight;

              _ctx.drawImage(node, 0, 0, _c.width, _c.height);
              var img = new Image();
              img.src = _c.toDataURL();

              return img;
            },
            getData: function () {
              _c.width = vWidth;
              _c.height = vHeight;

              _ctx.drawImage(node, 0, 0, _c.width, _c.height);
              var data = _ctx.getImageData(0, 0, _c.width, _c.height);
                
              return data;
            },
            hide: function () {
                node.style.display = 'none';
            },
            show: function () {
                node.style.display = 'inline';
            }
           };
} 


function createSlider(min=0, max=100, value=50, step=1) {
    var node = document.lastChild.appendChild(
        document.createElement('input'));
    
    node.setAttribute("type", "range");
    node.min = min.toString(10);
    node.max = max.toString(10);
    node.step = step.toString(10);
    node.value = value.toString(10);
    
    return node;
}

function createP(text) {
    var node = document.lastChild.appendChild(
        document.createElement('p'));
    node.innerHTML = text;
    return node;
}

function createButton(text) {
    var node = document.lastChild.appendChild(
        document.createElement('button'));
    node.innerHTML = text;
    return node;
}

function createCheckbox() {
    var node = document.lastChild.appendChild(
        document.createElement('input'));
    
    node.setAttribute("type", "checkbox");
    return node;
}

//var calculateFps = (function () {
//    var stopwatch = Date.now;
//    var lastTime = 0;
//    
//    return function () {
//        var now = stopwatch();
//        var fps = 1000 / (now - lastTime);
//        lastTime = now;
//
//        return fps | 0;
//    }
//}());
