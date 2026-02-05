const COLS = 3;
const ROWS = 4;
const TOTAL = COLS * ROWS;

const container = document.getElementById('container');
const counter   = document.getElementById('counter');
const homeBtn   = document.getElementById('homeBtn');

let currentCol = 0;
let currentRow = 0;

// Unique button backgrounds (replace URLs as needed)
const backgrounds = [
  'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?auto=format&fit=crop&q=80',   // 1
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557682250-33bd709cbe8b?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544197807-bb503430e22e?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557683311-973673baf926?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557682257-2f9c97a8a469?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557683316-973673bafddb?auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1557683304-673a23048d34?auto=format&fit=crop&q=80'
];

function createGrid() {
  for (let i = 0; i < TOTAL; i++) {
    const row = Math.floor(i / COLS);
    const col = i % COLS;
    const num  = i + 1;

    const page = document.createElement('div');
    page.className = 'page';
    page.style.left = `${col * 100}vw`;
    page.style.top  = `${row * 100}vh`;

    const btn = document.createElement('a'); // using <a> for URL navigation
    btn.className = 'big-button';
    btn.textContent = num;
    btn.style.backgroundImage = `url('${backgrounds[i]}')`;

    // ── Developer: set real URLs here ────────────────────────────────
    // Example: btn.href = `https://example.com/page-${num}`;
    btn.href = `#button-${num}`; // placeholder – change to real links

    btn.target = "_blank";       // optional: open in new tab
    // btn.target = "_self";     // or same tab

    page.appendChild(btn);
    container.appendChild(page);
  }
}

function updateView() {
  container.style.transform = `translate(-${currentCol * 100}vw, -${currentRow * 100}vh)`;
  counter.textContent = `Button ${currentRow * COLS + currentCol + 1}`;
  homeBtn.classList.toggle('visible', currentRow !== 0 || currentCol !== 0);
}

function moveTo(row, col) {
  if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
  currentRow = row;
  currentCol = col;
  updateView();
}

// Arrow clicks
document.getElementById('arrowUp')   .addEventListener('click', () => moveTo(currentRow - 1, currentCol));
document.getElementById('arrowDown') .addEventListener('click', () => moveTo(currentRow + 1, currentCol));
document.getElementById('arrowLeft') .addEventListener('click', () => moveTo(currentRow, currentCol - 1));
document.getElementById('arrowRight').addEventListener('click', () => moveTo(currentRow, currentCol + 1));

// Home button
homeBtn.addEventListener('click', () => moveTo(0, 0));

// Init
createGrid();
updateView();