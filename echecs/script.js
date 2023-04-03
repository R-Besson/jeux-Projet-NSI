import {File, FileSymbols, Pieces, PieceSymbols, Color, Game} from "./game.js";
import {drawSquares, drawPieces} from "./display.js";

// Elements
var boardSVG = document.getElementById("board");

// Main
var game = new Game();

game.printBoard();
drawSquares(boardSVG);