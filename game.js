const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let troops = [];
let enemyTroops = [];

let elixir = 5;
const maxElixir = 10;

// Basic troop template
class Troop {
  constructor(x, y, team) {
    this.x = x;
    this.y = y;
    this.hp = 100;
    this.speed = 1;
    this.damage = 5;
    this.team = team; // "player" or "enemy"
  }

  update() {
    if (this.team === "player") this.x += this.speed;
    if (this.team === "enemy") this.x -= this.speed;
  }

  draw() {
    ctx.fillStyle = this.team === "player" ? "blue" : "red";
    ctx.fillRect(this.x, this.y, 20, 20);
  }
}

function spawnPlayerTroop() {
  if (elixir < 3) return;
  elixir -= 3;
  troops.push(new Troop(50, 250, "player"));
}

function spawnEnemyTroop() {
  enemyTroops.push(new Troop(830, 250, "enemy"));
}

document.body.onclick = spawnPlayerTroop;

// Enemy spawns every 2 seconds
setInterval(spawnEnemyTroop, 2000);

// Elixir regeneration
setInterval(() => {
  if (elixir < maxElixir) elixir++;
}, 1000);

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.fillText("Elixir: " + elixir, 20, 20);

  // Update and draw player troops
  troops.forEach(t => {
    t.update();
    t.draw();
  });

  // Update and draw enemy troops
  enemyTroops.forEach(t => {
    t.update();
    t.draw();
  });

  requestAnimationFrame(gameLoop);
}

gameLoop();
