import "./styles.css";

const canvas = document.getElementById("paintCanvas");
const resetBtn = document.getElementById("resetBtn");
const notify = document.getElementById("notify");
const confirmDelete = document.getElementById("delete");
const hitMissText = document.getElementById("hitMissText");
const yes = document.getElementById("yes");
const no = document.getElementById("no");

const CANVAS_HEIGHT = 739;
const MINIMUM_RADIUS_THRESHOLD = 50;

// Set canvas dimensions and styles
canvas.style.height = `${CANVAS_HEIGHT}px`;
canvas.style.borderRadius = "4px";
canvas.height = CANVAS_HEIGHT * 2;

const context = canvas.getContext("2d");

let isDrawing = false;
let startX, startY;
let circles = [];
let timeout = null;
let indexToDelete = null;

// ----- Event Handlers -----

/**
 * Handles the mousedown event and checks for hit/miss on existing circles.
 * If missed, starts the process for drawing a new circle.
 * If hit, shows the delete confirmation dialog.
 *
 * @param {MouseEvent} e - The mousedown event.
 */
function handleMouseDown(e) {
  if (timeout) clearTimeout(timeout);

  isDrawing = true;
  const { x, y } = getMousePosition(canvas, e);
  startX = x;
  startY = y;

  const hit = circles.some((circle, index) => {
    if (isPointInCircle(x, y, circle)) {
      indexToDelete = index;
      return true;
    }
    return false;
  });

  updateHitMissNotification(hit, e);
}

/**
 * Handles the mouseup event to draw the circle if not a hit.
 * Completes the drawing process by calculating radius and center.
 *
 * @param {MouseEvent} e - The mouseup event.
 */
function handleMouseUp(e) {
  if (!isDrawing) return;

  const { x: currentX, y: currentY } = getMousePosition(canvas, e);
  const radius = calculateRadius(startX, startY, currentX, currentY);

  if (radius > MINIMUM_RADIUS_THRESHOLD) {
    const center = getCircleCenter(startX, startY, currentX, currentY);
    const color = getRandomHexColor();
    drawCircle(center.x, center.y, radius, color);
  }

  isDrawing = false;
}

/**
 * Handles the deletion of a circle after confirmation.
 */
function handleDelete() {
  if (indexToDelete !== null) {
    circles.splice(indexToDelete, 1);
    redrawCircles();
    confirmDelete.style.display = "none";
    indexToDelete = null;
  }
}

/**
 * Cancels the delete confirmation dialog.
 */
function handleCancel() {
  confirmDelete.style.display = "none";
  indexToDelete = null;
}

// Event listeners for mouse interactions and actions
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mouseup", handleMouseUp);
yes.addEventListener("click", handleDelete);
no.addEventListener("click", handleCancel);
resetBtn.addEventListener("mousedown", () => resetCanvas());

// ----- Helper Functions -----

/**
 * Calculates the radius using the distance between two points.
 *
 * @param {number} x1 - The x-coordinate of the first point.
 * @param {number} y1 - The y-coordinate of the first point.
 * @param {number} x2 - The x-coordinate of the second point.
 * @param {number} y2 - The y-coordinate of the second point.
 * @returns {number} The calculated radius.
 */
function calculateRadius(x1, y1, x2, y2) {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

/**
 * Calculates the center point of a circle.
 *
 * @param {number} x1 - The x-coordinate of the first point.
 * @param {number} y1 - The y-coordinate of the first point.
 * @param {number} x2 - The x-coordinate of the second point.
 * @param {number} y2 - The y-coordinate of the second point.
 * @returns {{x: number, y: number}} The calculated center coordinates.
 */
function getCircleCenter(x1, y1, x2, y2) {
  return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
}

/**
 * Generates a random hex color.
 *
 * @returns {string} The generated hex color.
 */
function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")}`;
}

/**
 * Retrieves the mouse position relative to the canvas.
 *
 * @param {HTMLCanvasElement} canvasDom - The canvas element.
 * @param {MouseEvent} mouseEvent - The mouse event.
 * @returns {{x: number, y: number}} The mouse position coordinates.
 */
function getMousePosition(canvasDom, mouseEvent) {
  const rect = canvasDom.getBoundingClientRect();
  return {
    x: (mouseEvent.clientX - rect.left) * 2,
    y: (mouseEvent.clientY - rect.top) * 2,
  };
}

/**
 * Checks if a point is inside a circle.
 *
 * @param {number} pointX - The x-coordinate of the point.
 * @param {number} pointY - The y-coordinate of the point.
 * @param {Object} circle - The circle object with x, y, and radius properties.
 * @returns {boolean} True if the point is inside the circle, otherwise false.
 */
function isPointInCircle(pointX, pointY, circle) {
  const distance = Math.sqrt(
    (pointX - circle.x) ** 2 + (pointY - circle.y) ** 2
  );
  return distance <= circle.radius;
}

/**
 * Draws a circle on the canvas and stores its data.
 *
 * @param {number} x - The x-coordinate of the circle's center.
 * @param {number} y - The y-coordinate of the circle's center.
 * @param {number} radius - The radius of the circle.
 * @param {string} color - The color of the circle.
 * @param {boolean} [isReDraw=false] - Whether this is part of a redraw operation.
 */
function drawCircle(x, y, radius, color, isReDraw = false) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();
  if (!isReDraw) circles.push({ x, y, radius, color });
}

/**
 * Redraws all circles currently stored in the circles array.
 */
function redrawCircles() {
  resetCanvas(); // Clear the canvas
  circles.forEach((circle) =>
    drawCircle(circle.x, circle.y, circle.radius, circle.color, true)
  );
}

/**
 * Adjusts the canvas width based on window size.
 */
function adjustCanvasSize() {
  const width = window.innerWidth - 18;
  canvas.style.width = `${width}px`;
  canvas.width = width * 2;
}
window.addEventListener("load", adjustCanvasSize);

/**
 * Resets the canvas by clearing all content.
 */
function resetCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Updates the hit/miss notification display.
 *
 * @param {boolean} hit - Whether the click was a hit or miss.
 * @param {MouseEvent} e - The mouse event.
 */
function updateHitMissNotification(hit, e) {
  notify.classList.add("show");
  hitMissText.textContent = hit ? "Hit" : "Miss";
  hitMissText.style.color = hit ? "red" : "green";

  if (hit) {
    confirmDelete.style.top = `${e.clientY}px`;
    confirmDelete.style.left = `${e.clientX}px`;
    confirmDelete.style.display = "block";
  } else {
    confirmDelete.style.display = "none";
  }
}

// Hide notification on click
notify.addEventListener("click", () => notify.classList.remove("show"));
