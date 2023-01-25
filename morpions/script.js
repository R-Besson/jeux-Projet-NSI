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

var turn, board;

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
function changeState(x, y, squareSize, state)
{
    board[x][y].state = state

    let rect = board[x][y].htmlElement
    let symbol = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse')
    symbol.setAttribute("rx", parseInt(rect.getAttribute("width"))/2-10)
    symbol.setAttribute("ry", parseInt(rect.getAttribute("height"))/2-10)
    symbol.setAttribute("cx", parseInt(rect.getAttribute("x")) + squareSize/2)
    symbol.setAttribute("cy", parseInt(rect.getAttribute("y")) + squareSize/2)
    symbol.setAttribute("stroke", "#FFF")
    symbol.setAttribute("stroke-width", "6")
    symbol.setAttribute("fill", "none")
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
                changeState(x, y, zone.width, turn)
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