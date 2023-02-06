const States = {
    Empty: 0,
    X: 1,
    O: -1
}


class Case {
    constructor(state, element)
    {
        this.state = state
        this.htmlElement = element
    }
}


var boardSvg = document.getElementById("board")
var playerVsPlayer = document.getElementById("pp")
var playerVsComputer = document.getElementById("pc")
var hey = document.getElementById("popup")

var turn, board;
var winner = "none";

// Initializer les cases du morpions
function initBoard()
{
    turn = States.X;
    board = [[0,0,0],[0,0,0],[0,0,0]];

    boardSvg.innerHTML = "";
    boardSvg.style.height = boardSvg.clientWidth + "px";
    let squareSize = boardSvg.clientWidth / 3;
    for (let x = 0; x < 3; x++)
    {
        for (let y = 0; y < 3; y++)
        {
            let rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

            rect.setAttribute('x', x*squareSize);
            rect.setAttribute('y', y*squareSize);
            rect.setAttribute('height', squareSize);
            rect.setAttribute('width', squareSize);
            rect.setAttribute('fill', "none")
            rect.setAttribute('stroke','white');
            rect.setAttribute('stroke-width',"5px")

            boardSvg.appendChild(rect);
            board[x][y] = new Case(States.Empty, rect);
        }
    }
}
initBoard()

// Add Symbol to Board (move)
function changeState(x, y, state)
{
    board[x][y].state = state

    let rect = board[x][y].htmlElement
    
    let symbol = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse')
    symbol.setAttribute("rx", 40.5)
    symbol.setAttribute("ry", 40.5)
    symbol.setAttribute("cy", rect.getAttribute("x") + 50)
    symbol.setAttribute("cx", rect.getAttribute("y") + 50)
    console.log(symbol)
    boardSvg.appendChild(symbol)
}

// Mouse In Box Region
function mouseIn(x,y,w,h, mouseX,mouseY)
{
    return mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h;
}

// Events
document.body.addEventListener('click', (event) => {
    console.log(event.clientX, event.clientY)
    for (let x = 0; x < 3; x++)
    {
        for (let y = 0; y < 3; y++)
        {
            let zone = board[x][y].htmlElement.getBoundingClientRect()
            if (board[x][y].state == States.Empty && mouseIn(zone.x, zone.y, zone.width, zone.height, event.clientX, event.clientY)) {
                changeState(x, y, turn)
                console.log(x,y,turn)
            }
        }
    }

    turn = (turn == States.X) ? States.O : States.X
});

playerVsPlayer.addEventListener("click", (event) => {
    console.log("pp")
    initBoard()
})
playerVsComputer.addEventListener("click", (event) => {
    console.log("pc")
    initBoard()
})


// function click(){
//     rect.addEventListener('click', function(event) {
//         console.log(x, y)
//     });
// }

// while (IsPlaying) {
//     // click()
// }


// function click(){
//     rect.addEventListener('click', function(event) {
//         console.log(x, y)
//     });
// }
function winner_check(value){
    if (value == 3){
        winner = "player 1";
        IsPlaying = false;
    }
    else if (value == -3){
        winner = "player 2";
        IsPlaying = false;
    }
}


function win_condition() {
    for (let x = 0; x < 3; x++)
    {
        x_values += cases[x];
        for (let y = 0; y < 3; y++)
        {
            y_values += cases[x,y];
        }
        winner_check(y_values);
        y_values = 0;
       
        }  
        winner_check(x_values);
        x_values = 0;

        x_values = cases[1,1] + cases[2,2] + cases[3,3]
        winner_check(x_values);
        x_values = 0;

        x_values = cases[3,1] + cases[2,2] + cases[1,3]
        winner_check(x_values);
        x_values = 0;
        
}

// while (IsPlaying) {
//     // click()
// }