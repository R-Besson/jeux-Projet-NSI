import { states } from "../morpions/game";

// Enum Files
const File = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
}
const FileSymbols = ['a','b','c','d','e','f','g','h']

// Enum Pieces
const Pieces = {
    empty: 0,   // Empty        /   Vide
    p: 1,       // Black Pawn   /   Pion Noir
    n: 2,       // Black Knight /   Chevalier Noir
    b: 3,       // Black Bishop /   Fou Noir
    r: 4,       // Black Rook   /   Tour Noire
    q: 5,       // Black Queen  /   Dame Noire
    k: 6,       // Black King   /   Roi Noir
    P: 7,       // White Pawn   /   Pion Blanc
    N: 8,       // White Knight /   Chevalier Blanc
    B: 9,       // White Bishop /   Fou Blanc
    R: 10,      // White Rook   /   Tour Blance
    Q: 11,      // White Queen  /   Dame Blanche
    K: 12       // White King   /   Roi Blanc
};
const PieceSymbols = [' ', 'p', 'n', 'b', 'r', 'q', 'k', 'P', 'N', 'B', 'R', 'Q', 'K'];

// Enum Colors
const Color = {
    w: 0, // White  /   Blanc
    b: 1  // Black  /   Noir
};
const ColorSymbols = ['w',"b"];

class Square {
    constructor(piece, squareElement, pieceElement, circleElement)
    {
        this.piece = piece;
        this.squareElement = squareElement;
        this.pieceElement = pieceElement;
        this.circleElement = circleElement;
    }
}

class Game {
    constructor(FEN) {
        this.turn = Color.w;
        this.nbHalfMoveClock = 0;
        this.nbMoves = 1; // nbMoves = Number of Moves of Black + 1

        this.castling = {
            K: false,    // White can castle kingside
            Q: false,    // White can castle queenside
            k: false,    // Black can castle kingside
            q: false     // Black can castle queenside
        }

        this.enPassantSquare = null;

        this.board = new Array(8);
        for (let i = 0; i < 8; i++) {
            this.board[i] = new Array(8);
        }

        if (FEN) {
            // Custom position
            this.loadFenString(FEN);
        } else {
            // Default position
            this.loadFenString("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        }
    };

    // Methods
    squareToCoordinates(square)
    {
        let x = File[square[0]]         // File Letter
        let y = parseInt(square[1])-1   // Rank Number
        return [x,y];
    }

    coordinatesToSquare(x,y)
    {
        return FileSymbols[x] + (y+1).toString();
    }

    loadFenString(FEN)
    {
        let [ranks, activeColor, castling, enPassantSquare, halfMoveClock, fullMoveNumber] = FEN.split(' ');
        ranks = ranks.split('/');
        ranks = ranks.reverse()

        // Set Up Pieces
        for (let y = 0; y < 8; y++)
        {
            let rank = ranks[y];
            let file = 0;

            for (let j = 0; j < rank.length; j++)
            {
                let char = rank.charAt(j);
                if (isNaN(char)) {
                    this.board[file][y] = new Square(Pieces[char], null, null, null);
                    file++;
                } else {
                    file += parseInt(char);
                }
            }
        }

        for (let x = 0; x < 8; x++)
        {
            if (!this.board[x])
                this.board[x] = [];

            for (let y = 0; y < 8; y++)
            {
                if (!(this.board[x][y]))
                    this.board[x][y] = new Square(Pieces.empty, null, null, null);
            }
        }
        // console.log(this.board)

        // Set Up Color
        this.turn = Color[activeColor];

        // Castling
        for (let castleRight of castling) {
            this.castling[castleRight] = true;
        }

        // En Passant Square
        if (enPassantSquare != '-') {
            this.enPassantSquare = this.squareToCoordinates(enPassantSquare);
        }

        // Half Move Clock
        this.nbHalfMoveClock = parseInt(halfMoveClock);

        // Full Move Number
        this.nbMoves = parseInt(fullMoveNumber);
    }

    isInBoard(x,y)
    {
        return x >= 0 && x < 8 && y >= 0 && y < 8;
    }

    getPieceColor(piece)
    {
        if (piece == Pieces.empty)
            return null;
        return piece <= 6 ? Color.b : Color.w;
    }

    getMoves(x,y)
    {
        let square = this.board[x][y];
        let piece = square.piece;
        let moves = [];

        if (piece == Pieces.empty)
            return moves;
        
        let color = this.getPieceColor(piece);
        let direction = (color === Color.w ? 1 : -1);
        
        switch (piece) {
            case Pieces.empty:
                return moves;
            
            case Pieces.P:
            case Pieces.p:
                // Up 1
                if (this.isInBoard(x, y + direction) && this.board[x][y + direction].piece == Pieces.empty)
                    moves.push({x:x, y:y+direction})
                // Up 2
                if (y == (color == Color.w ? 1 : 6) && this.isInBoard(x, y + direction*2) && this.board[x][y + direction*2].piece == Pieces.empty)
                    moves.push({x:x, y:y+direction*2})
                break;
            
            
        }
    }

    // for debugging
    printBoard() {
        let boardString = "-----------------\n";
        for (let y = 7; y >= 0; y--)
        {
            boardString += '|';
            for (let x = 0; x < 8; x++)
            {
                boardString += PieceSymbols[this.board[x][y].piece] + "|";
            }
            boardString += '\n-----------------\n';
        }
        console.log(boardString);
    }
};

export {File, FileSymbols, Pieces, PieceSymbols, Color, Game};