import {AI} from "./AI.js";
import {states, Case, Game} from "./game.js";

// ----------------------- GLOBAL VARIABLES -----------------------//
var gridSize = 3; // Taille (SxS) de la grille, par default: 3x3
var winCondition = 3; // by default 3 symbols to win

var boardSvg = document.getElementById("board") // La <svg> grille
var winnerText = document.getElementById("winner");

var game = new Game(gridSize, winCondition, boardSvg, winnerText);

var isAI =false;


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


function play(event)
{
    // Si le jeu n'est pas en cours on return
    if (!game.isPlaying)
        return

    // Si le clic ne s'est pas produit dans le tableau <svg>
    // nous quittons (pour pas rentrer dans la coûteuse boucle for)
    let zone = boardSvg.getBoundingClientRect()
    if (!game.mouseIn(zone.x, zone.y, zone.width, zone.height, event.clientX, event.clientY))
        return
    
        
    for (let x = 0; x < gridSize; x++)
    {
        for (let y = 0; y < gridSize; y++)
        {
            // Zone pour le clique du Carré
            zone = game.board[x][y].htmlElement.getBoundingClientRect()
            if (game.board[x][y].state == states.Empty && game.mouseIn(zone.x, zone.y, zone.width, zone.height, event.clientX, event.clientY)) {
                game.changeSymbol(x, y, game.turn)
                
                let line = game.findWinnerLine(x, y, game.turn)
                if (line)
                {
                    // Win condition = ligne formée
                    game.drawLine(line[0].htmlElement, line[1].htmlElement)
                    game.isPlaying = false; // Jeu pas en cours
                    winnerText.innerHTML = game.turn == states.O ? "Player O  " : "Player X  ";
                }

                game.turn = (game.turn == states.X) ? states.O : states.X; // Changement de tour
            }
        }

    }
    if (isAI && game.turn == states.O) {
        let ai = new AI(game);
        console.log(ai.canWin());
    }
    
    
}

function gameModes()
{
    // Bouttons de mode de jeu + reset game
    var playerVsPlayer = document.getElementById("pp");
    var playerVsComputer = document.getElementById("pc");
    
    // Mode de jeu (joueur contre joueur)
    playerVsPlayer.addEventListener("click", function(event) {
        console.log("pp");
        isAI = false;
        game.clearBoard();
        game = new Game(gridSize, winCondition, boardSvg, winnerText);
    });
    
    // Mode de jeu (joueur contre ordinateur (A FAIRE))
    playerVsComputer.addEventListener("click", function(event) {
        console.log("pc");
        isAI = true;
        game.clearBoard();
        game = new Game(gridSize, winCondition, boardSvg, winnerText);
    });
}
    

// ----------------------- APPLY -----------------------//
sliders();
document.body.addEventListener('click', play);
gameModes();