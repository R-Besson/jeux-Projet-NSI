import {File, FileSymbols, Pieces, PieceSymbols, Color, Game} from "./game.js";
import {drawBoard} from "./display.js";

// Elements
var boardSVG = document.getElementById("board");
var flipBoardButton = document.getElementById("flip");

// Main
var game = new Game("rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2");

drawBoard(boardSVG, game.board, true, false, "./img/");

let flipped = false;
flipBoardButton.addEventListener("click", () => {
    flipped = !flipped;
    drawBoard(boardSVG, game.board, true, flipped, "./img/");
})