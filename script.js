const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best-score');
const overlay = document.getElementById('overlay');
const groundY = canvas.height - 70;
const keys = { left: false, right: false };
const player = { x: 150, y: groundY - 48, w: 78, h: 48, vy: 0, grounded: true };
let obstacles = [], batteries = [];
let running = false, gameOver = false, distance = 0, score = 0, best = Number(localStorage.getItem('escooter-best') || 0), speed = 5, spawn = 0, batterySpawn = 0;
bestEl.textContent = best;

function showOverlay(title, message, buttonText) {
  overlay.innerHTML = `<h1>${title}</h1><p>${message}</p><ul><li>Move: A / D or ← / →</li><li>Jump: W, ↑, or Space</li></ul><button id="playButton">${buttonText}</button>`;
  overlay.classList.add('visible');
  document.getElementById('playButton').addEventListener('click', startGame);
}
function startGame() {
  obstacles = []; batteries = []; distance = 0; score = 0; speed = 5; spawn = 0; batterySpawn = 0;
  player.x = 150; player.y = groundY - player.h; player.vy = 0; player.grounded = true;
  running = true; gameOver = false; overlay.classList.remove('visible');
}
function jump() { if (running && player.grounded) { player.vy = -13; player.grounded = false; } }
function endGame() { running = false; gameOver = true; showOverlay('Crash!', `Final score: ${score}`, 'Ride again'); }
function update() {
  if (!running) return;
  distance++;
  score = Math.floor(distance / 8);
  speed = 5 + score * .015;
  if (score > best) { best = score; localStorage.setItem('escooter-best', best); }
  scoreEl.textContent = score; bestEl.textContent = best;
  if (keys.left) player.x -= 6;
  if (keys.right) player.x += 6;
  player.x = Math.max(20, Math.min(canvas.width - player.w - 20, player.x));
  player.vy += .62; player.y += player.vy;
  if (player.y >= groundY - player.h) { player.y = groundY - player.h; player.vy = 0; player.grounded = true; }
  if (++spawn > Math.max(42, 90 - score * .35)) { const h = 28 + Math.random() * 38, w = 34 + Math.random() * 45; obstacles.push({ x: canvas.width + 20, y: groundY - h, w, h }); spawn = 0; }
  if (++batterySpawn > 160) { batteries.push({ x: canvas.width + 20, y: groundY - 90 - Math.random() * 70, bob: 0 }); batterySpawn = 0; }
  for (let i = obstacles.length - 1; i >= 0; i--) {
    const o = obstacles[i]; o.x -= speed;
    if (player.x < o.x + o.w && player.x + player.w > o.x && player.y < o.y + o.h && player.y + player.h > o.y) { endGame(); return; }
    if (o.x + o.w < 0) obstacles.splice(i, 1);
  }
  for (let i = batteries.length - 1; i >= 0; i--) {
    const b = batteries[i]; b.x -= speed; b.bob += .12;
    if (Math.hypot(player.x + player.w / 2 - b.x, player.y + player.h / 2 - b.y) < 28) { score += 25; batteries.splice(i, 1); }
    else if (b.x < -20) batteries.splice(i, 1);
  }
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#8fd9ff'; ctx.fillRect(0, 0, canvas.width, groundY);
  ctx.fillStyle = '#c9efff';
  for (let i = 0; i < 6; i++) { const x = (i * 210 - distance * .5 % 220); ctx.beginPath(); ctx.arc(x, 100 + i % 2 * 30, 25, 0, Math.PI * 2); ctx.arc(x + 28, 94 + i % 2 * 30, 20, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#263849'; ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.setLineDash([26, 26]); ctx.beginPath(); ctx.moveTo(-distance * 2 % 52, groundY + 13); ctx.lineTo(canvas.width, groundY + 13); ctx.stroke(); ctx.setLineDash([]);
  // Scooter and rider
  ctx.fillStyle = '#18334b'; ctx.fillRect(player.x + 10, player.y + 32, 54, 7);
  ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(player.x + 18, player.y + 43, 7, 0, Math.PI * 2); ctx.arc(player.x + 58, player.y + 43, 7, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#22a88e'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(player.x + 35, player.y + 30); ctx.lineTo(player.x + 40, player.y + 8); ctx.lineTo(player.x + 54, player.y + 30); ctx.stroke();
  ctx.fillStyle = '#ffd6a5'; ctx.beginPath(); ctx.arc(player.x + 42, player.y + 2, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#176b70'; ctx.fillRect(player.x + 31, player.y + 10, 20, 18);
  for (const o of obstacles) { ctx.fillStyle = '#ff6b5e'; ctx.beginPath(); ctx.moveTo(o.x, groundY); ctx.lineTo(o.x + o.w / 2, o.y); ctx.lineTo(o.x + o.w, groundY); ctx.fill(); }
  for (const b of batteries) { ctx.fillStyle = '#ffe66d'; ctx.fillRect(b.x - 10, b.y + Math.sin(b.bob) * 7 - 12, 20, 25); ctx.fillStyle = '#198c77'; ctx.fillRect(b.x - 4, b.y + Math.sin(b.bob) * 7 - 8, 8, 17); }
}
function loop() { update(); draw(); requestAnimationFrame(loop); }
window.addEventListener('keydown', e => { const k = e.key.toLowerCase(); if (['arrowleft','arrowright','arrowup',' '].includes(k)) e.preventDefault(); if (k === 'a' || k === 'arrowleft') keys.left = true; if (k === 'd' || k === 'arrowright') keys.right = true; if (k === 'w' || k === 'arrowup' || k === ' ') jump(); if (k === 'enter' && gameOver) startGame(); });
window.addEventListener('keyup', e => { const k = e.key.toLowerCase(); if (k === 'a' || k === 'arrowleft') keys.left = false; if (k === 'd' || k === 'arrowright') keys.right = false; });
window.addEventListener('blur', () => { keys.left = false; keys.right = false; });
showOverlay('E-Scooter Rush', 'Dodge obstacles, collect batteries, and keep riding.', 'Start Ride');
loop();
