// HTML ITEMS
let canvas = document.getElementById("canvas");
let score = document.getElementById("score");
let highscore = document.getElementById("highscore");
let ctx = canvas.getContext("2d");

// own coordinate system
let rows = 15;
let cols = 15;
let cellWidth = canvas.width / cols;
let cellHeight = canvas.height / rows;

// Objects
let snake = [
    { x: 1, y: 1 }
];
let apple = { x: 5, y: 5 };
let direction = "STOP";
let appleCollected = false;
let counter = 0;
let highCount = 0;


// GAME START
setInterval(gameLoop, 1000/8);
document.addEventListener("keydown", keyPress);
draw();
placeSnake();
placeApple();


function draw() {
    // Background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Snake
    ctx.fillStyle = "green";
    add(snake[0].x, snake[0].y);
    ctx.fillStyle = "white";
    snake.slice(1).forEach(part => add(part.x, part.y));

    // Apple
    ctx.fillStyle = "red";
    add(apple.x, apple.y);

    requestAnimationFrame(draw);
}

function placeSnake() {
    const randX = Math.floor(Math.random() * cols);
    const randY = Math.floor(Math.random() * rows);

    snake = [
        { x: randX, y: randY }
    ];
}

function placeApple() {
    let randX = Math.floor(Math.random() * cols);
    let randY = Math.floor(Math.random() * rows);

    let found = false;
    let isInContact = (x, y) => x == randX && y == randY;

    while(!found) {
        const check = snake.every(isInContact);
        if (!check) found = true;
        
        if (randX+1 < cols-1 && randY+1 < rows-1 && randX+1 > 0 && randY+1 > 0) {
            randX++;
            randY++;

        } else if (randX-1 < cols-1 && randY-1 < rows-1 && randX-1 > 0 && randY-1 > 0) {
            randX--;
            randY--;

        }

    }

    apple = { x: randX, y: randY };
}

// Draw a the cube on the x and y coordinates
function add(x, y) {
    ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth-1, cellHeight-1);
}

// move the backtail of the snake
function shiftSnake() {
    if (snake.length == 1) return;
    if (direction == "STOP") return;

    for (let i=snake.length-1; i>0; i--) {
        const part = snake[i];
        const lastPart = snake[i-1];

        part.x = lastPart.x;
        part.y = lastPart.y;
    }
}

function gameLoop() {
    score.innerText = "Score: " + counter;
    highscore.innerText = "Highscore: " + highCount;

    if (appleCollected) {
        snake = [
            { x: snake[0].x, y: snake[0].y },
            ...snake
        ];

        counter++;
        appleCollected = false;
    }
    
    shiftSnake();

    if (direction == "LEFT") {
        snake[0].x--;

    } else if (direction == "UP") {
        snake[0].y--;

    } else if (direction == "RIGHT") {
        snake[0].x++;

    } else if (direction == "DOWN") {
        snake[0].y++;

    } else if (direction == "STOP") {
        snake[0].x;
        snake[0].y;

    }

    // Snake hits itself
    snake.forEach(part => {
        if (part == snake[0]) return;
        if (part.x == snake[0].x && part.y == snake[0].y) {
            restart();
        }
    })

    if (snake[0].x == apple.x && snake[0].y == apple.y) {
        placeApple();
        appleCollected = true;
    }

    // Snake hits the Border
    if (snake[0].x > cols-1 || snake[0].y > rows-1 || snake[0].x < 0 || snake[0].y < 0) {
        restart();
    }
}

function keyPress(e) {
    if (e.keyCode == 37) {
        direction = "LEFT";
    
    } else if (e.keyCode == 38) {
        direction = "UP";

    } else if (e.keyCode == 39) {
        direction = "RIGHT";

    } else if (e.keyCode == 40) {
        direction = "DOWN";

    } else if (e.keyCode == 32) {
        direction = "STOP";

    } else if (e.keyCode == 65) {
        direction = "LEFT";

    } else if (e.keyCode == 87) {
        direction = "UP";

    } else if (e.keyCode == 68) {
        direction = "RIGHT";

    } else if (e.keyCode == 83) {
        direction = "DOWN";

    }
}

function restart() {
    if (counter > highCount) {
        highCount = counter;
    } 
    counter = 0;
    direction = "STOP";
    appleCollected = false;
    snake = [
        { x: 1, y: 1 }
    ];
    placeApple();
}