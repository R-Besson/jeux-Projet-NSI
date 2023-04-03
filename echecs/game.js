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
            this.board[i] = new Array(8).fill(Pieces.empty);
        }

        if (FEN) {
            this.loadFenString(FEN);
        } else {
            this.loadFenString("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        }
    };

    // Methods
    squareToCoordinates(square) {
        let x = File[square[0]]         // File Letter
        let y = parseInt(square[1])-1   // Rank Number
        return [x,y];
    }
    coordinatesToSquare(x,y) {
        return FileSymbols[x] + (y+1).toString();
    }

    loadFenString(FEN) {
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
                    this.board[file][y] = Pieces[char];
                    file++;
                } else {
                    file += parseInt(char);
                }
            }
        }

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

    printBoard() {
        let boardString = "-----------------\n";
        for (let y = 7; y >= 0; y--)
        {
            boardString += '|';
            for (let x = 0; x < 8; x++)
            {
                boardString += PieceSymbols[this.board[x][y]] + "|";
            }
            boardString += '\n-----------------\n';
        }
        console.log(boardString);
    }
};

export {File, FileSymbols, Pieces, PieceSymbols, Color, Game};