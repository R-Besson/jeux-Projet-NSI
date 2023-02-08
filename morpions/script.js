// ----------------------- GLOBAL VARIABLES -----------------------//

var gridSize = 3; // Taille (SxS) de la grille, par default: 3x3
var winCondition = 3; // by default 3 symbols to win

var isPlaying = true;
var turn, board;

var boardSvg = document.getElementById("board") // La <svg> grille


// Enum: Symboles disponibles
const States = {
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

// ----------------------- FUNCTIONS -----------------------//


// Effacer les contenus de la grille
function clearBoard()
{
    boardSvg.innerHTML = "";
}

// Ajouter le symbole a la grille et le dessiner
function changeSymbol(x, y, newState)
{
    board[x][y].state = newState

    let rect = board[x][y].htmlElement;
    let squareX = parseInt(rect.getAttribute("x")),
        squareY = parseInt(rect.getAttribute("y")),
        squareSize = parseInt(rect.getAttribute("width"))

    let symbol;
    // Si le symbole a ajouter est un O
    if (newState == States.O) {
        symbol = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse')

        let offset = squareSize/7
        symbol.setAttribute("rx", squareSize/2 - offset)
        symbol.setAttribute("ry", squareSize/2 - offset)
        symbol.setAttribute("cx", squareX + squareSize/2)
        symbol.setAttribute("cy", squareY + squareSize/2)
        symbol.setAttribute("stroke", "#FFF")
        symbol.setAttribute("stroke-width", offset/2)
        symbol.setAttribute("fill", "none")
    } else if (newState == States.X) {
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
function drawLine(startElement, endElement)
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
function inBoard(x,y)
{
    return x >= 0 && y >= 0 && x < gridSize && y < gridSize
}

// Pour determiner si la souris est dans la zone de la boîte
function mouseIn(x,y,w,h, mouseX,mouseY)
{
    return mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h;
}

// Pour determiner si il y a une ligne dans les 4 orientations
function findWinnerLine(x, y, symbol)
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

// ----------------------- OP Mode FUNCTIONS -----------------------//

// Initializer le morpion et dessiner les cases
function initBoard()
{
    clearBoard()

    // Initialiser variables par défaut
    turn = States.X;
    isPlaying = true

    // Allouer la liste 2-Dimensionnelle
    board = new Array(gridSize)
    for (let i = 0; i < gridSize; i++)
        board[i] = new Array(gridSize).fill(States.Empty);

    // On veut un carré donc : height = width
    boardSvg.style.height = boardSvg.clientWidth + "px";
    let squareSize = boardSvg.clientWidth / gridSize;
    
    for (let x = 0; x < gridSize; x++)
    {
        for (let y = 0; y < gridSize; y++)
        {
            let square = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

            square.setAttribute('x', x*squareSize);
            square.setAttribute('y', y*squareSize);
            square.setAttribute('height', squareSize);
            square.setAttribute('width', squareSize);
            square.setAttribute('fill', "none")
            square.setAttribute('stroke','white');
            square.setAttribute('stroke-width', 1)

            boardSvg.appendChild(square);
            board[x][y] = new Case(States.Empty, square);
        }
    }
}

// ----------------------- EVENTS -----------------------//
let winnerText = document.getElementById("winner")


document.body.addEventListener('click', function(event) {
    // Si le jeu n'est pas en cours on return
    if (!isPlaying)
        return

    // Si le clic ne s'est pas produit dans le tableau <svg>
    // nous quittons (pour pas rentrer dans la coûteuse boucle for)
    let zone = boardSvg.getBoundingClientRect()
    if (!mouseIn(zone.x, zone.y, zone.width, zone.height, event.clientX, event.clientY))
        return

        
    let played = false
    for (let x = 0; x < gridSize; x++)
    {
        for (let y = 0; y < gridSize; y++)
        {
            // Zone pour le clique du Carré
            console.log(board)
            zone = board[x][y].htmlElement.getBoundingClientRect()
            if (board[x][y].state == States.Empty && mouseIn(zone.x, zone.y, zone.width, zone.height, event.clientX, event.clientY)) {
                changeSymbol(x, y, turn)
                
                let line = findWinnerLine(x, y, turn)
                if (line)
                {
                    // Win condition = ligne formée
                    drawLine(line[0].htmlElement, line[1].htmlElement)
                    isPlaying = false // Jeu pas en cours
                    winnerText.innerHTML = turn == States.O ? "Player O  " : "Player X  ";
                }

                played = true; break // Le joueur a joué
            }
        }
    }

    if (played) turn = (turn == States.X) ? States.O : States.X // Changement de tour
});

// Bouttons de mode de jeu + reset game
var playerVsPlayer = document.getElementById("pp") 
var playerVsComputer = document.getElementById("pc")

// Mode de jeu (joueur contre joueur)
playerVsPlayer.addEventListener("click", (event) => {
    console.log("pp")
    initBoard()
})

// Mode de jeu (joueur contre ordinateur (A FAIRE))
playerVsComputer.addEventListener("click", (event) => {
    console.log("pc")
    initBoard()
})


// CSS Related // what is this ?
let gridSizeOutput = document.getElementById("gridSize")
document.getElementById("gridController").oninput = function() {
    gridSize = this.value
    gridSizeOutput.innerHTML = this.value + "x" + this.value;
}
let winConditionOutput = document.getElementById("winCondition")
document.getElementById("winController").oninput = function() {
    winCondition = this.value
    winConditionOutput.innerHTML = this.value;
}

// ----------------------- APPLY -----------------------//

initBoard()