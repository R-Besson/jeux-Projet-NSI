import {File, FileSymbols, Pieces, PieceSymbols, Color, Game} from "./game.js";

const PieceSVGs = [
    "",
    "black_pawn.svg",    // Black Pawn   /   Pion Noir
    "black_knight.svg",  // Black Knight /   Chevalier Noir
    "black_bishop.svg",  // Black Bishop /   Fou Noir
    "black_rook.svg",    // Black Rook   /   Tour Noire
    "black_queen.svg",   // Black Queen  /   Dame Noire
    "black_king.svg",    // Black King   /   Roi Noir
    "white_pawn.svg",    // White Pawn   /   Pion Blanc
    "white_knight.svg",  // White Knight /   Chevalier Blanc
    "white_bishop.svg",  // White Bishop /   Fou Blanc
    "white_rook.svg",    // White Rook   /   Tour Blance
    "white_queen.svg",   // White Queen  /   Dame Blanche
    "white_king.svg"     // White King   /   Roi Blanc
];

const Colors = {
    WhiteSquare: "#eeeed2",
    BlackSquare: "#769656"
}

function clearBoard(boardSVG) {
    boardSVG.innerHTML = "";
}
function resizeBoard(boardSVG) {
    // On veut un carré donc : height = width 
    boardSVG.style.width = boardSVG.clientHeight + "px";
}

function drawSquares(boardSVG) {
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
                square.setAttribute('fill', Colors.WhiteSquare);
            } else {
                square.setAttribute('fill', Colors.BlackSquare);
            }

            square.setAttribute('stroke','grey');
            square.setAttribute('stroke-width', 1);

            boardSVG.appendChild(square);
        }
    }
}

function drawPieces(boardSVG, board, SVGsPath, flipped) {
    let squareSize = Math.floor(boardSVG.clientWidth / 8);

    for (let x = 0; x < 8; x++)
    {
        for (let y = 0; y < 8; y++)
        {
            let piece = flipped ? (board[7-x][y]) : (board[x][7-y]);
            if (piece == Pieces.empty) {
                continue;
            }

            let embeddedSvg = document.createElementNS("http://www.w3.org/2000/svg", 'image');
            let offset = Math.floor(squareSize/8.5);
            
            embeddedSvg.setAttribute('x', x*squareSize + offset);
            embeddedSvg.setAttribute('y', y*squareSize + offset);
            embeddedSvg.setAttribute('height', squareSize - 2*offset);
            embeddedSvg.setAttribute('width', squareSize - 2*offset);
            embeddedSvg.setAttribute('href', SVGsPath+PieceSVGs[piece]);

            boardSVG.appendChild(embeddedSvg);
        }
    }
}

function drawNumbers(boardSVG, flipped)
{
    let squareSize = Math.floor(boardSVG.clientWidth / 8);

    // Draw Rank numbers
    for (let y = 0; y < 8; y++) {
        let rankNumber = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        let offset = Math.floor(squareSize/10);
        
        rankNumber.setAttribute('x', offset);
        rankNumber.setAttribute('y', y*squareSize + 2*offset);
        rankNumber.setAttribute("text-anchor", "middle");
        rankNumber.setAttribute("style", "font: bold 12px monospace;");
        rankNumber.innerHTML = flipped ? (y+1).toString() : (7-y+1).toString();

        boardSVG.appendChild(rankNumber);
    }

    // Draw File numbers
    for (let x = 0; x < 8; x++) {
        let fileLetter = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        let offset = Math.floor(squareSize/10);
        
        fileLetter.setAttribute('x', x*squareSize + squareSize - offset);
        fileLetter.setAttribute('y', 7*squareSize + squareSize - offset/2);
        fileLetter.setAttribute("text-anchor", "middle");
        fileLetter.setAttribute("style", "font: bold 12px monospace;");
        fileLetter.innerHTML = flipped ? FileSymbols[7-x] : FileSymbols[x];

        boardSVG.appendChild(fileLetter);
    }
}

function drawBoard(boardSVG, board, showNumbers, flipped, pieceSVGsPath) {
    clearBoard(boardSVG);
    resizeBoard(boardSVG);
    drawSquares(boardSVG);
    drawPieces(boardSVG, board, pieceSVGsPath, flipped);

    if (showNumbers) {
        drawNumbers(boardSVG, flipped)
    }
}

export {drawBoard};