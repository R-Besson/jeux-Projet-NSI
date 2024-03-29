import { states } from "../morpions/game.js";
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
    BlackSquare: "#769656",
    SelectedWhiteSquare: "#d4d4ba",
    SelectedBlackSquare: "#607a46"
}

function clearBoard(boardSVG)
{
    boardSVG.innerHTML = "";
}

function resizeBoard(boardSVG)
{
    // On veut un carré donc : height = width 
    // let size = Math.min(boardSVG.style.width, boardSVG.style.height);
    // boardSVG.style.width = size + "px";
    // boardSVG.style.height = size + "px";
}

function drawSquares(boardSVG, board)
{
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

            board[x][7-y].squareElement = square;
            
            boardSVG.appendChild(square);
        }
    }
}

function drawPieces(boardSVG, board, SVGsPath, flipped)
{
    let squareSize = Math.floor(boardSVG.clientWidth / 8);

    for (let x = 0; x < 8; x++)
    {
        for (let y = 0; y < 8; y++)
        {
            let piece = (flipped ? (board[7-x][y]) : (board[x][7-y])).piece;
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

            board[x][7-y].pieceElement = embeddedSvg;

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

        // Opposite font color (x=0)
        if ((0+y) % 2 == 0) {
            rankNumber.setAttribute('fill', Colors.BlackSquare);
        } else {
            rankNumber.setAttribute('fill', Colors.WhiteSquare);
        }

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

        // Opposite font color (y=7)
        if ((x+7) % 2 == 0) {
            fileLetter.setAttribute('fill', Colors.BlackSquare);
        } else {
            fileLetter.setAttribute('fill', Colors.WhiteSquare);
        }

        boardSVG.appendChild(fileLetter);
    }
}

function drawBoard(boardSVG, board, showNumbers, flipped, pieceSVGsPath)
{
    clearBoard(boardSVG);
    resizeBoard(boardSVG, board);
    drawSquares(boardSVG, board);
    drawPieces(boardSVG, board, pieceSVGsPath, flipped);

    if (showNumbers) {
        drawNumbers(boardSVG, flipped)
    }
}

var previousSelected = null;
function displaySelectedSquare(board, x, y)
{
    if (previousSelected) {
        let previousX = previousSelected.x, previousY = previousSelected.y;
        if ((previousX+previousY) % 2 == 0) {
            board[previousX][previousY].squareElement.setAttribute('fill', Colors.BlackSquare);
        } else {
            board[previousX][previousY].squareElement.setAttribute('fill', Colors.WhiteSquare);
        }
    }

    if (board[x] && board[x][y] && board[x][y].squareElement) {
        if ((x+y) % 2 == 0) {
            board[x][y].squareElement.setAttribute('fill', Colors.SelectedBlackSquare);
        } else {
            board[x][y].squareElement.setAttribute('fill', Colors.SelectedWhiteSquare);
        }
        previousSelected = {x,y};
    }
}

let previousCoordsList = null;
function displayDots(board, boardSVG, coordsList)
{
    if (previousCoordsList)
    {
        for (let {x,y} of previousCoordsList)
        {
            if (!(board[x] && board[x][y] && board[x][y].squareElement && board[x][y].circleElement))
                continue;

                boardSVG.removeChild(board[x][y].circleElement);
        }
    }

    let squareSize = Math.floor(boardSVG.clientWidth / 8);

    for (let {x,y} of coordsList)
    {
        if (!(board[x] && board[x][y]))
            continue;
        if (board[x][y].piece !== Pieces.empty)
            continue;
        
            console.log(x,y)

        // Create circle element
        var circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
        circle.setAttribute('cx', squareSize*x+squareSize/2);
        circle.setAttribute('cy', squareSize*y+squareSize/2);
        circle.setAttribute('r', squareSize/8);
        circle.setAttribute('fill', "rgba(30,30,30,0.5)");
        board[x][y].circleElement = circle;
        boardSVG.appendChild(circle)

        console.log(circle)
    }

    previousCoordsList = coordsList
}

export {drawBoard, displaySelectedSquare, displayDots};