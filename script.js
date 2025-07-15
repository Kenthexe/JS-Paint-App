const container = document.createElement('div');
container.style.maxWidth = '650px';
container.style.margin = '40px auto';
container.style.background = '#fff6ee';
container.style.border = '1px solid #e0d7d1';
container.style.borderRadius = '12px';
container.style.boxShadow = '0 2px 16px #e0d7d155';
container.style.padding = '24px';
container.style.textAlign = 'center';

// Title
const title = document.createElement('h2');
title.textContent = 'JS Drawing Canvas (Paint App)';
title.style.fontFamily = "'Montserrat', sans-serif";
title.style.marginBottom = '12px';
container.appendChild(title);

// Description & Features
const desc = document.createElement('div');
desc.style.fontFamily = "'Share Tech Mono', monospace";
desc.style.fontSize = '1.05em';
desc.style.marginBottom = '18px';
desc.style.textAlign = 'left';
desc.style.maxWidth = '520px';
desc.style.marginLeft = 'auto';
desc.style.marginRight = 'auto';
desc.innerHTML = `
  <strong>Features:</strong>
  <ul style="margin: 8px 0 0 18px; padding: 0;">
    <li>Click &amp; draw with the mouse (or touch)</li>
    <li>Change brush color &amp; size</li>
    <li>Change brush shape (Round, Square, Spray, Rainbow)</li>
    <li>Undo last action (<kbd>Ctrl+Z</kbd> or button)</li>
    <li>Download your drawing (<kbd>Ctrl+S</kbd> or button)</li>
    <li>Clear canvas button</li>
    <li>Toggle grid overlay for precision</li>
    <li>Live brush preview</li>
    <li>Mobile/touch support</li>
  </ul>
  <div style="margin-top: 8px; color: #7d7c7a;">
    <em>Make your own masterpiece with unique brushes and features!</em>
  </div>
`;
container.appendChild(desc);

// Controls container
const controls = document.createElement('div');
controls.style.marginBottom = '16px';
controls.style.display = 'flex';
controls.style.justifyContent = 'center';
controls.style.gap = '16px';
controls.style.flexWrap = 'wrap';

// Brush color
const colorLabel = document.createElement('label');
colorLabel.textContent = 'Brush Color: ';
colorLabel.style.fontFamily = "'Share Tech Mono', monospace";
const colorInput = document.createElement('input');
colorInput.type = 'color';
colorInput.value = '#6C63FF';
colorInput.style.marginLeft = '4px';
colorLabel.appendChild(colorInput);
controls.appendChild(colorLabel);

// Brush size
const sizeLabel = document.createElement('label');
sizeLabel.textContent = 'Brush Size: ';
sizeLabel.style.fontFamily = "'Share Tech Mono', monospace";
const sizeInput = document.createElement('input');
sizeInput.type = 'range';
sizeInput.min = '2';
sizeInput.max = '40';
sizeInput.value = '6';
sizeInput.style.marginLeft = '4px';
sizeLabel.appendChild(sizeInput);
const sizeValue = document.createElement('span');
sizeValue.textContent = sizeInput.value;
sizeValue.style.marginLeft = '6px';
sizeLabel.appendChild(sizeValue);
controls.appendChild(sizeLabel);

// Brush shape
const shapeLabel = document.createElement('label');
shapeLabel.textContent = 'Brush Shape: ';
shapeLabel.style.fontFamily = "'Share Tech Mono', monospace";
const shapeSelect = document.createElement('select');
['Round', 'Square', 'Spray', 'Rainbow'].forEach(shape => {
  const opt = document.createElement('option');
  opt.value = shape.toLowerCase();
  opt.textContent = shape;
  shapeSelect.appendChild(opt);
});
shapeSelect.style.marginLeft = '4px';
shapeLabel.appendChild(shapeSelect);
controls.appendChild(shapeLabel);

// Undo button
const undoBtn = document.createElement('button');
undoBtn.textContent = 'Undo';
undoBtn.style.background = '#6C63FF';
undoBtn.style.border = 'none';
undoBtn.style.color = '#fffdfa';
undoBtn.style.fontWeight = 'bold';
undoBtn.style.padding = '8px 18px';
undoBtn.style.borderRadius = '6px';
undoBtn.style.cursor = 'pointer';
undoBtn.style.fontFamily = "'Montserrat', sans-serif";
undoBtn.style.boxShadow = '0 1px 4px #e0d7d122';
undoBtn.onmouseover = () => undoBtn.style.background = '#554fd6';
undoBtn.onmouseout = () => undoBtn.style.background = '#6C63FF';
controls.appendChild(undoBtn);

