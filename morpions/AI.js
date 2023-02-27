class AI {
    constructor(board, gridSize, states) {
        this.board = board;
        this.gridSize = gridSize;
        this.states = states;
    }

    canWin() {
        for (let x = 0; x < this.gridSize; x++) {
            for (let y = 0; y < this.gridSize; y++) {
                if (this.board[x][y].state == states.empty)
                {
                    
                }
            }
        }
    }

    reactV1() {
        
    }
};

export {AI};