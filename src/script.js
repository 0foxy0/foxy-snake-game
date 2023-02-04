"use strict";

// HTML ELEMENTS
const canvas = document.querySelector("canvas");
const score = document.querySelector("#score");
const highscore = document.querySelector("#highscore");
const ctx = canvas.getContext("2d");

// COORDINATE SYSTEM
const rows = 15;
const cols = 15;
const cellWidth = canvas.width / cols;
const cellHeight = canvas.height / rows;

// PLAYER VARIABLES
let snake = [{ x: 0, y: 0 }];
let apple = { x: 0, y: 0 };
let direction = "";
let appleCollected = false;
let counter = 0;
let highCount = Number(localStorage.getItem("highscore")) || 0;

// GAME START
setInterval(gameLoop, 1000 / 8);
document.onkeydown = keyPress;
draw();
placeSnake();
placeApple();

//FUNCTIONS
function draw() {
  // Background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Snake
  ctx.fillStyle = "limegreen";
  add(snake[0].x, snake[0].y);
  ctx.fillStyle = "green";
  snake.slice(1).forEach((part) => add(part.x, part.y));

  // Apple
  ctx.fillStyle = "red";
  add(apple.x, apple.y);

  requestAnimationFrame(draw);
}

function placeSnake() {
  const randX = Math.floor(Math.random() * cols);
  const randY = Math.floor(Math.random() * rows);

  snake = [{ x: randX, y: randY }];
}

function placeApple() {
  const randX = Math.floor(Math.random() * cols);
  const randY = Math.floor(Math.random() * rows);

  const isInContact = snake.some(function (x, y) {
    return x === randX && y === randY;
  });
  if (isInContact) return placeApple();

  apple = { x: randX, y: randY };
}

// CREATE CUBE
function add(x, y) {
  ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth - 1, cellHeight - 1);
}

// MOVE THE BACK TAIL
function shiftSnake() {
  if (snake.length < 2) return;
  if (!direction) return;

  for (let i = snake.length - 1; i > 0; i--) {
    const part = snake[i];
    const lastPart = snake[i - 1];

    part.x = lastPart.x;
    part.y = lastPart.y;
  }
}

function gameLoop() {
  score.innerText = `Score: ${counter}`;
  highscore.innerText = `Highscore: ${highCount}`;

  if (appleCollected) {
    snake = [{ x: snake[0].x, y: snake[0].y }, ...snake];

    counter++;
    appleCollected = false;
  }

  shiftSnake();

  switch (direction) {
    case "LEFT":
      snake[0].x--;
      break;
    case "UP":
      snake[0].y--;
      break;
    case "RIGHT":
      snake[0].x++;
      break;
    case "DOWN":
      snake[0].y++;
      break;
    default:
      snake[0].x;
      snake[0].y;
      break;
  }

  // Snake hits itself
  snake.forEach((part) => {
    if (part === snake[0]) return;
    if (part.x === snake[0].x && part.y === snake[0].y) {
      restart();
    }
  });

  // Snake collects apple
  if (snake[0].x === apple.x && snake[0].y === apple.y) {
    placeApple();
    appleCollected = true;
  }

  // Snake hits the Border
  if (
    snake[0].x > cols - 1 ||
    snake[0].y > rows - 1 ||
    snake[0].x < 0 ||
    snake[0].y < 0
  ) {
    restart();
  }
}

function keyPress(e) {
  switch (e.keyCode) {
    case 37:
    case 65:
      direction = "LEFT";
      break;
    case 38:
    case 87:
      direction = "UP";
      break;
    case 39:
    case 68:
      direction = "RIGHT";
      break;
    case 40:
    case 83:
      direction = "DOWN";
      break;
    case 32:
      direction = "";
      break;
  }
}

function restart() {
  if (counter > highCount) {
    highCount = counter;
    localStorage.setItem("highscore", highCount.toString());
  }
  counter = 0;
  direction = "";
  appleCollected = false;
  snake = [{ x: 1, y: 1 }];
  placeApple();
}
