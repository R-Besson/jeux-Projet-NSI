import {states} from "./game.js";

class AI {
    constructor(game) {
        this.game = game;
    }

    canWin() {
        for (let x = 0; x < this.game.gridSize; x++) {
            for (let y = 0; y < this.game.gridSize; y++) {
                if (this.game.board[x][y].state == states.Empty)
                {
                    this.game.board[x][y].state = this.turn;
                    
                    if (this.game.findWinnerLine(x,y,this.turn)) {
                        this.game.board[x][y].state = states.Empty;
                        console.log(x,y);
                        return true;
                    }

                    this.game.board[x][y].state = states.Empty;
                }
            }
        }

        return false;
    }
};

export {AI};