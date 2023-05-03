
// Enum: Symboles disponibles
const states = {
    Empty: 0,
    X: 1,
    O: -1
};

const dirsX4 = [1,0,1, 1];
const dirsY4 = [0,1,1,-1];

const dirsX8 = [1,0,1, 1,-1,-1, 0,-1];
const dirsY8 = [0,1,1,-1, 1,-1,-1, 0];

// Classe 'Case' qui contient le symbole de la case et l'élément <svg> associé
class Case {
    constructor(state, element)
    {
        this.state = state;
        this.htmlElement = element;
    }
}

class Game {
    constructor(gridSize, winCondition, svg, winnerText)
    {
        this.gridSize = gridSize;
        this.winCondition = winCondition;
        this.svg = svg;
        this.winnerText = winnerText;
        this.turn = states.X;
        this.aiTurn = this.randomiseSymbol();

        this.clearBoard();
        this.winnerText.innerHTML = "Personne n'";

        // Initialiser variables par défaut
        this.isPlaying = true;
        this.isThinking = false;

        this.resizeBoard();
        
        // On veut un carré donc : height = width 
        let size = Math.min(this.svg.style.width, this.svg.style.height);
        // this.svg.style.width = size + "px";
        // this.svg.style.height = size + "px";
    
        let squareSize = Math.floor(this.svg.clientWidth / this.gridSize);

        let background = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        background.setAttribute('x', 0);
        background.setAttribute('y', 0);
        background.setAttribute('width', squareSize*this.gridSize);
        background.setAttribute('height', squareSize*this.gridSize);
        background.setAttribute('fill', "black")
        this.svg.appendChild(background);
        
        for (let x = 0; x < this.gridSize; x++)
        {
            for (let y = 0; y < this.gridSize; y++)
            {
                let square = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

                square.setAttribute('x', x*squareSize);
                square.setAttribute('y', y*squareSize);
                square.setAttribute('height', squareSize);
                square.setAttribute('width', squareSize);
                square.setAttribute('fill', "none")
                square.setAttribute('stroke','white');
                square.setAttribute('stroke-width', 1);
                // square.setAttribute('stroke-location', 'inside')

                this.svg.appendChild(square);
                this.board[x][y] = new Case(states.Empty, square);
            }
        }
    }

    resizeBoard() {
        this.board = new Array(this.gridSize)
        for (let i = 0; i < this.gridSize; i++) {
            this.board[i] = new Array(this.gridSize).fill(states.Empty);
        }
    }

    // ----------------------- FUNCTIONS -----------------------//
    // Effacer les contenus de la grille
    clearBoard()
    {
        this.svg.innerHTML = "";
    }

    getOppositeSymbol(symbol)
    {
        return symbol == states.X ? states.O : states.X;
    }

    randomiseSymbol()
    {
        return Math.round(Math.random(1,2)) == 1.0 ? states.X : states.O;
    }

    // Ajouter le symbole a la grille et le dessiner
    changeSymbol(x, y, newState)
    {
        this.board[x][y].state = newState;

        let rect = this.board[x][y].htmlElement;
        let squareX = parseInt(rect.getAttribute("x")),
            squareY = parseInt(rect.getAttribute("y")),
            squareSize = parseInt(rect.getAttribute("width"));

        let symbol;
        // Si le symbole a ajouter est un O
        if (newState == states.O) {
            symbol = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse')

            let offset = squareSize/7;
            symbol.setAttribute("rx", squareSize/2 - offset);
            symbol.setAttribute("ry", squareSize/2 - offset);
            symbol.setAttribute("cx", squareX + squareSize/2);
            symbol.setAttribute("cy", squareY + squareSize/2);
            symbol.setAttribute("stroke", "#FFF");
            symbol.setAttribute("stroke-width", offset/2);
            symbol.setAttribute("fill", "none");
        } else if (newState == states.X) {
            symbol = document.createElementNS("http://www.w3.org/2000/svg", 'path');

            let offset = squareSize/7;
            symbol.setAttribute("stroke", "#FFF");
            symbol.setAttribute("stroke-width", offset/2);
            symbol.setAttribute("stroke-linecap", "square");

            symbol.setAttribute("d", `M ${squareX+offset},${squareY+offset} ${squareX+squareSize-offset},${squareY+squareSize-offset}` +
                                    ` M ${squareX+offset},${squareY+squareSize-offset} ${squareX+squareSize-offset},${squareY+offset}`);
        } else {
            return;
        }
        this.svg.appendChild(symbol);
    }

