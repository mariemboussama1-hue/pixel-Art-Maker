const canvas = document.getElementById("pixel-canvas");
const ctx = canvas.getContext("2d");

let gridSize = 16;
let cellSize = 0;
let grid = [];

let currentColor = "#000000";
let currentTool = "pen";
let isDrawing = false;
let hoveredCell = null;

const PRESET_COLORS = [
  "#000000",
  "#ffffff",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#ff8800",
  "#8800ff",
  "#888888",
  "#553322",
  "#ff6688",
  "#88ff66",
  "#6688ff",
  "#ffcc00",
];

// --- Step 1-a: Initialize the grid and canvas ---

function init() {
  grid = Array.from({ length: gridSize }, () =>
    Array(gridSize).fill("#ffffff")
  );

  cellSize = Math.floor(480 / gridSize);

  canvas.width = gridSize * cellSize;
  canvas.height = gridSize * cellSize;
  render();
}

// --- Step 1-b: Render the grid onto the canvas ---

function render() {
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      ctx.fillStyle = grid[r][c];
      ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
      ctx.strokeStyle = "#333333";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(c * cellSize, r * cellSize, cellSize, cellSize);
    }
  }

  if (hoveredCell && !isDrawing) {
    const { row, col } = hoveredCell;
    const previewColor = currentTool === "eraser" ? "#ffffff" : currentColor;

    ctx.fillStyle = previewColor;
    ctx.globalAlpha = 0.4;
    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    ctx.globalAlpha = 1.0;
  }
}

// --- Step 2-a: Map mouse position to grid cell ---

function getCellFromMouse(e) {
  const pos = canvas.getBoundingClientRect();
  const x = e.clientX - pos.left;
  const y = e.clientY - pos.top;
  const col = Math.floor(x / cellSize);
  const row = Math.floor(y / cellSize);
  if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
    return { row, col };
  }
  return null;
}

// --- Step 2-b: Paint a single cell ---

function paintCell(row, col) {
  if (currentTool === "pen") {
    grid[row][col] = currentColor;
  } else if (currentTool === "eraser") {
    grid[row][col] = "#ffffff";
  }
  render();
}

// --- Step 2-c: Mouse event handlers ---

canvas.addEventListener("mousedown", (e) => {
  isDrawing = true;
  const cell = getCellFromMouse(e);
  if (cell) {
    if (currentTool === "fill") {
      floodFill(cell.row, cell.col, currentColor);
    } else {
      paintCell(cell.row, cell.col);
    }
  }
});

canvas.addEventListener("mousemove", (e) => {
  const cell = getCellFromMouse(e);
  hoveredCell = cell;
  if (isDrawing && currentTool !== "fill" && cell) {
    paintCell(cell.row, cell.col);
  } else {
    render();
  }
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

canvas.addEventListener("mouseleave", () => {
  isDrawing = false;
  hoveredCell = null;
  render();
});

// --- Step 3: Flood fill algorithm ---

function floodFill(row, col, newColor) {
  const targetColor = grid[row][col];
  if (targetColor === newColor) {
    return;
  }
  const stack = [[row, col]];
  while (stack.length > 0) {
    const [r, c] = stack.pop();
    if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) continue;
    if (grid[r][c] !== targetColor) continue;
    grid[r][c] = newColor;
    stack.push([r - 1, c], [r + 1, c], [r, c + 1], [r, c - 1]);
  }
  render();
}

// --- Step 4-a: Build the color palette ---

function buildPalette() {
  const palette = document.getElementById("color-palette");
  PRESET_COLORS.forEach((color) => {
    const swatch = document.createElement("div");
    swatch.classList.add("color-swatch");
    if (color === currentColor) {
      swatch.classList.add("active");
    }
    swatch.style.backgroundColor = color;
    swatch.addEventListener("click", () => {
      currentColor = color;
      document.getElementById("custom-color").value = color;
      document
        .querySelectorAll(".color-swatch")
        .forEach((s) => s.classList.remove("active"));
      swatch.classList.add("active");
    });
    palette.appendChild(swatch);
  });
}

// --- Step 4-b: Custom color picker ---
const custom = document.getElementById("custom-color");
custom.addEventListener("input", (e) => {
  currentColor = e.target.value;
  document
    .querySelectorAll(".color-swatch")
    .forEach((s) => s.classList.remove("active"));
});

// --- Step 4-c: Tool button switching ---
document.querySelectorAll(".tool-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentTool = btn.dataset.tool;
    document
      .querySelectorAll(".tool-btn")
      .forEach((t) => t.classList.remove("active"));
    btn.classList.add("active");
  });
});

buildPalette();

// --- Step 5: Grid size switching ---
const size = document.getElementById("grid-size");
size.addEventListener("change", (e) => {
  const cS = confirm("Changing grid size will clear your canvas. Continue?");
  if (cS) {
    gridSize = Number(e.target.value);
    init();
  } else {
    e.target.value = gridSize;
  }
});

// --- Step 6: PNG export ---
const exp = document.getElementById("export-btn");
exp.addEventListener("click", () => {
  const newcan = document.createElement("canvas");
  const expcxt = newcan.getContext("2d");
  const exportCellSize = Math.max(16, Math.floor(512 / gridSize));
  newcan.width = gridSize * exportCellSize;
  newcan.height = gridSize * exportCellSize;
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      expcxt.fillStyle = grid[row][col];
      expcxt.fillRect(
        col * exportCellSize,
        row * exportCellSize,
        exportCellSize,
        exportCellSize
      );
    }
  }
  const link = document.createElement("a");
  link.download = "pixel-art.png";
  link.href = newcan.toDataURL("image/png");
  link.click();
});

//--- save the painting---
const save = document.getElementById("save-btn");
save.addEventListener("click", () => {
  const saveCon = document.getElementById("save-container");
  saveCon.classList.add("active");
});
const cancel = document.getElementById("canc-btn");
cancel.addEventListener("click", () => {
  const saveCon = document.getElementById("save-container");
  saveCon.classList.remove("active");
});

const conf = document.getElementById("conf-btn");
conf.addEventListener("click", async () => {
  const newcan = document.createElement("canvas");
  const expcxt = newcan.getContext("2d");
  const exportCellSize = Math.max(16, Math.floor(512 / gridSize));
  newcan.width = gridSize * exportCellSize;
  newcan.height = gridSize * exportCellSize;
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      expcxt.fillStyle = grid[row][col];
      expcxt.fillRect(
        col * exportCellSize,
        row * exportCellSize,
        exportCellSize,
        exportCellSize
      );
    }
  }
  const link = document.createElement("a");
  link.download = "pixel-art.png";
  link.href = newcan.toDataURL("image/png");
  const img = link.href;
  const saveTitle = document.getElementById("pixel-title");
  const saveTitleText = saveTitle.value.trim();
  const saveElem = { title: saveTitleText, gridSize: gridSize, grid: grid, img:img };
  if (saveTitleText === "") {
    const error = document.getElementById("error-msg");
    error.textContent = "Please fill in the title!";
    error.style.display = "block";
  } else {
    try {
      const response = await fetch("/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saveElem),
      });

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.log("saving is failed", error);
      alert("try again");
    }
    const saveCon = document.getElementById("save-container");
    saveCon.classList.remove("active");
  }
});
// --- Step 7: Start the app! ---

init();
