const oColor = "#FF0000";
const xColor = "#0000FF";
const boardColor = "#000000";
const playerX = "X";
const playerO = "O";
const emptyCell = "";
const boarderPercent = 10;
const lineWidth = 6;
const playerPadding = 20;
const drawInterval = 10; // miliseconds
const drawTime = 1000; // miliseconds
const drawCount = drawTime / drawInterval;
const drawSlow = true;
//player X starts the game
var currentPlayer = playerX;
var isDrawing = false;
var gameOver = false;

var currentLocation = [];
var startTime;

const canvas = document.getElementById("canvas");
const messageBox = document.getElementById("message");
const infoArea = document.getElementById("infoArea");
var boxSize = (Math.floor(Math.min(window.innerHeight, window.innerWidth)/10) - 10) * 10 ;
canvas.width = boxSize;
canvas.height = boxSize;
infoArea.style.maxWidth = boxSize +"px";
var percent = boxSize / 100;
var boarder = percent * boarderPercent;
var boardSize = boxSize - (percent * boarderPercent * 2);
var squareSize = boardSize / 3;

var board = [[emptyCell,emptyCell,emptyCell],[emptyCell,emptyCell,emptyCell],[emptyCell,emptyCell,emptyCell]]
const ctx = canvas.getContext("2d");
drawGameBoard();

canvas.addEventListener('click', (e) =>{
    console.log(gameOver);
    if(gameOver) return;
    if(isDrawing) return;
    message.innerText = "";
    if(e.clientX > boarder && e.clientX < boarder + boardSize &&
       e.clientY > boarder && e.clientY < boarder + boardSize){
        loop:
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if((e.clientX < (boarder + squareSize * (j + 1))) && (e.clientY < (boarder + squareSize * (i + 1)))){
                    message.innerText = "click at " + i + " " + j;
                    board[i][j] = currentPlayer;
                    if(currentPlayer === playerX){
                        drawX([i,j], drawSlow);
                        currentPlayer = playerO;
                    }else{
                        drawO([i,j], drawSlow);
                        currentPlayer = playerX;
                    }                   
                    break loop;
                }
            }
        }
    }else{
        message.innerText = "";
    }
    checkTie();
});

// draw the board
function drawGameBoard(){
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw the playing board
    ctx.strokeStyle = boardColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(boarder + squareSize, boarder);
    ctx.lineTo(boarder + squareSize, boarder + boardSize);
    ctx.moveTo(boarder + squareSize * 2, boarder);
    ctx.lineTo(boarder + squareSize * 2, boarder + boardSize);
    ctx.moveTo(boarder, boarder + squareSize);
    ctx.lineTo(boarder + boardSize, boarder + squareSize );
    ctx.moveTo(boarder, boarder + (2 * squareSize));
    ctx.lineTo(boarder + boardSize, boarder + (2 *squareSize) );
    ctx.stroke();
}

//location is a array of 2 [0] the row and [1] the column
function drawO(location, slowDraw){
    isDrawing = true;
    let x = boarder + (squareSize * (location[1] + 1)) - (squareSize / 2);
    let y = boarder + (squareSize * (location[0] + 1)) - (squareSize / 2);
    let r = squareSize / 2 - playerPadding;
    ctx.strokeStyle = oColor;
    if(slowDraw){
        requestAnimationFrame(function(timestamp){
            startTime = timestamp;
            currentLocation[0] = location[0];
            currentLocation[1] = location[1];
            requestAnimationFrame(drawOSlow);
        });
    }else{
        //Fast draw
        ctx.beginPath();
        ctx.arc(x,y,r,0,2*Math.PI);
        ctx.stroke();
        isDrawing = false;
    }
}

function drawOSlow(timeStamp){
    let runtime = timeStamp - startTime;
    let progress = runtime / drawTime * 100;
    let arc = 2 * Math.PI / 100 * progress;
    let x = boarder + (squareSize * (currentLocation[1] + 1)) - (squareSize / 2);
    let y = boarder + (squareSize * (currentLocation[0] + 1)) - (squareSize / 2);
    let r = squareSize / 2 - playerPadding;
    ctx.beginPath();
    ctx.arc(x,y,r,0, arc);
    ctx.stroke();
    if(runtime < drawTime){
        requestAnimationFrame(drawOSlow);
    }
    else
    {
        isDrawing = false;
    }    
}

function drawX(location, slowDraw){
    isDrawing = true;
    ctx.strokeStyle = xColor;
    if(slowDraw)
    {
        requestAnimationFrame(function(timestamp){
            startTime = timestamp;
            currentLocation[0] = location[0];
            currentLocation[1] = location[1];
            requestAnimationFrame(drawXSlow);
        });    }
    else
    {
        //Fast Draw the X
        let x1 = boarder + (squareSize * location[1] + playerPadding);
        let y1 = boarder + (squareSize * location[0] + playerPadding);
        let x2 = x1 + squareSize - 2 * playerPadding - lineWidth;
        let y2 = y1 + squareSize - 2 * playerPadding - lineWidth;
        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.moveTo(x1,y2);
        ctx.lineTo(x2,y1) 
        ctx.stroke();
        isDrawing = false;
    }
}

function drawXSlow(timeStamp){
    let runtime = timeStamp - startTime;
    let ratio = runtime / drawTime;
    let x1 = boarder + (squareSize * currentLocation[1] + playerPadding);
    let y1 = boarder + (squareSize * currentLocation[0] + playerPadding);
    let x2 = x1 + squareSize - 2 * playerPadding - lineWidth;
    let y2 = y1 + squareSize - 2 * playerPadding - lineWidth;
    if(ratio > 1) ratio = 1;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    var ratio1 = Math.min(ratio * 2,1);
    x2p = x1 + ratio1 * (x2-x1);
    y2p = y1 + ratio1 * (y2-y1);
    ctx.lineTo(x2p,y2p);
    if(ratio > .5){
        ctx.moveTo(x1,y2);
        var ratio2 = Math.max((ratio - 0.5)*2,0);
        x2p = x1 + ratio2 * (x2-x1);
        y2p = y2 + ratio2 * (y1-y2);
        ctx.lineTo(x2p,y2p);
    }
    ctx.stroke(); 
    if(ratio < 1) {
        requestAnimationFrame(drawXSlow);
    }else{
        isDrawing = false;
    }  
}

function checkTie(){
    // if there isn't a winner and no more moves left on the board
    // the game is tied
    if(gameOver) 
        return false;
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            console.log(board[i][j]);
            console.log(emptyCell);
            if(board[i][j] == emptyCell ){
                return false;
            }
        }
    }
    gameOver = true;
    message.innerText = "Game Over";
    return true;
}

function checkWin(){
    // is if someone has won the game
    return false;
}