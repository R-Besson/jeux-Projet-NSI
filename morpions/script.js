import {AI} from "./AI.js";
import {states, Case, Game} from "./game.js";

// ----------------------- GLOBAL VARIABLES -----------------------//
var gridSize = 3; // Taille (SxS) de la grille, par default: 3x3
var winCondition = 3; // by default 3 symbols to win

var boardSvg = document.getElementById("board") // La <svg> grille
var winnerText = document.getElementById("winner");

var game = new Game(gridSize, winCondition, boardSvg, winnerText);

var mode = "pvp";
var isThinking = false;

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

function isAI()
{
    return mode == "pvc" || mode == "cvc";
}

function AIDoMove()
{
    isThinking = true;
    setTimeout(() => {
        let ai = new AI(game);
        let move = ai.getMove();

        if (!move) {
            console.log("AI couldn't find good move");
            return;
        }

        console.log(move);
        game.changeSymbol(move[0], move[1], game.turn);

        let line = game.findWinnerLine(move[0], move[1], game.turn);
        if (line)
        {
            // Win condition = ligne formée
            game.drawLine(line[0].htmlElement, line[1].htmlElement);
            game.isPlaying = false; // Jeu pas en cours
            winnerText.innerHTML = game.turn == states.X ? "Player X  " : "Player O  ";
        }

        // Changement de tour
        game.turn = game.getOppositeSymbol(game.turn);

        isThinking = false;

        if (mode == "cvc") {
            play();
        }
    }, Math.random()*300+200);
}

function play(event)
{
    // Si le jeu n'est pas en cours on return
    if (!game.isPlaying)
        return;
        
    // Human(s) turn to play
    if (!isAI() || (mode == "pvc" && game.turn == states.X && !isThinking)) {
        // Si le clic ne s'est pas produit dans le tableau <svg>
        // nous quittons (pour pas rentrer dans la coûteuse boucle for)
        let zone = boardSvg.getBoundingClientRect()
        if (!game.mouseIn(zone.x, zone.y, zone.width, zone.height, event.clientX, event.clientY))
            return;

        for (let x = 0; x < gridSize; x++)
        {
            for (let y = 0; y < gridSize; y++)
            {
                // Zone pour le clique du Carré
                zone = game.board[x][y].htmlElement.getBoundingClientRect()
                if (game.board[x][y].state == states.Empty && game.mouseIn(zone.x, zone.y, zone.width, zone.height, event.clientX, event.clientY)) {
                    game.changeSymbol(x, y, game.turn)
                    
                    let line = game.findWinnerLine(x, y, game.turn);
                    if (line)
                    {
                        // Win condition = ligne formée
                        game.drawLine(line[0].htmlElement, line[1].htmlElement);
                        game.isPlaying = false; // Jeu pas en cours
                        winnerText.innerHTML = game.turn == states.X ? "Player X  " : "Player O  ";
                    }

                    // Changement de tour
                    game.turn = game.getOppositeSymbol(game.turn);
                }
            }
        }
    }

    // AI 1's turn to play
    if (isAI() && !isThinking && game.isPlaying) {
        AIDoMove();
    }
}

function gameModes()
{
    // Bouttons de mode de jeu + reset game
    var playerVsPlayer = document.getElementById("pvp");
    var playerVsComputer = document.getElementById("pvc");
    var computerVsComputer = document.getElementById("cvc");
    
    // Mode de jeu (joueur contre joueur)
    playerVsPlayer.addEventListener("click", function(event) {
        mode = "pvp";
        game.clearBoard();
        game = new Game(gridSize, winCondition, boardSvg, winnerText);
    });
    
    // Mode de jeu (joueur contre ordinateur (A FAIRE))
    playerVsComputer.addEventListener("click", function(event) {
        mode = "pvc";
        game.clearBoard();
        game = new Game(gridSize, winCondition, boardSvg, winnerText);
    });

    // Mode de jeu (joueur contre ordinateur (A FAIRE))
    computerVsComputer.addEventListener("click", function(event) {
        mode = "cvc";
        game.clearBoard();
        game = new Game(gridSize, winCondition, boardSvg, winnerText);
        play();
    });
}
    

// ----------------------- APPLY -----------------------//
sliders();
document.body.addEventListener('click', play);
gameModes();