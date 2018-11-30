let canvas, context, width, height;
let nFieldWidth = 12;
let nFieldHeight = 18;
let aField = [];

let nCurrentPiece = 0;
let nCurrentRotation = 0;
let nCurrentX = nFieldWidth / 2 - 2;
let nCurrentY = 0;
let nKeyCode = 0;
let bGameOver = false;
let bRotateHold = false;
let nSpeed = 0;
let nSpeedCounter = 0;
let bForceDown = false;
let nFps = 0;
let aLines = [];
let fPauseCounter = 0;
let nPieceCount = 0;
let nAccelerate = 0
let nScore = 0;

function box (ctx, x, y, w, color) {
    ctx.strokeStyle = color;
    ctx.strokeWidth = 1;
    ctx.strokeRect(x+0.5, y+0.5, w, w);
}

function fillBox (ctx, x, y, w, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x+0.5, y+0.5, w, w);
    ctx.strokeStyle = "black";
    ctx.strokeWidth = 1;
    ctx.strokeRect(x+0.5, y+0.5, w, w);
}

let tetromino = [];
let aPalette = ["black","red","green","yellow","blue","orange","purple","pink","gray","lime"];

function init() {
    // init aField
    for (let y=0; y<nFieldHeight; y++) {
        for (let x=0; x<nFieldWidth; x++) {
            aField[y*nFieldWidth+x] = (x == 0 || x == nFieldWidth - 1 || y == nFieldHeight - 1) ? 8 : 0;
        }
    }
    
    // Declare tetrominoes
    tetromino.push(
        "..X."+
        "..X."+
        "..X."+
        "..X.");

    tetromino.push(
        "..X."+
        ".XX."+
        ".X.."+
        "....");

    tetromino.push(
        ".X.."+
        ".XX."+
        "..X."+
        "....");

    tetromino.push(
        "...."+
        ".XX."+
        ".XX."+
        "....");

    tetromino.push(
        "..X."+
        ".XX."+
        "..X."+
        "....");

    tetromino.push(
        ".XX."+
        ".X.."+
        ".X.."+
        "....");

    tetromino.push(
        ".XX."+
        "..X."+
        "..X."+
        "....");
}

// Rotate functions
//
//0 1 2 3
//4 5 6 7
//8 9 A B
//C D E F
//
//i = (y * 4) + x
//
//C 8 4 0
//D 9 5 1
//E A 6 2
//F B 7 3
//
//i = 12 + y - (4 * x)
//
//F E D C
//B A 9 8
//7 6 5 4
//3 2 1 0
//
//i = 15 - (y * 4) - x 
//
//3 7 B F
//2 6 A E 
//1 5 9 D
//0 4 8 C
//
//i = 3 - y + (x * 4)
function rotate(px, py, r) {
    switch(r % 4) {
        case 0: return (py * 4) + px;         // 0 degrees
        case 1: return 12 + py - (4 * px);    // 90 degrees
        case 2: return 15 - (py * 4) - px;    // 180 degrees
        case 3: return 3 - py + (px * 4);     // 270 degrees
    }
    return 0;
}

window.onload = function () {
    init();

    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    //width = canvas.width = window.innerWidth;
    //height = canvas.height = window.innerHeight;
    width = canvas.width = 600;
    height = canvas.height = 600;
    
    ElapsedTime();
    runGame();
};


let fLastTime = 0;
function ElapsedTime() {
    let fNow = + new Date();
    let fElapsed = fNow - fLastTime;
    fLastTime = fNow;
    return fElapsed;
}

function runGame() {
    GameLoop(ElapsedTime());
    if (!bGameOver) 
        requestAnimationFrame(runGame);
}

function doesPieceFit(nTeromino, nRotation, nPosX, nPosY) {
    for (let px = 0; px < 4; px++) {
        for (let py = 0; py < 4; py++) {
            
            // Get index into piece
            let pi = rotate(px, py, nRotation);
            
            // Get index into field
            let fi = (nPosY + py) * nFieldWidth + (nPosX + px);
            
            if (nPosX + px >= 0 && nPosX + px < nFieldWidth) {
                if (nPosY + py >= 0 && nPosY + py < nFieldHeight) {
                    if (tetromino[nTeromino][pi] === 'X' && aField[fi] !== 0) return false;
                } 
            }
        }
    }
    return true;
}

