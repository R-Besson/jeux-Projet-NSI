import {File, FileSymbols, Pieces, PieceSymbols, Color, Game} from "./game.js";

var game = new Game();

game.printBoard();

let [x,y] = game.coordinatesToSquare(0,0);

console.log(x,y)