// Download button
const downloadBtn = document.createElement('button');
downloadBtn.textContent = 'Download';
downloadBtn.style.background = '#6C63FF';
downloadBtn.style.border = 'none';
downloadBtn.style.color = '#fffdfa';
downloadBtn.style.fontWeight = 'bold';
downloadBtn.style.padding = '8px 18px';
downloadBtn.style.borderRadius = '6px';
downloadBtn.style.cursor = 'pointer';
downloadBtn.style.fontFamily = "'Montserrat', sans-serif";
downloadBtn.style.boxShadow = '0 1px 4px #e0d7d122';
downloadBtn.onmouseover = () => downloadBtn.style.background = '#554fd6';
downloadBtn.onmouseout = () => downloadBtn.style.background = '#6C63FF';
controls.appendChild(downloadBtn);

// Clear button
const clearBtn = document.createElement('button');
clearBtn.textContent = 'Clear Canvas';
clearBtn.style.background = '#FFB085';
clearBtn.style.border = 'none';
clearBtn.style.color = '#3a3a3a';
clearBtn.style.fontWeight = 'bold';
clearBtn.style.padding = '8px 18px';
clearBtn.style.borderRadius = '6px';
clearBtn.style.cursor = 'pointer';
clearBtn.style.fontFamily = "'Montserrat', sans-serif";
clearBtn.style.boxShadow = '0 1px 4px #e0d7d122';
clearBtn.onmouseover = () => clearBtn.style.background = '#f3e9e1';
clearBtn.onmouseout = () => clearBtn.style.background = '#FFB085';
controls.appendChild(clearBtn);

container.appendChild(controls);

// Canvas
const canvas = document.createElement('canvas');
canvas.width = 600;
canvas.height = 380;
canvas.style.background = '#fffdfa';
canvas.style.border = '1.5px solid #e0d7d1';
canvas.style.borderRadius = '8px';
canvas.style.cursor = 'crosshair';
canvas.style.boxShadow = '0 1px 8px #e0d7d122';
container.appendChild(canvas);

// Add everything to the body
document.body.appendChild(container);

// Drawing logic
const ctx = canvas.getContext('2d');
let drawing = false;
let lastX = 0, lastY = 0;
let brushColor = colorInput.value;
let brushSize = parseInt(sizeInput.value, 10);
let brushShape = shapeSelect.value;
let rainbowHue = 0;
let undoStack = [];
const maxUndo = 20;

// Helper: Save current canvas state for undo
function saveState() {
  if (undoStack.length >= maxUndo) undoStack.shift();
  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
}

// Helper: Restore last state
function undo() {
  if (undoStack.length > 0) {
    ctx.putImageData(undoStack.pop(), 0, 0);
  }
}

// Helper: Get mouse/touch position
function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches) {
    return [
      e.touches[0].clientX - rect.left,
      e.touches[0].clientY - rect.top
    ];
  } else {
    return [
      e.clientX - rect.left,
      e.clientY - rect.top
    ];
  }
}

// Drawing functions for different brush shapes
function drawBrush(x, y, lx, ly) {
  if (brushShape === 'round') {
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(x, y);
    ctx.stroke();
  } else if (brushShape === 'square') {
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(x, y);
    ctx.stroke();
    // Draw a square at the current point
    ctx.fillStyle = brushColor;
    ctx.fillRect(x - brushSize/2, y - brushSize/2, brushSize, brushSize);
  } else if (brushShape === 'spray') {
    sprayBrush(x, y);
  } else if (brushShape === 'rainbow') {
    ctx.strokeStyle = `hsl(${rainbowHue}, 100%, 55%)`;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(x, y);
    ctx.stroke();
    rainbowHue = (rainbowHue + 3) % 360;
  }
}

