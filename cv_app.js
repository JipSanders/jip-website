window.addEventListener("load", () => {
  const canvas = document.getElementById("pacman-ghost-canvas");
  const ctx = canvas.getContext("2d");

  const section = document.querySelector(".pacman-ghost-section");
  function resizeCanvas() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;

    // update Pac-Man & ghosts sizes based on canvas
    pac.radius = canvas.height * 0.07;
    pac.y = canvas.height / 2;

    ghosts[0].radius = canvas.height * 0.065;
    ghosts[0].y = canvas.height / 2;
    ghosts[1].radius = canvas.height * 0.065;
    ghosts[1].y = canvas.height / 2 + canvas.height * 0.15;
    ghosts[2].radius = canvas.height * 0.065;
    ghosts[2].y = canvas.height / 2 - canvas.height * 0.15;

    powerCube.size = canvas.height * 0.035;
    powerCube.y = canvas.height / 2;
  }

  let pac = { x: -0.1 * canvas.width, y: canvas.height / 2, radius: 20, speed: 0.008 * canvas.width, mouth: 0 };
  let ghosts = [
    { x: 0.4 * canvas.width, y: canvas.height / 2, radius: 18, speed: 0.004 * canvas.width, floatOffset: 0, floatDir: 1, color: "red" },
    { x: 0.45 * canvas.width, y: canvas.height / 2 + 0.15 * canvas.height, radius: 18, speed: 0.0039 * canvas.width, floatOffset: 0, floatDir: 1, color: "cyan" },
    { x: 0.5 * canvas.width, y: canvas.height / 2 - 0.15 * canvas.height, radius: 18, speed: 0.0043 * canvas.width, floatOffset: 0, floatDir: 1, color: "pink" }
  ];

  let powerCube = { x: 0.2 * canvas.width, y: canvas.height / 2, size: 10, eaten: false };
  let loop;
  let mouthDirection = 1;

  function drawPacMan() {
    ctx.fillStyle = "yellow";
    ctx.beginPath();
    ctx.moveTo(pac.x, pac.y);
    ctx.arc(pac.x, pac.y, pac.radius, pac.mouth * Math.PI, (2 - pac.mouth) * Math.PI);
    ctx.lineTo(pac.x, pac.y);
    ctx.fill();

    pac.mouth += 0.007 * mouthDirection;
    if (pac.mouth >= 0.3 || pac.mouth <= 0) mouthDirection *= -1;
  }

function drawGhost(ghost, time) {
  const bodyWidth = ghost.radius * 2;
  const waveCount = 3;
  const waveWidth = bodyWidth / waveCount;
  const waveHeight = ghost.radius * 0.28;

  ghost.floatOffset += 0.5 * ghost.floatDir;
  if (ghost.floatOffset > 8 || ghost.floatOffset < -8) ghost.floatDir *= -1;

  const ghostY = ghost.y + ghost.floatOffset;

  // Ghost body
  ctx.fillStyle = ghost.color;
  ctx.beginPath();
  ctx.moveTo(ghost.x - ghost.radius, ghostY);
  ctx.quadraticCurveTo(ghost.x, ghostY - ghost.radius - 5, ghost.x + ghost.radius, ghostY);
  ctx.lineTo(ghost.x + ghost.radius, ghostY + ghost.radius);
  for (let i = waveCount; i > 0; i--) {
    const x = ghost.x - ghost.radius + waveWidth * i;
    const y = ghostY + ghost.radius;
    ctx.quadraticCurveTo(
      x - waveWidth / 2,
      y + (i % 2 === 0 ? -waveHeight : waveHeight),
      x - waveWidth,
      y
    );
  }
  ctx.lineTo(ghost.x - ghost.radius, ghostY + ghost.radius);
  ctx.closePath();
  ctx.fill();

  // Ghost eyes (white)
  ctx.fillStyle = "white";
  const eyeOffsetX = ghost.radius * 0.33;
  const eyeOffsetY = ghost.radius * 0.22;
  const eyeRadius = ghost.radius * 0.22;
  ctx.beginPath();
  ctx.arc(ghost.x - eyeOffsetX, ghostY - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
  ctx.arc(ghost.x + eyeOffsetX, ghostY - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
  ctx.fill();

  // Pupils move left-right with a sine wave
// Pupils move left-right with a sine wave (slower)
ctx.fillStyle = "black";
const pupilRadius = ghost.radius * 0.11;
const maxPupilOffsetX = ghost.radius * 0.1;

// Adjust time multiplier for moderate speed
const offsetX = Math.sin(time * 1 + ghost.x * 0.01) * maxPupilOffsetX;

ctx.beginPath();
ctx.arc(ghost.x - eyeOffsetX + offsetX, ghostY - eyeOffsetY, pupilRadius, 0, Math.PI * 2);
ctx.arc(ghost.x + eyeOffsetX + offsetX, ghostY - eyeOffsetY, pupilRadius, 0, Math.PI * 2);
ctx.fill();
}


  function drawPowerCube() {
    if (!powerCube.eaten) {
      ctx.fillStyle = "orange";
      ctx.fillRect(powerCube.x - powerCube.size / 2, powerCube.y - powerCube.size / 2, powerCube.size, powerCube.size);
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPowerCube();
    ghosts.forEach(drawGhost);
    drawPacMan();

    if (!powerCube.eaten) {
      if (pac.x < powerCube.x) pac.x += pac.speed;
      if (Math.abs(pac.x - powerCube.x) < pac.radius) {
        powerCube.eaten = true;
        ghosts.forEach(g => g.color = "blue");
      }
      return requestAnimationFrame(animate);
    }

    if (pac.x < ghosts[0].x - pac.radius - 40) pac.x += pac.speed;
    ghosts.forEach(g => g.x += g.speed);

    ghosts.forEach((g, index) => {
      const dx = pac.x - g.x;
      const dy = pac.y - g.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < pac.radius + g.radius) {
        ghosts.splice(index, 1);
      }
    });

    if (pac.x - pac.radius > canvas.width && ghosts.every(g => g.x - g.radius > canvas.width)) {
      cancelAnimationFrame(loop);
      setTimeout(startAnimation, 15000);
      return;
    }

    loop = requestAnimationFrame(animate);
  }

  function startAnimation() {
    pac.x = -0.1 * canvas.width;
    pac.y = canvas.height / 2;
    powerCube.eaten = false;
    powerCube.x = 0.2 * canvas.width;
    powerCube.y = canvas.height / 2;

    ghosts[0].x = 0.4 * canvas.width; ghosts[0].y = canvas.height / 2; ghosts[0].floatOffset = 0; ghosts[0].floatDir = 1; ghosts[0].color = "red";
    ghosts[1].x = 0.45 * canvas.width; ghosts[1].y = canvas.height / 2 + 0.15 * canvas.height; ghosts[1].floatOffset = 0; ghosts[1].floatDir = 1; ghosts[1].color = "cyan";
    ghosts[2].x = 0.5 * canvas.width; ghosts[2].y = canvas.height / 2 - 0.15 * canvas.height; ghosts[2].floatOffset = 0; ghosts[2].floatDir = 1; ghosts[2].color = "pink";

    animate();
  }

  resizeCanvas();
  startAnimation();

  window.addEventListener("resize", () => {
    resizeCanvas();
  });
});
