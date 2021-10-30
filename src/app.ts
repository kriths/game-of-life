import Grid from './grid';
import DragDirection from './dragListener/direction';
import DragListener from './dragListener';

const TICK_INTERVAL = 100;

/**
 * Initialize canvas once when loading the page using the screen's size.
 * Create the canvas 10% bigger than the screen size and center it so that
 * it overflows roughly equally off all sides of the page.
 * This creates the illusion of an infinite canvas because cells might flow in
 * and out of the visible area.
 */
function initCanvas(): HTMLCanvasElement {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const canvasHeight = Math.floor(window.screen.height * 1.1);
  const canvasWidth = Math.floor(window.screen.width * 1.1);
  canvas.height = canvasHeight;
  canvas.width = canvasWidth;
  canvas.style.height = `${canvasHeight}px`;
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.top = `-${canvasHeight * 0.05}px`;
  canvas.style.left = `-${canvasWidth * 0.05}px`;
  return canvas;
}

export default class App {
  private readonly canvas: HTMLCanvasElement;

  private readonly dragListener: DragListener;

  private grid: Grid;

  private nextIteration?: number;

  constructor() {
    this.canvas = initCanvas();
    this.grid = new Grid(this.canvas);

    this.tick = this.tick.bind(this);
    this.dragListener = new DragListener(this.onDrag.bind(this), this.canvas);
    document.addEventListener('keypress', this.onKeypress.bind(this));
  }

  private onDrag(clientX: number, clientY: number, direction: DragDirection) {
    const canvasBox = this.canvas.getBoundingClientRect();
    const x = clientX - canvasBox.left;
    const y = clientY - canvasBox.top;
    this.grid.spawnBlinker(x, y, direction);
  }

  private onKeypress(e: KeyboardEvent) {
    switch (e.key.toLowerCase()) {
      case 'p':
        if (this.nextIteration) {
          this.stop();
        } else {
          this.tick();
        }
        break;
      case 'r':
        this.stop();
        this.grid = new Grid(this.canvas);
        this.tick();
        break;
      default:
        // No further listeners
    }
  }

  private stop() {
    window.clearTimeout(this.nextIteration);
    this.nextIteration = null;
  }

  public tick() {
    this.grid.tickAndRender();
    this.nextIteration = window.setTimeout(this.tick, TICK_INTERVAL);
  }
}
