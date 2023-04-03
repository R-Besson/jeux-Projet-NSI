import {File, FileSymbols, Pieces, PieceSymbols, Color, Game} from "./game.js";

const PieceSVGs = {
    p: "black_pawn.svg",    // Black Pawn   /   Pion Noir
    n: "black_knight.svg",  // Black Knight /   Chevalier Noir
    b: "black_bishop.svg",  // Black Bishop /   Fou Noir
    r: "black_rook.svg",    // Black Rook   /   Tour Noire
    q: "black_queen.svg",   // Black Queen  /   Dame Noire
    k: "black_king.svg",    // Black King   /   Roi Noir
    P: "white_pawn.svg",    // White Pawn   /   Pion Blanc
    N: "white_knight.svg",  // White Knight /   Chevalier Blanc
    B: "white_bishop.svg",  // White Bishop /   Fou Blanc
    R: "white_rook.svg",    // White Rook   /   Tour Blance
    Q: "white_queen.svg",   // White Queen  /   Dame Blanche
    K: "white_king.svg"     // White King   /   Roi Blanc
};

function clearBoard(boardSVG) {
    boardSVG.innerHTML = "";
}

function drawSquares(boardSVG) {
    clearBoard(boardSVG);

    // On veut un carré donc : height = width 
    boardSVG.style.height = boardSVG.clientWidth + "px";
    let squareSize = Math.floor(boardSVG.clientWidth / 8);

    for (let x = 0; x < 8; x++)
    {
        for (let y = 0; y < 8; y++)
        {
            let square = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

            square.setAttribute('x', x*squareSize);
            square.setAttribute('y', y*squareSize);
            square.setAttribute('height', squareSize);
            square.setAttribute('width', squareSize);
            if ((x+y) % 2 == 0) {
                square.setAttribute('fill', "#fffeee")
            } else {
                square.setAttribute('fill', "#60ab5c")
            }
            square.setAttribute('stroke','grey');
            square.setAttribute('stroke-width', 1);

            boardSVG.appendChild(square);
        }
    }
}

function drawPieces(boardSVG, board) {
    let squareSize = Math.floor(boardSVG.clientWidth / 8);

}

export {drawSquares, drawPieces};