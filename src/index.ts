import './index.css';
import Grid from './grid';

const TICK_INTERVAL = 100;

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

const grid = new Grid(canvas);

function tick() {
  grid.tickAndRender();
  setTimeout(tick, TICK_INTERVAL);
}

tick();
