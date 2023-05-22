import {File, FileSymbols, Pieces, PieceSymbols, Color, Game} from "./game.js";
import {drawBoard} from "./display.js";

// Elements
var boardSVG = document.getElementById("board");
var flipBoardButton = document.getElementById("flip");



// Main
var game = new Game();

function mouseIn(x,y){
    let squareSize = Math.floor(boardSVG.clientWidth / 8);
    return x>=0 && y>= 0 && x<= 8*squareSize && y<=8*squareSize;
}

function getMouseCoordinates(x,y){
    let squareSize = Math.floor(boardSVG.clientWidth / 8);
    if (mouseIn(x,y)){
       for (let i = 0;i<8;i++){
            for (let j = 0;j<8;j++){
                if (x>=i*squareSize && y>= j*squareSize && x<= i+1*squareSize && y<=j+1*squareSize){
                    return {i,j};
                }
            }
       }
    }
}

function selectPiece(){
    board.svg.addEventListener("click", () => {
        consol.log(getMouseCoordinates());
    })
}

drawBoard(boardSVG, game.board, true, false, "./img/");


let flipped = false;
flipBoardButton.addEventListener("click", () => {
    flipped = !flipped;
    drawBoard(boardSVG, game.board, true, flipped, "./img/");
})