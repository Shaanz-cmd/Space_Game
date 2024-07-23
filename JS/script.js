const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

// Clear Screen function
function clearScreen() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

// Global Variables
let dy = 2;
let scoreCount = 0;
let liveCount = 3;
let highScoreCount = 0;
// Game Texts
function score() {
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "whitesmoke";
  ctx.fillText(`Score: ${scoreCount}`, 50, 40);
}

function highScore() {
  ctx.font = "bold 18px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "whitesmoke";
  ctx.fillText(`HighScore: ${highScoreCount}`, window.innerWidth / 2, 40);
}

function lives() {
  ctx.textAlign = "center";
  ctx.fillStyle = "whitesmoke";
  ctx.fillText(`Lives: ${liveCount}`, window.innerWidth - 40, 40);
}

function gameOver() {
  ctx.font = "bold 35px sans-serif";
  ctx.textAlign = "center";
  ctx.fillStyle = "red";
  ctx.fillText("GAME OVER", window.innerWidth / 2, window.innerHeight / 2);
}

// Game characters
class SpaceShip {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.image = image;
  }

  render(ctx) {
    ctx.drawImage(this.image, this.x, this.y, 80, 80);
  }
}

class Asteroid {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
  }

  update() {
    this.y += dy;
    if (this.y - this.radius > window.innerHeight) {
      this.y = -this.radius;
      this.x = Math.random() * window.innerWidth;
      liveCount--;
      if (scoreCount > 10 && scoreCount < 100) {
        dy += 0.3;
      } else if (scoreCount > 100) {
        dy += 0.5;
      }
    }
  }
}

class Fire {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.y -= 5;
  }
}

// Game character Rendering
let spaceShipImg = new Image();
spaceShipImg.src = "./img/Asset 2.png";
let spaceShip = new SpaceShip(
  window.innerWidth / 2.1,
  window.innerHeight - 90,
  spaceShipImg
);

// Function to get random integer
function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Array to store active shots
let shots = [];

// Function to add a new shot
function shoot() {
  let fire = new Fire(spaceShip.x + 40, spaceShip.y - 5, 3, "orange");
  shots.push(fire);
}

// Asteroids array
let asteroids = [];

// Function to create a new asteroid
function createAsteroid() {
  let radius = getRandomInteger(10, 25);
  let asteroid = new Asteroid(
    Math.random() * window.innerWidth,
    -radius,
    radius,
    "#767676"
  );
  asteroids.push(asteroid);
}

// Collision Detection B/W objects;
function collisionDetection() {
  shots.forEach((shot, shotIndex) => {
    asteroids.forEach((asteroid, asteroidIndex) => {
      let dx = asteroid.x - shot.x;
      let dy = asteroid.y - shot.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= asteroid.radius + shot.radius) {
        scoreCount++;
        shots.splice(shotIndex, 1);
        asteroids.splice(asteroidIndex, 1);
      }
    });
  });
}

// EventListerners
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowRight":
    case "d":
      spaceShip.x += 16;
      break;
    case "ArrowLeft":
    case "a":
      spaceShip.x -= 16;
      break;
    case "ArrowUp":
    case "w":
      spaceShip.y -= 16;
      break;
    case "ArrowDown":
    case "s":
      spaceShip.y += 16;
      break;
    case " ":
      shoot();
      break;
  }
});

// Boundary Limit Function for SpaceShip
function limit() {
  if (spaceShip.x < -35) spaceShip.x = 0;
  if (spaceShip.y < -35) spaceShip.y = 0;
  if (spaceShip.x + 40 > window.innerWidth)
    spaceShip.x = window.innerWidth - 80;
  if (spaceShip.y + 100 > window.innerHeight)
    spaceShip.y = window.innerHeight - 80;
}

// Main render function
function render() {
  clearScreen();
  spaceShip.render(ctx);
  asteroids.forEach((asteroid) => {
    asteroid.update();
    asteroid.render(ctx);
  });
  limit();

  shoot();
  // Update and render shots
  shots.forEach((shot, index) => {
    shot.update();
    shot.render(ctx);

    // Remove shots that go off screen
    if (shot.y < 0) {
      shots.splice(index, 1);
    }
  });

  collisionDetection();
  score();
  highScore();
  lives();

  if (liveCount > 0) {
    requestAnimationFrame(render);
  } else {
    gameOver();
  }
  // if (gameOver && scoreCount > highScoreCount) {
  //   highScoreCount = scoreCount;
  // }
}

// Create new asteroids at intervals
setInterval(createAsteroid, 1500); // Create a new asteroid every 1.5 seconds

render();
