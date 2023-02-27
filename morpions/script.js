import {AI} from "./AI.js";
import {Game} from "./game.js";

// ----------------------- GLOBAL VARIABLES -----------------------//

var gridSize = 3; // Taille (SxS) de la grille, par default: 3x3
var winCondition = 3; // by default 3 symbols to win

var isPlaying = true;
var turn, board;

var boardSvg = document.getElementById("board") // La <svg> grille
let winnerText = document.getElementById("winner");


// ----------------------- OP Mode FUNCTIONS -----------------------//

// CSS Related
function sliders()
{
    let gridSizeOutput = document.getElementById("gridSize")
    document.getElementById("gridController").oninput = function() {
        gridSize = this.value;
        gridSizeOutput.innerHTML = this.value + "x" + this.value;
    }

    let winConditionOutput = document.getElementById("winCondition")
    document.getElementById("winController").oninput = function() {
        winCondition = this.value;
        winConditionOutput.innerHTML = this.value;
    }
}

// Initializer le morpion et dessiner les cases
function initBoard()
{
    Game.clearBoard()
    winnerText.innerHTML = "Personne n'";

    // Initialiser variables par défaut
    turn = states.X;
    isPlaying = true

    // Allouer la liste 2-Dimensionnelle
    board = new Array(gridSize)
    for (let i = 0; i < gridSize; i++)
        board[i] = new Array(gridSize).fill(states.Empty);

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
            board[x][y] = new Case(states.Empty, square);
        }
    }
}

function play(event)
{
    // Si le jeu n'est pas en cours on return
    if (!isPlaying)
        return

    // Si le clic ne s'est pas produit dans le tableau <svg>
    // nous quittons (pour pas rentrer dans la coûteuse boucle for)
    let zone = boardSvg.getBoundingClientRect()
    if (!mouseIn(zone.x, zone.y, zone.width, zone.height, event.clientX, event.clientY))
        return

        
    for (let x = 0; x < gridSize; x++)
    {
        for (let y = 0; y < gridSize; y++)
        {
            // Zone pour le clique du Carré
            zone = board[x][y].htmlElement.getBoundingClientRect()
            if (board[x][y].state == states.Empty && game.mouseIn(zone.x, zone.y, zone.width, zone.height, event.clientX, event.clientY)) {
                changeSymbol(x, y, turn)
                
                let line = findWinnerLine(x, y, turn)
                if (line)
                {
                    // Win condition = ligne formée
                    drawLine(line[0].htmlElement, line[1].htmlElement)
                    isPlaying = false; // Jeu pas en cours
                    winnerText.innerHTML = turn == states.O ? "Player O  " : "Player X  ";
                }

                break; // Le joueur a joué
            }
        }
    }

    turn = (turn == states.X) ? states.O : states.X; // Changement de tour
}

function gameModes()
{
    // Bouttons de mode de jeu + reset game
    var playerVsPlayer = document.getElementById("pp");
    var playerVsComputer = document.getElementById("pc");
    
    // Mode de jeu (joueur contre joueur)
    playerVsPlayer.addEventListener("click", function(event) {
        console.log("pp");
        initBoard();
    });
    
    // Mode de jeu (joueur contre ordinateur (A FAIRE))
    playerVsComputer.addEventListener("click", function(event) {
        console.log("pc");
        initBoard();
    });
}
    

// ----------------------- APPLY -----------------------//
sliders();
initBoard();
document.body.addEventListener('click', play);
gameModes();