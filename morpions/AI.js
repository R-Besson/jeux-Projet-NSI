import {states, dirsX8, dirsY8} from "./game.js";

class AI {
    constructor(game) {
        this.game = game;
    }

    getNeighborCounts(x,y,symbol) {
        // Number of neighboring squares that has the same symbol as AI
        let newFriendlyCount = 0;
        // Number of neighboring squares that has the oppositite symbol as AI
        let newEnemyCount = 0;

        for (let i = 0; i < 8; i++)
        {
            let dx = dirsX8[i];
            let dy = dirsY8[i];

            // Neighbor 1
            if (!this.game.inBoard(x+dx, y+dy))
                continue;
            
            let oppositeSymbol = this.game.getOppositeSymbol(symbol);
            if (this.game.board[x+dx][y+dy].state == oppositeSymbol) {
                newEnemyCount++;
            } else if(this.game.board[x+dx][y+dy].state == symbol) {
                newFriendlyCount++;
            }
        }

        return {newFriendlyCount, newEnemyCount};
    }

    getMove() {
        // Number of neighboring squares that has the same symbol as AI
        // we want to maximize this
        let friendlyCount = -Infinity;
        // Number of neighboring squares that has the oppositite symbol as AI
        // we want to minimize this
        let enemyCount = -Infinity;

        let bestMove = null;

        for (let x = 0; x < this.game.gridSize; x++) {
            for (let y = 0; y < this.game.gridSize; y++) {
                if (this.game.board[x][y].state == states.Empty)
                {
                    // Check if AI can win
                    this.game.board[x][y].state = this.game.turn;
                    if (this.game.findWinnerLine(x,y,this.game.turn)) {
                        // AI can WIN ! so we directly place symbol in this square
                        this.game.board[x][y].state = states.Empty;
                        return [x,y];
                    }
                    this.game.board[x][y].state = states.Empty;

                    // Check if player can win on next move (opposite symbol)
                    let oppositeSymbol = this.game.getOppositeSymbol(this.game.turn);
                    this.game.board[x][y].state = oppositeSymbol;
                    if (this.game.findWinnerLine(x,y,oppositeSymbol)) {
                        // Opposite player can win by placing symbol at x,y
                        // AI needs to prevent this
                        this.game.board[x][y].state = states.Empty;
                        return [x,y];
                    }
                    this.game.board[x][y].state = states.Empty;

                    // If neither player (human or AI) can win on next move ...
                    // we find next best move
                    let {newFriendlyCount, newEnemyCount} = this.getNeighborCounts(x,y,this.game.turn);

                    if (newFriendlyCount > friendlyCount) {
                        bestMove = [x,y];
                        friendlyCount = newFriendlyCount;
                        enemyCount = newEnemyCount;
                    }
                    if (newFriendlyCount != friendlyCount)
                        continue;
                    
                    if (newEnemyCount > enemyCount) {
                        bestMove = [x,y];
                        friendlyCount = newFriendlyCount;
                        enemyCount = newEnemyCount;
                    }
                    if (newEnemyCount != enemyCount)
                        continue;
                }
            }
        }

        return bestMove;
    }
};

export {AI};