const stage = document.querySelector('.stage');
const wheels = Array.from(document.querySelectorAll('.wheel'));
const hint = document.getElementById('rotationHint');

let currentIndex = 0;
let isAnimating = false;
let isRotating = true; // starts rotating automatically
let isCCW = true;
let startY = 0;

// Show first button
wheels[0].classList.add('active');

// Rotation timer
let rotationTimer = null;

function startRotation() {
  if (rotationTimer) return;
  isRotating = true;
  performRotation(); // immediate first step
  rotationTimer = setInterval(performRotation, 0);
}

function stopRotation() {
  if (rotationTimer) {
    clearInterval(rotationTimer);
    rotationTimer = null;
  }
  isRotating = false;

  // Show "Paused" for 0.5 seconds
  if (hint) {
    hint.textContent = "Paused";
    hint.classList.add('visible');
    
    setTimeout(() => {
      hint.classList.remove('visible');
    }, 1300);
  }
}

function performRotation() {
  if (isAnimating) return;
  isAnimating = true;

  const outgoing = wheels[currentIndex];

  if (isCCW) {
    currentIndex = (currentIndex + 1) % wheels.length;
  } else {
    currentIndex = (currentIndex - 1 + wheels.length) % wheels.length;
  }

  const incoming = wheels[currentIndex];

  if (isCCW) {
    outgoing.classList.add('fly-out-ccw');
    incoming.classList.add('fly-in-ccw');
  } else {
    outgoing.classList.add('fly-out-cw');
    incoming.classList.add('fly-in-cw');
  }

  outgoing.addEventListener('animationend', () => {
    outgoing.classList.remove('active', 'fly-out-ccw', 'fly-out-cw');
  }, { once: true });

  incoming.addEventListener('animationend', () => {
    incoming.classList.add('active');
    incoming.classList.remove('fly-in-ccw', 'fly-in-cw');
    isAnimating = false;
  }, { once: true });
}

// ────────────────────────────────────────────────
// Touch/mouse handling
// ────────────────────────────────────────────────
stage.addEventListener('touchstart', e => {
  startY = e.touches[0].clientY;
  e.preventDefault();
}, { passive: false });

stage.addEventListener('touchend', e => {
  const deltaY = startY - e.changedTouches[0].clientY;
  handleInput(deltaY);
}, { passive: false });

stage.addEventListener('mousedown', e => {
  startY = e.clientY;
  e.preventDefault();
});

stage.addEventListener('mouseup', e => {
  const deltaY = startY - e.clientY;
  handleInput(deltaY);
});

// Shared logic
function handleInput(deltaY) {
  if (Math.abs(deltaY) < 40) {
    // Tap / click
    if (isRotating) {
      stopRotation(); // shows "Paused" for 0.5s then hides
    } else {
      const photoUrl = wheels[currentIndex].dataset.photo;
      window.location.href = photoUrl;
    }
  } else if (!isRotating) {
    // Swipe while paused → resume
    if (deltaY > 60) {
      isCCW = true;
      startRotation();
    } else if (deltaY < -60) {
      isCCW = false;
      startRotation();
    }
  }
}

// Start automatically – no hint at start
startRotation();