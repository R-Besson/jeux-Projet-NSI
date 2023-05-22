import {File, FileSymbols, Pieces, PieceSymbols, Color, Game} from "./game.js";
import {drawBoard, displaySelectedSquare} from "./display.js";

// Elements
var boardSVG = document.getElementById("board");
var flipBoardButton = document.getElementById("flip");

// Main
var game = new Game();

function mouseIn(x,y,w,h, mouseX, mouseY) {
    return  x < mouseX && mouseX < (x+w) &&
            y < mouseY && mouseY < (y+h)
}

function getSquareAtMouse(mouseX, mouseY) {
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            let zone = game.board[x][y].squareElement.getBoundingClientRect();
            if (mouseIn(zone.x, zone.y, zone.width, zone.height, mouseX, mouseY)) {
                return {x,y};
            }
        }
    }

    return null;
}

// Select Piece
let previousSelected = null;
boardSVG.addEventListener("click", (event) => {
    let selected = getSquareAtMouse(event.clientX, event.clientY);

    if (selected && previousSelected !== selected) {
        displaySelectedSquare(game.board, selected.x, selected.y);

        previousSelected = selected;
    }
})

// Initial draw board
drawBoard(boardSVG, game.board, true, false, "./img/");

// Flip board on button press
let flipped = false;
flipBoardButton.addEventListener("click", () => {
    flipped = !flipped;
    drawBoard(boardSVG, game.board, true, flipped, "./img/");
})