// Spray brush effect
function sprayBrush(x, y) {
  const density = 25 + brushSize * 2;
  for (let i = 0; i < density; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * brushSize * 1.2;
    const dx = Math.cos(angle) * radius;
    const dy = Math.sin(angle) * radius;
    ctx.fillStyle = brushColor;
    ctx.globalAlpha = 0.18 + Math.random() * 0.18;
    ctx.beginPath();
    ctx.arc(x + dx, y + dy, 1 + Math.random() * 1.5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
}

// Drawing event handlers
function startDraw(e) {
  saveState();
  drawing = true;
  [lastX, lastY] = getPos(e);
  if (brushShape === 'spray') {
    sprayBrush(lastX, lastY);
  }
}

function draw(e) {
  if (!drawing) return;
  const [x, y] = getPos(e);
  drawBrush(x, y, lastX, lastY);
  [lastX, lastY] = [x, y];
}

function endDraw() {
  drawing = false;
}

// Mouse events
canvas.addEventListener('mousedown', startDraw);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', endDraw);
canvas.addEventListener('mouseleave', endDraw);

// Touch events for mobile
canvas.addEventListener('touchstart', function(e) {
  e.preventDefault();
  startDraw(e);
});
canvas.addEventListener('touchmove', function(e) {
  e.preventDefault();
  draw(e);
});
canvas.addEventListener('touchend', function(e) {
  e.preventDefault();
  endDraw();
});

// Controls events
colorInput.addEventListener('input', function() {
  brushColor = this.value;
});
sizeInput.addEventListener('input', function() {
  brushSize = parseInt(this.value, 10);
  sizeValue.textContent = this.value;
});
shapeSelect.addEventListener('change', function() {
  brushShape = this.value;
  if (brushShape === 'rainbow') {
    rainbowHue = Math.floor(Math.random() * 360);
  }
});
clearBtn.addEventListener('click', function() {
  saveState();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
undoBtn.addEventListener('click', function() {
  undo();
});
downloadBtn.addEventListener('click', function() {
  const link = document.createElement('a');
  link.download = 'my_drawing.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
    undo();
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault();
    downloadBtn.click();
  }
});

// Show a subtle grid background (toggleable)
let gridOn = false;
const gridBtn = document.createElement('button');
gridBtn.textContent = 'Toggle Grid';
gridBtn.style.background = '#F6F7FB';
gridBtn.style.border = '1px solid #e0d7d1';
gridBtn.style.color = '#7d7c7a';
gridBtn.style.fontWeight = 'bold';
gridBtn.style.padding = '8px 18px';
gridBtn.style.borderRadius = '6px';
gridBtn.style.cursor = 'pointer';
gridBtn.style.fontFamily = "'Montserrat', sans-serif";
gridBtn.style.boxShadow = '0 1px 4px #e0d7d122';
gridBtn.onmouseover = () => gridBtn.style.background = '#e0d7d1';
gridBtn.onmouseout = () => gridBtn.style.background = '#F6F7FB';
controls.appendChild(gridBtn);

function drawGrid() {
  ctx.save();
  ctx.strokeStyle = '#e0d7d1';
  ctx.lineWidth = 0.5;
  for (let x = 20; x < canvas.width; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 20; y < canvas.height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();
}
function redrawWithGrid() {
  // Redraw last state and grid
  if (undoStack.length > 0) {
    ctx.putImageData(undoStack[undoStack.length - 1], 0, 0);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  drawGrid();
}
gridBtn.addEventListener('click', function() {
  gridOn = !gridOn;
  if (gridOn) {
    drawGrid();
  } else {
    // Redraw without grid
    if (undoStack.length > 0) {
      ctx.putImageData(undoStack[undoStack.length - 1], 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
});

// Show a live preview of the brush
const preview = document.createElement('canvas');
preview.width = 60;
preview.height = 60;
preview.style.marginLeft = '18px';
preview.style.verticalAlign = 'middle';
preview.style.background = '#fffdfa';
preview.style.border = '1px solid #e0d7d1';
preview.style.borderRadius = '50%';
preview.style.boxShadow = '0 1px 4px #e0d7d122';
controls.appendChild(preview);

function updatePreview() {
  const pctx = preview.getContext('2d');
  pctx.clearRect(0, 0, preview.width, preview.height);
  const cx = preview.width / 2, cy = preview.height / 2;
  if (brushShape === 'round') {
    pctx.beginPath();
    pctx.arc(cx, cy, brushSize / 2, 0, 2 * Math.PI);
    pctx.fillStyle = brushColor;
    pctx.globalAlpha = 0.8;
    pctx.fill();
    pctx.globalAlpha = 1.0;
  } else if (brushShape === 'square') {
    pctx.fillStyle = brushColor;
    pctx.globalAlpha = 0.8;
    pctx.fillRect(cx - brushSize/2, cy - brushSize/2, brushSize, brushSize);
    pctx.globalAlpha = 1.0;
  } else if (brushShape === 'spray') {
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * brushSize * 0.8;
      const dx = Math.cos(angle) * radius;
      const dy = Math.sin(angle) * radius;
      pctx.fillStyle = brushColor;
      pctx.globalAlpha = 0.18 + Math.random() * 0.18;
      pctx.beginPath();
      pctx.arc(cx + dx, cy + dy, 1 + Math.random() * 1.5, 0, 2 * Math.PI);
      pctx.fill();
      pctx.globalAlpha = 1.0;
    }
  } else if (brushShape === 'rainbow') {
    for (let i = 0; i < 24; i++) {
      pctx.beginPath();
      pctx.arc(cx, cy, brushSize / 2, (i/24)*2*Math.PI, ((i+1)/24)*2*Math.PI);
      pctx.strokeStyle = `hsl(${(rainbowHue + i*15)%360}, 100%, 55%)`;
      pctx.lineWidth = brushSize / 3;
      pctx.stroke();
    }
  }
}
updatePreview();

// Update preview on controls change
colorInput.addEventListener('input', updatePreview);
sizeInput.addEventListener('input', updatePreview);
shapeSelect.addEventListener('change', updatePreview);

// Initial state
saveState();
