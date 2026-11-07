* {
  box-sizing: border-box;
}

:root {
  --bg: #09121f;
  --panel: #0f1d2d;
  --panel-alt: #142a42;
  --road: #1b2738;
  --line: #f5f7ff;
  --accent: #7ef9d5;
  --accent-2: #6cc7ff;
  --danger: #ff5d73;
  --warning: #ffd166;
  --text: #ecf6ff;
  --shadow: rgba(0, 0, 0, 0.35);
}

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at top, rgba(108, 199, 255, 0.22), transparent 40%),
    linear-gradient(160deg, var(--bg), #0b1626 60%, #071018);
  color: var(--text);
  font-family: Arial, Helvetica, sans-serif;
}

.page-shell {
  width: min(96vw, 1000px);
}

.hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  margin-bottom: 12px;
  border: 1px solid rgba(126, 249, 213, 0.4);
  background: rgba(15, 29, 45, 0.9);
  border-radius: 16px;
  box-shadow: 0 12px 24px var(--shadow);
}

.brand {
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accent);
}

.stats {
  display: flex;
  gap: 18px;
  font-size: 1.02rem;
}

.game-panel {
  position: relative;
  border: 1px solid rgba(108, 199, 255, 0.5);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.4);
  background: #0c1728;
}

canvas {
  display: block;
  width: 100%;
  height: auto;
  background: linear-gradient(#7bc9ff 0%, #add8ff 30%, #d8f1ff 30%, #d8f1ff 100%);
}

.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  background: rgba(8, 18, 31, 0.68);
  backdrop-filter: blur(4px);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}

.overlay.visible {
  opacity: 1;
  pointer-events: auto;
}

.overlay h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
  color: var(--accent);
}

.overlay p,
.overlay li {
  margin: 0;
  color: var(--text);
}

.overlay ul {
  margin: 0;
  padding-left: 1.1rem;
  text-align: left;
}

button {
  margin-top: 8px;
  border: none;
  border-radius: 999px;
  padding: 0.9rem 1.8rem;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #04283d;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(126, 249, 213, 0.35);
  transition: transform 0.15s ease;
}

button:hover {
  transform: translateY(-1px) scale(1.02);
}

button:active {
  transform: translateY(0) scale(0.99);
}

@media (max-width: 720px) {
  .hud {
    flex-direction: column;
    gap: 8px;
  }

  .stats {
    gap: 10px;
    font-size: 0.9rem;
  }
}
