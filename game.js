const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ==============================
// GAME VARIABLES
// ==============================
let elixir = 5;
const maxElixir = 10;

let playerTroops = [];
let enemyTroops = [];

let towers = {
  player: {
    bottom: { x: 80, y: 350, hp: 1000 },
    top: { x: 80, y: 100, hp: 1000 },
    king: { x: 50, y: 230, hp: 1500 }
  },
  enemy: {
    bottom: { x: 800, y: 350, hp: 1000 },
    top: { x: 800, y: 100, hp: 1000 },
    king: { x: 830, y: 230, hp: 1500 }
  }
};

// ==============================
// TROOP CLASS
// ==============================
class Troop {
  constructor(x, y, type, team) {
    this.x = x;
    this.y = y;
    this.team = team;

    const stats = {
      knight: { hp: 180, dmg: 40, speed: 1.4 },
      archer: { hp: 120, dmg: 25, speed: 1.2 },
      giant: { hp: 400, dmg: 70, speed: 0.9 }
    }[type];

    this.type = type;
    this.hp = stats.hp;
    this.damage = stats.dmg;
    this.speed = stats.speed;
  }

  update() {
    if (this.team === "player") this.x += this.speed;
    if (this.team === "enemy") this.x -= this.speed;
  }

  draw() {
    ctx.fillStyle = this.team === "player" ? "blue" : "red";
    ctx.fillRect(this.x, this.y, 25, 25);

    // HP bar
    ctx.fillStyle = "black";
    ctx.fillRect(this.x, this.y - 8, 25, 5);

    ctx.fillStyle = this.team === "player" ? "lightblue" : "pink";
    ctx.fillRect(this.x, this.y - 8, (this.hp / 400) * 25, 5);
  }
}

// ==============================
// PLAYING CARDS
// ==============================
function playCard(cardIndex) {
  const cardCosts = [3, 3, 5, 4];
  const cardTypes = ["knight", "archer", "giant", "fireball"];

  if (elixir < cardCosts[cardIndex]) return;

  elixir -= cardCosts[cardIndex];

  if (cardTypes[cardIndex] === "fireball") {
    castFireball();
  } else {
    spawnTroop(cardTypes[cardIndex]);
  }
}

function spawnTroop(type) {
  const y = Math.random() < 0.5 ? 100 : 350;
  playerTroops.push(new Troop(100, y, type, "player"));
}

// ==============================
// SPELLS
// ==============================
function castFireball() {
  enemyTroops.forEach(t => t.hp -= 80);
}

// ==============================
// ENEMY AI
// ==============================
setInterval(() => {
  const types = ["knight", "archer", "giant"];
  const rand = types[Math.floor(Math.random() * types.length)];
  const y = Math.random() < 0.5 ? 100 : 350;
  enemyTroops.push(new Troop(750, y, rand, "enemy"));
}, 2000);

// ==============================
// ELIXIR REGEN
// ==============================
setInterval(() => {
  if (elixir < maxElixir) elixir++;
}, 1000);

// ==============================
// GAME LOOP
// ==============================
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawTowers();

  drawElixir();

  updateTroops(playerTroops);
  updateTroops(enemyTroops);

  requestAnimationFrame(gameLoop);
}

function updateTroops(list) {
  list.forEach(t => {
    t.update();
    t.draw();
  });
}

function drawElixir() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Elixir: " + elixir, 20, 30);
}

function drawTowers() {
  drawTower(towers.player.bottom, "blue");
  drawTower(towers.player.top, "blue");
  drawTower(towers.player.king, "blue");

  drawTower(towers.enemy.bottom, "red");
  drawTower(towers.enemy.top, "red");
  drawTower(towers.enemy.king, "red");
}

function drawTower(tower, color) {
  ctx.fillStyle = color;
  ctx.fillRect(tower.x, tower.y, 40, 40);

  // HP bar
  ctx.fillStyle = "black";
  ctx.fillRect(tower.x, tower.y - 8, 40, 5);

  ctx.fillStyle = color === "blue" ? "lightblue" : "pink";
  ctx.fillRect(tower.x, tower.y - 8, (tower.hp / 1500) * 40, 5);
}

gameLoop();
