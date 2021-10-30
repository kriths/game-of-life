import './index.css';
import Grid from './grid';

const TICK_INTERVAL = 100;

if (process.env.NODE_ENV === 'development') {
  document.getElementById('debug').style.display = 'block';
}

// Initialize canvas once when loading the page using the screen's size.
// Create the canvas 10% bigger than the screen size and center it so that
// it overflows roughly equally off all sides of the page.
// This creates the illusion of an infinite canvas because cells might flow in
// and out of the visible area.
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const canvasHeight = Math.floor(window.screen.height * 1.1);
const canvasWidth = Math.floor(window.screen.width * 1.1);
canvas.height = canvasHeight;
canvas.width = canvasWidth;
canvas.style.height = `${canvasHeight}px`;
canvas.style.width = `${canvasWidth}px`;
canvas.style.top = `-${canvasHeight * 0.05}px`;
canvas.style.left = `-${canvasWidth * 0.05}px`;

// Application state
let grid = new Grid(canvas);
let nextIteration: number | null = null;

function tick() {
  grid.tickAndRender();
  nextIteration = window.setTimeout(tick, TICK_INTERVAL);
}

function stop() {
  window.clearTimeout(nextIteration);
  nextIteration = null;
}

document.addEventListener('keypress', (e) => {
  switch (e.key.toLowerCase()) {
    case 'p':
      if (nextIteration) {
        stop();
      } else {
        tick();
      }
      break;
    case 'r':
      stop();
      grid = new Grid(canvas);
      tick();
      break;
    default:
      // No further listeners
  }
});

tick();