    isDraw(){
        Symbol = 0;
        for (let x=0; x<this.gridSize; x++){
            for (let y=0; y<this.gridSize; y++){
            if (this.board[x][y].state == states.Empty){Symbol ++}
        }}
        if (Symbol == 0){
            return true;
        }
        else {
            return false;
        }
    }

    // Dessiner la ligne (rouge) du gagnant
    drawLine(startElement, endElement)
    {
        let startX = parseInt(startElement.getAttribute("x")),
            startY = parseInt(startElement.getAttribute("y"));

        let endX = parseInt(endElement.getAttribute("x")),
            endY = parseInt(endElement.getAttribute("y"));
        
        let squareSize = parseInt(startElement.getAttribute("width"));

        // Ligne element
        let line = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        line.setAttribute("stroke", "#FF0000");
        line.setAttribute("stroke-width", squareSize/7);
        line.setAttribute("stroke-linecap", "square");
        line.setAttribute("opacity", "0.9");
        line.setAttribute("d", `M ${startX+squareSize/2},${startY+squareSize/2} ${endX+squareSize/2},${endY+squareSize/2}`);
        this.svg.appendChild(line);
    }

    // Pour determiner si (x,y) est une case valide de la grille
    inBoard(x,y)
    {
        return x >= 0 && y >= 0 && x < this.gridSize && y < this.gridSize;
    }

    // Pour determiner si la souris est dans la zone de la boîte
    mouseIn(x,y,w,h, mouseX,mouseY)
    {
        return mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h;
    }

    // Pour determiner si il y a une ligne dans les 4 orientations
    findWinnerLine(x, y, symbol)
    {
        // Directions: Verticale, Horizontale, Diagonales
        for (let i = 0; i < 4; i++)
        {
            let dx = dirsX4[i];
            let dy = dirsY4[i];
            
            // Combien de symboles sont devant et dèrriere the (x,y) square dans chaque orientation
            // 'back' and 'front' => extrémités de la ligne finale
            let backward = 0, back = this.board[x][y];
            let forward = 0, front = this.board[x][y];

            // Loop for qui regarde dèrriere, tant que pas d'intersection avec un symbol d'un autre type
            for (let step = 1; step <= this.winCondition; step++)
            {
                let newX = x-step*dx,
                    newY = y-step*dy;
                if (this.inBoard(newX, newY) && this.board[newX][newY].state == symbol) {
                    // Symbole de meme type sur la direction actuel
                    backward++;
                    back = this.board[newX][newY]; // Update l'éxtremité
                } else {
                    break; // Symbole different rencontré donc ce n'est pas une ligne continue
                }
            }
            // Loop for qui regarde devant, tant que pas d'intersection avec un symbol d'un autre type
            for (let step = 1; step <= this.winCondition; step++)
            {
                let newX = x+step*dx,
                    newY = y+step*dy;
                if (this.inBoard(newX, newY) && this.board[newX][newY].state == symbol) {
                    // Symbole de meme type sur la direction actuel
                    forward++;
                    front = this.board[newX][newY]; // Update l'éxtremité
                } else {
                    break; // Symbole different rencontré donc ce n'est pas une ligne continue
                }
            }



            // S'il y a au moins le nombre de symboles nécessaires pour gagner, c'est une victoire
            // Le "1" vient du carré en (x,y) qui n'est pas compté
            if (backward + forward + 1 >= this.winCondition)
                return [back,front];
        }

        // Pas de ligne
        return null;
    }


}

export {states, dirsX4, dirsY4, dirsX8, dirsY8, Case, Game};