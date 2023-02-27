// Enum: Symboles disponibles
const states = {
    Empty: 0,
    X: 1,
    O: -1
}

// Classe 'Case' qui contient le symbole de la case et l'élément <svg> associé
class Case {
    constructor(state, element)
    {
        this.state = state
        this.htmlElement = element
    }
}

class Game {
    constructor(){}

    // ----------------------- FUNCTIONS -----------------------//
    // Effacer les contenus de la grille
    clearBoard()
    {
        boardSvg.innerHTML = "";
    }

    // Ajouter le symbole a la grille et le dessiner
    changeSymbol(x, y, newState)
    {
        board[x][y].state = newState

        let rect = board[x][y].htmlElement;
        let squareX = parseInt(rect.getAttribute("x")),
            squareY = parseInt(rect.getAttribute("y")),
            squareSize = parseInt(rect.getAttribute("width"))

        let symbol;
        // Si le symbole a ajouter est un O
        if (newState == states.O) {
            symbol = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse')

            let offset = squareSize/7
            symbol.setAttribute("rx", squareSize/2 - offset)
            symbol.setAttribute("ry", squareSize/2 - offset)
            symbol.setAttribute("cx", squareX + squareSize/2)
            symbol.setAttribute("cy", squareY + squareSize/2)
            symbol.setAttribute("stroke", "#FFF")
            symbol.setAttribute("stroke-width", offset/2)
            symbol.setAttribute("fill", "none")
        } else if (newState == states.X) {
            symbol = document.createElementNS("http://www.w3.org/2000/svg", 'path')

            let offset = squareSize/7
            symbol.setAttribute("stroke", "#FFF")
            symbol.setAttribute("stroke-width", offset/2)
            symbol.setAttribute("stroke-linecap", "square")

            symbol.setAttribute("d", `M ${squareX+offset},${squareY+offset} ${squareX+squareSize-offset},${squareY+squareSize-offset}` +
                                    ` M ${squareX+offset},${squareY+squareSize-offset} ${squareX+squareSize-offset},${squareY+offset}`)
        } else {
            return;
        }
        boardSvg.appendChild(symbol)
    }


    // Dessiner la ligne (rouge) du gagnant
    drawLine(startElement, endElement)
    {
        let startX = parseInt(startElement.getAttribute("x")),
            startY = parseInt(startElement.getAttribute("y"))

        let endX = parseInt(endElement.getAttribute("x")),
            endY = parseInt(endElement.getAttribute("y"))
        
        let squareSize = parseInt(startElement.getAttribute("width"))

        // Ligne element
        let line = document.createElementNS("http://www.w3.org/2000/svg", 'path')
        line.setAttribute("stroke", "#FF0000")
        line.setAttribute("stroke-width", squareSize/7)
        line.setAttribute("stroke-linecap", "square")
        line.setAttribute("opacity", "0.9")
        line.setAttribute("d", `M ${startX+squareSize/2},${startY+squareSize/2} ${endX+squareSize/2},${endY+squareSize/2}`)
        boardSvg.appendChild(line)
    }

    // Pour determiner si (x,y) est une case valide de la grille
    inBoard(x,y)
    {
        return x >= 0 && y >= 0 && x < gridSize && y < gridSize
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
        let dirsX = [1,0,1,1]
        let dirsY = [0,1,1,-1]

        for (let i = 0; i < 4; i++)
        {
            let dx = dirsX[i]
            let dy = dirsY[i]
            
            // Combien de symboles sont devant et dèrriere the (x,y) square dans chaque orientation
            // 'back' and 'front' => extrémités de la ligne finale
            let backward = 0, back = board[x][y]
            let forward = 0, front = board[x][y]

            // Loop for qui regarde dèrriere, tant que pas d'intersection avec un symbol d'un autre type
            for (let step = 1; step <= winCondition; step++)
            {
                let newX = x-step*dx,
                    newY = y-step*dy
                if (inBoard(newX, newY) && board[newX][newY].state == symbol) {
                    // Symbole de meme type sur la direction actuel
                    backward++
                    back = board[newX][newY] // Update l'éxtremité
                } else {
                    break // Symbole different rencontré donc ce n'est pas une ligne continue
                }
            }
            // Loop for qui regarde devant, tant que pas d'intersection avec un symbol d'un autre type
            for (let step = 1; step <= winCondition; step++)
            {
                let newX = x+step*dx,
                    newY = y+step*dy
                if (inBoard(newX, newY) && board[newX][newY].state == symbol) {
                    // Symbole de meme type sur la direction actuel
                    forward++
                    front = board[newX][newY] // Update l'éxtremité
                } else {
                    break // Symbole different rencontré donc ce n'est pas une ligne continue
                }
            }

            // S'il y a au moins le nombre de symboles nécessaires pour gagner, c'est une victoire
            // Le "1" vient du carré en (x,y) qui n'est pas compté
            if (backward + forward + 1 >= winCondition)
                return [back,front]
        }

        // Pas de ligne
        return null
    }
}

export {states, Case};