function GameLoop(fElapsed) {
    // Clear screen
    context.fillStyle = "black";
    context.fillRect(0,0,width,height);

    // GAME TIMING ==================================
    nFps = (1000 / fElapsed).toFixed();
    
    nSpeed = nFps - nAccelerate;
    nSpeedCounter++;
    bForceDown = (nSpeedCounter >= nSpeed);
    
    
    // INPUT ========================================
    
    // GAME LOGIC ===================================
        switch (nKeyCode) {
        case LEFT_ARROW:
            if (doesPieceFit(nCurrentPiece, nCurrentRotation, 
                             nCurrentX - 1, nCurrentY)) {
                nCurrentX--;    
            }
            break;
        case RIGHT_ARROW:
            if (doesPieceFit(nCurrentPiece, nCurrentRotation, 
                             nCurrentX + 1, nCurrentY)) {
                nCurrentX++;    
            }
            break;
        case UP_ARROW:
            if (!bRotateHold && doesPieceFit(nCurrentPiece, nCurrentRotation + 1, 
                             nCurrentX, nCurrentY)) {
                bRotateHold = true;
                nCurrentRotation++;
            }
            break;
        case DOWN_ARROW:
        case KEY_SPACE:
            if (doesPieceFit(nCurrentPiece, nCurrentRotation, 
                             nCurrentX, nCurrentY + 1)) {
                nCurrentY++;    
            }
            break;
    }
    nKeyCode = 0;

    if (bForceDown) {
        if (doesPieceFit(nCurrentPiece, nCurrentRotation, 
                         nCurrentX, nCurrentY + 1)) {
            nCurrentY++;    
        } else {
            // Lock current piece into the field
            for (let py = 0; py < 4; py++) {
                for (let px = 0; px < 4; px++) {
                    if (tetromino[nCurrentPiece][rotate(px, py, nCurrentRotation)] === 'X') 
                    {
                        aField[(nCurrentY + py) * nFieldWidth + nCurrentX + px]=nCurrentPiece+1;
                    }
                }
            }
            
            // Increase gamespeed after 10 pieces
            nPieceCount++;
            if (nPieceCount % 10 === 0) {
                if (nSpeed > 0) nAccelerate++;
            }
                
            // Have we got lines
            for (let py = 0; py < 4; py++) {
                if (nCurrentY + py < nFieldHeight - 1) {
                    let bLine = true;
                    for (let px = 1; px < nFieldWidth - 1; px++) {
                        bLine &= (aField[(nCurrentY + py) * nFieldWidth + px] !== 0);
                    }
                    
                    if (bLine) {
                        for (let px = 1; px < nFieldWidth - 1; px++) {
                            aField[(nCurrentY + py) * nFieldWidth + px] = 9;
                        }
                        
                        aLines.push(nCurrentY + py);
                    }
                    
                }
            }
            
            nScore += 25;
            if (aLines.length > 0) nScore += (1 << aLines.length) * 100;
            
            // Choose next piece
            nCurrentPiece = Math.floor((Math.random() * 7));
            nCurrentRotation = 0;
            nCurrentX = nFieldWidth / 2 - 2;
            nCurrentY = 0;            
            
            // If piece does not fit -> Game Over
            bGameOver = !doesPieceFit(nCurrentPiece, nCurrentRotation, 
                         nCurrentX, nCurrentY);
        }
        
        nSpeedCounter = 0;
    }
    
    // RENDER OUTPUT ================================
    
    let xOffset = 4;
    let yOffset = 1;
    let nScale = 30;

    // Draw aField
    for (let y=0; y<nFieldHeight; y++) {
        for (let x=0; x<nFieldWidth; x++) {
            let xScreen = (xOffset + x)*nScale;    
            let yScreen = (yOffset + y)*nScale;  
            let i = aField[y*nFieldWidth+x];
            if (i !== 0) {
               fillBox(context,xScreen,yScreen,nScale,
                       aPalette[i]);                            
            }
        }
    }
    
    // Draw current piece
    for (let py = 0; py < 4; py++) {
        for (let px = 0; px < 4; px++) {
            if (tetromino[nCurrentPiece][rotate(px, py, nCurrentRotation)] === 'X') 
            {
                let xScreen = (xOffset + nCurrentX + px)*nScale;    
                let yScreen = (yOffset + nCurrentY + py)*nScale; 
                fillBox(context,xScreen,yScreen,nScale,aPalette[nCurrentPiece+1])
            }
        }
    }

    // Draw FPS
    context.fillStyle = "white";
    context.font="20px Arial";
    context.fillText(nFps, 30,30);

    // Draw Score
    context.fillStyle = "yellow";
    context.font="20px Arial";
    context.fillText(nScore, 30,60);
    
    // Draw Game Over
    if (bGameOver) {
        context.fillStyle = "Red";
        context.font="40px Arial";
        context.fillText("Game Over !!!", 180,200);
    }
    
    // Remove full lines
    if (aLines.length > 0) {
        fPauseCounter += fElapsed;
        // wait 500 ms before removing the rows
        if (fPauseCounter >= 500) {
            aLines.forEach((e) => {
                for (let px = 1; px < nFieldWidth - 1; px++) {
                    for (let py = e; py > 0; py--) {
                        aField[py * nFieldWidth + px] = aField[(py - 1) * nFieldWidth + px];
                    }
                    aField[px] = 0;
                }
            })

            aLines = [];
            fPauseCounter = 0;
        }
    }
}

window.onkeydown = (e) => {
    nKeyCode = e.keyCode;
}
window.onkeyup = (e) => {
    bRotateHold = false;
}
