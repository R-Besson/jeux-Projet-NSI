var board = document.getElementById("board")
var playerVsPlayer = document.getElementById("pp")
var playerVsComputer = document.getElementById("pc")
var IsPlaying = false;
const States = {
    Empty: 0,
    P1: 1,
    P2: -1
}
var x_values = 0;
var y_values = 0;

var cases = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
];

// Initializer les cases du morpions
function initBoard()
{
    board.style.height = board.clientWidth + "px";
    let squareSize = board.clientWidth / 3;
    for (let x = 0; x < 3; x++)
    {
        for (let y = 0; y < 3; y++)
        {
            var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');

            rect.setAttribute('x', x*squareSize);
            rect.setAttribute('y', y*squareSize);
            rect.setAttribute('height', squareSize);
            rect.setAttribute('width', squareSize);
            rect.setAttribute('fill', "none")
            rect.setAttribute('stroke','white');
            rect.setAttribute('stroke-width',"5px")

            board.appendChild(rect);
            IsPlaying = true;
        }
    }
}
initBoard()

function mouseIn(x,y,w,h, mouseX,mouseY)
{
    
}
document.body.addEventListener('click', function(event) {
    for (let x = 0; x < 3; x++)
    {
        for (let y = 0; y < 3; y++)
        {
            if (mouseIn()) {
                console.log('clicked inside');
            }
        }
    }
});




// function click(){
//     rect.addEventListener('click', function(event) {
//         console.log(x, y)
//     });
// }

function win_condition() {
    for (let x = 0; x < 3; x++)
    {
        x_values += cases[x];
        for (let y = 0; y < 3; y++)
        {
            y_values += cases[y];
        }
    }  
}

// while (IsPlaying) {
//     // click()
// }


// function click(){
//     rect.addEventListener('click', function(event) {
//         console.log(x, y)
//     });
// }

function win_condition() {
    for (let x = 0; x < 3; x++)
    {
        x_values += cases[x];
        for (let y = 0; y < 3; y++)
        {
            y_values += cases[y];
        }
    }  
}

// while (IsPlaying) {
//     // click()
// }