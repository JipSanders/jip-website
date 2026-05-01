/* ============================================
   CV_APP.JS
   JavaScript for cv.html
   ============================================ */

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
const initMobileMenu = () => {
  const menuToggle = document.querySelector('#mobile-menu');
  const menuLinks = document.querySelector('.navbar__menu');
  const navLinks = document.querySelectorAll('.navbar__links');
  const navLogo = document.querySelector('#navbar__logo');

  if (!menuToggle || !menuLinks) return;

  // Toggle mobile menu
  const toggleMenu = () => {
    menuToggle.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
  };

  // Hide mobile menu when link is clicked (redirects back to homepage)
  const hideMenu = () => {
    if (window.innerWidth <= 900 && menuToggle.classList.contains('is-active')) {
      menuToggle.classList.remove('is-active');
      menuLinks.classList.remove('active');
    }
  };

  // Event listeners
  menuToggle.addEventListener('click', toggleMenu);
  navLinks.forEach(link => link.addEventListener('click', hideMenu));
  navLogo.addEventListener('click', hideMenu);
};

// ==========================================
// PAC-MAN CANVAS ANIMATION
// Easter egg animation on CV page
// ==========================================
const initPacManAnimation = () => {
  const canvas = document.getElementById('pacman-ghost-canvas');
  
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const section = document.querySelector('.pacman-ghost-section');

  // ========== CANVAS SETUP ==========
  const resizeCanvas = () => {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;

    // Calculate base size — cap small for a clean, unobtrusive look
    const calculatedSize = Math.min(canvas.width / 20, canvas.height * 0.18);
    const baseSize = Math.min(calculatedSize, 14);

    // Update sizes based on baseSize (maintains aspect ratio)
    pac.radius = baseSize;
    pac.y = canvas.height / 2;

    ghosts[0].radius = baseSize * 0.9;
    ghosts[0].y = canvas.height / 2;

    ghosts[1].radius = baseSize * 0.9;
    ghosts[1].y = canvas.height / 2;

    ghosts[2].radius = baseSize * 0.9;
    ghosts[2].y = canvas.height / 2;

    powerCube.size = baseSize * 0.5;
    powerCube.y = canvas.height / 2;
  };

  // ========== GAME OBJECTS ==========
  let pac = {
    x: -0.1 * canvas.width,
    y: canvas.height / 2,
    radius: 20,
    speed: 0.008 * canvas.width,
    mouth: 0
  };

  let ghosts = [
    {
      x: 0.55 * canvas.width,
      y: canvas.height / 2,
      radius: 18,
      speed: 0.004 * canvas.width,
      floatOffset: 0,
      floatDir: 1,
      color: 'red'
    },
    {
      x: 0.68 * canvas.width,
      y: canvas.height / 2,
      radius: 18,
      speed: 0.0039 * canvas.width,
      floatOffset: 3,
      floatDir: 1,
      color: 'cyan'
    },
    {
      x: 0.81 * canvas.width,
      y: canvas.height / 2,
      radius: 18,
      speed: 0.0043 * canvas.width,
      floatOffset: -2,
      floatDir: 1,
      color: 'pink'
    }
  ];

  let powerCube = {
    x: 0.2 * canvas.width,
    y: canvas.height / 2,
    size: 10,
    eaten: false
  };

  let loop;
  let mouthDirection = 1;

  // ========== DRAWING FUNCTIONS ==========
  const drawPacMan = () => {
    ctx.save();
    ctx.translate(pac.x, pac.y);
    ctx.scale(0.78, 1); // Narrow oval — thinner than a circle
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, pac.radius, pac.mouth * Math.PI, (2 - pac.mouth) * Math.PI);
    ctx.lineTo(0, 0);
    ctx.fill();
    ctx.restore();

    // Animate mouth
    pac.mouth += 0.007 * mouthDirection;
    if (pac.mouth >= 0.3 || pac.mouth <= 0) {
      mouthDirection *= -1;
    }
  };

  const drawGhost = (ghost) => {
    // Float animation — gentle bob
    ghost.floatOffset += 0.3 * ghost.floatDir;
    if (ghost.floatOffset > 5 || ghost.floatOffset < -5) {
      ghost.floatDir *= -1;
    }

    const ghostY = ghost.y + ghost.floatOffset;

    // Compress ghost horizontally so it's taller than wide (classic ghost shape)
    ctx.save();
    ctx.translate(ghost.x, ghostY);
    ctx.scale(0.72, 1);
    ctx.translate(-ghost.x, -ghostY);

    const bodyWidth  = ghost.radius * 2;
    const bodyHeight = ghost.radius * 2.5; // Tall > wide after scale: ~1.8× taller than visible width
    const waveCount  = 3;
    const waveWidth  = bodyWidth / waveCount;
    const waveHeight = ghost.radius * 0.32;

    ctx.fillStyle = ghost.color;
    ctx.beginPath();
    
    // Start at bottom left
    ctx.moveTo(ghost.x - ghost.radius, ghostY + bodyHeight / 2);
    
    // Left side going up
    ctx.lineTo(ghost.x - ghost.radius, ghostY - bodyHeight / 2 + ghost.radius);
    
    // Rounded top (perfect semicircle)
    ctx.arc(
      ghost.x,
      ghostY - bodyHeight / 2 + ghost.radius,
      ghost.radius,
      Math.PI,
      0,
      false
    );
    
    // Right side going down
    ctx.lineTo(ghost.x + ghost.radius, ghostY + bodyHeight / 2);
    
    // Wavy bottom (right to left)
    for (let i = waveCount; i > 0; i--) {
      const waveX = ghost.x - ghost.radius + waveWidth * i;
      const waveY = ghostY + bodyHeight / 2;
      
      ctx.quadraticCurveTo(
        waveX - waveWidth / 2,
        waveY + (i % 2 === 0 ? waveHeight : -waveHeight),
        waveX - waveWidth,
        waveY
      );
    }
    
    ctx.closePath();
    ctx.fill();

    // Eyes (white ovals, proper positioning)
    ctx.fillStyle = 'white';
    const eyeOffsetX = ghost.radius * 0.35;
    const eyeOffsetY = ghost.radius * 0.15;
    const eyeWidth = ghost.radius * 0.3;
    const eyeHeight = ghost.radius * 0.4;
    
    // Left eye
    ctx.beginPath();
    ctx.ellipse(
      ghost.x - eyeOffsetX,
      ghostY - eyeOffsetY,
      eyeWidth,
      eyeHeight,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Right eye
    ctx.beginPath();
    ctx.ellipse(
      ghost.x + eyeOffsetX,
      ghostY - eyeOffsetY,
      eyeWidth,
      eyeHeight,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Pupils (animated, proper size)
    ctx.fillStyle = 'blue';
    const pupilRadius = ghost.radius * 0.15;
    const maxPupilOffsetX = ghost.radius * 0.12;
    const time = Date.now() * 0.001;
    const pupilOffsetX = Math.sin(time * 0.8 + ghost.x * 0.01) * maxPupilOffsetX;
    
    // Left pupil
    ctx.beginPath();
    ctx.arc(
      ghost.x - eyeOffsetX + pupilOffsetX,
      ghostY - eyeOffsetY,
      pupilRadius,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Right pupil
    ctx.beginPath();
    ctx.arc(
      ghost.x + eyeOffsetX + pupilOffsetX,
      ghostY - eyeOffsetY,
      pupilRadius,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore(); // End horizontal compression
  };

  const drawPowerCube = () => {
    if (!powerCube.eaten) {
      ctx.fillStyle = 'orange';
      ctx.fillRect(
        powerCube.x - powerCube.size / 2,
        powerCube.y - powerCube.size / 2,
        powerCube.size,
        powerCube.size
      );
    }
  };

  // ========== ANIMATION LOOP ==========
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawPowerCube();
    ghosts.forEach(drawGhost);
    drawPacMan();

    // Move Pac-Man toward power cube
    if (!powerCube.eaten) {
      if (pac.x < powerCube.x) {
        pac.x += pac.speed;
      }

      // Check if Pac-Man ate power cube
      if (Math.abs(pac.x - powerCube.x) < pac.radius) {
        powerCube.eaten = true;
        ghosts.forEach(g => (g.color = 'blue'));
      }
      
      return requestAnimationFrame(animate);
    }

    // Move Pac-Man toward ghosts
    if (pac.x < ghosts[0].x - pac.radius - 40) {
      pac.x += pac.speed;
    }

    // Move ghosts
    ghosts.forEach(g => (g.x += g.speed));

    // Check collisions
    ghosts.forEach((g, index) => {
      const dx = pac.x - g.x;
      const dy = pac.y - g.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < pac.radius + g.radius) {
        ghosts.splice(index, 1);
      }
    });

    // Reset when all off screen
    if (
      pac.x - pac.radius > canvas.width &&
      ghosts.every(g => g.x - g.radius > canvas.width)
    ) {
      cancelAnimationFrame(loop);
      setTimeout(startAnimation, 15000); // Restart after 15s
      return;
    }

    loop = requestAnimationFrame(animate);
  };

  // ========== START ANIMATION ==========
  const startAnimation = () => {
    // Reset Pac-Man
    pac.x = -0.1 * canvas.width;
    pac.y = canvas.height / 2;
    
    // Reset power cube
    powerCube.eaten = false;
    powerCube.x = 0.2 * canvas.width;
    powerCube.y = canvas.height / 2;

    // Reset ghosts — horizontal line, evenly spaced
    ghosts[0].x = 0.55 * canvas.width;
    ghosts[0].y = canvas.height / 2;
    ghosts[0].floatOffset = 0;
    ghosts[0].floatDir = 1;
    ghosts[0].color = 'red';

    ghosts[1].x = 0.68 * canvas.width;
    ghosts[1].y = canvas.height / 2;
    ghosts[1].floatOffset = 3;
    ghosts[1].floatDir = 1;
    ghosts[1].color = 'cyan';

    ghosts[2].x = 0.81 * canvas.width;
    ghosts[2].y = canvas.height / 2;
    ghosts[2].floatOffset = -2;
    ghosts[2].floatDir = 1;
    ghosts[2].color = 'pink';

    animate();
  };

  // ========== INITIALIZE ==========
  resizeCanvas();
  startAnimation();

  // Handle window resize
  window.addEventListener('resize', resizeCanvas);
};

// ==========================================
// CUSTOM CURSOR — SPOTLIGHT + PRECISION DOT
// ==========================================
const initCustomCursor = () => {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot  = document.createElement('div');
  dot.className = 'cursor-dot cursor-hidden';

  const spot = document.createElement('div');
  spot.className = 'cursor-spot cursor-hidden';

  document.body.appendChild(spot);
  document.body.appendChild(dot);

  const root = document.documentElement;

  document.addEventListener('mousemove', (e) => {
    dot.style.left = e.clientX + 'px';
    dot.style.top  = e.clientY + 'px';
    root.style.setProperty('--cx', e.clientX + 'px');
    root.style.setProperty('--cy', e.clientY + 'px');
    dot.classList.remove('cursor-hidden');
    spot.classList.remove('cursor-hidden');
  });

  document.addEventListener('mouseleave', () => {
    dot.classList.add('cursor-hidden');
    spot.classList.add('cursor-hidden');
  });
  document.addEventListener('mouseenter', () => {
    dot.classList.remove('cursor-hidden');
    spot.classList.remove('cursor-hidden');
  });

  const interactors = 'a, button, .skill-card, .cv__request-btn';
  document.querySelectorAll(interactors).forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => dot.classList.remove('cursor-hover'));
  });
};

// ==========================================
// INITIALIZE ALL FUNCTIONS
// ==========================================
const init = () => {
  initMobileMenu();
  initPacManAnimation();
  initCustomCursor();
};

// Run on window load (ensures canvas is ready)
window.addEventListener('load', init);

/* ============================================
   PERFORMANCE NOTES
   ============================================
   
   Improvements made:
   1. Organized into clear sections
   2. Added null checks
   3. Used requestAnimationFrame properly
   4. Cleaned up variable naming
   5. Added comments for clarity
   6. Improved code structure
   
   Canvas animation optimized:
   - Proper cleanup on reset
   - Efficient collision detection
   - Smooth animations with RAF
   
   ============================================ */
