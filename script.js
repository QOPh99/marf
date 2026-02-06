const stage = document.querySelector('.stage');
const wheels = Array.from(document.querySelectorAll('.wheel'));

let currentIndex = 0;
let isAnimating = false;
let isRotating = true;        // starts rotating automatically
let isCCW = true;             // counter-clockwise default
let startY = 0;
let tapCount = 0;
let tapTimer = null;

const TAP_TIMEOUT = 320;      // ms for double-tap detection
const FRAME_DURATION = 1100;  // 1.1s animation + buffer

// Show first button
wheels[0].classList.add('active');

// Rotation timer
let rotationTimer = null;

function startRotation() {
  if (rotationTimer) return;
  isRotating = true;
  performRotation(); // immediate first step
  rotationTimer = setInterval(performRotation, FRAME_DURATION);
}

function stopRotation() {
  if (rotationTimer) {
    clearInterval(rotationTimer);
    rotationTimer = null;
  }
  isRotating = false;
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

// Unified input handling (works on touch & mouse)
stage.addEventListener('mousedown', e => {
  startY = e.clientY;
  e.preventDefault();
});

stage.addEventListener('mouseup', e => {
  const deltaY = startY - e.clientY;
  handleInput(deltaY);
});

stage.addEventListener('touchstart', e => {
  startY = e.touches[0].clientY;
  e.preventDefault();
}, { passive: false });

stage.addEventListener('touchend', e => {
  const deltaY = startY - e.changedTouches[0].clientY;
  handleInput(deltaY);
}, { passive: false });

// Shared logic for both mouse & touch
function handleInput(deltaY) {
  if (Math.abs(deltaY) < 35) {
    // Tap / click
    if (isRotating) {
      // First tap/click → pause only
      stopRotation();
    } else {
      // Already paused → count double-tap
      tapCount++;
      if (tapCount === 1) {
        tapTimer = setTimeout(() => { tapCount = 0; }, TAP_TIMEOUT);
      } else if (tapCount === 2) {
        clearTimeout(tapTimer);
        tapCount = 0;
        // Double-tap/click → open photo
        const photoUrl = wheels[currentIndex].dataset.photo;
        window.location.href = photoUrl;
      }
    }
  } else if (!isRotating) {
    // Swipe while paused → resume
    if (deltaY > 60) {
      // Up → CCW
      isCCW = true;
      startRotation();
    } else if (deltaY < -60) {
      // Down → CW
      isCCW = false;
      startRotation();
    }
  }
}

// Start automatically
startRotation();