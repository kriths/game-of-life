import { circularMean } from './util/math';
import DragDirection from './dragListener/direction';

const SQUARE_SIZE = 4;

/**
 * Valid colors are integers in range [0, 360[
 */
type Cell = number;
const DEAD = -1;

export default class Grid {
  private readonly canvas: HTMLCanvasElement;

  private readonly height: number;

  private readonly width: number;

  private grid: Int16Array;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.height = Math.floor(canvas.height / SQUARE_SIZE);
    this.width = Math.floor(canvas.width / SQUARE_SIZE);

    this.randomizeGrid();
  }

  /**
   * (Re-)initialize grid with random values.
   */
  private randomizeGrid() {
    this.grid = new Int16Array(this.height * this.width);
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const alive = Math.random() < 0.5;
        this.setCell(x, y, alive ? (Math.random() * 360) : DEAD);
      }
    }
  }

  private getCellUnsafe(x: number, y: number): Cell {
    return this.grid[(y * this.width) + x];
  }

  private getCell(x: number, y: number): Cell {
    if (x < 0 || x > this.width || y < 0 || y > this.height) return DEAD;
    return this.getCellUnsafe(x, y);
  }

  private setCell(x: number, y: number, value: Cell) {
    this.grid[(y * this.width) + x] = value;
  }

  /**
   * Clear canvas and render current grid layout
   */
  private render() {
    const context = this.canvas.getContext('2d');
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        const cell = this.getCellUnsafe(x, y);
        if (cell !== DEAD) {
          context.fillStyle = `hsl(${cell}, 65%, 50%)`;
          context.fillRect(
            x * SQUARE_SIZE, y * SQUARE_SIZE,
            SQUARE_SIZE, SQUARE_SIZE,
          );
        }
      }
    }
  }

  private updateCell(x: number, y: number): Cell {
    const neighbors: Cell[] = [
      this.getCell(x - 1, y - 1), this.getCell(x, y - 1), this.getCell(x + 1, y - 1),
      this.getCell(x - 1, y), this.getCell(x + 1, y),
      this.getCell(x - 1, y + 1), this.getCell(x, y + 1), this.getCell(x + 1, y + 1),
    ];

    const aliveNeighbors = neighbors.filter((n) => n !== DEAD);
    if (aliveNeighbors.length < 2 || aliveNeighbors.length > 3) return DEAD;

    const current = this.getCellUnsafe(x, y);
    if (current !== DEAD || (aliveNeighbors.length === 2)) return current;

    return circularMean(aliveNeighbors[0], aliveNeighbors[1], aliveNeighbors[2]);
  }

  private tick() {
    const target = new Int16Array(this.grid.length);
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        target[(y * this.width) + x] = this.updateCell(x, y);
      }
    }
    this.grid = target;
  }

  public tickAndRender() {
    const startTime = performance.now();

    this.tick();
    const tickTime = performance.now() - startTime;

    this.render();
    const renderTime = performance.now() - startTime - tickTime;

    document.getElementById('time-tick').innerText = `${tickTime}`;
    document.getElementById('time-render').innerText = `${renderTime}`;
    if (process.env.NODE_ENV === 'development') {
      const aliveCells = this.grid.filter((c) => c !== DEAD);
      const hueSum = aliveCells.reduce((a, b) => a + b, 0);
      const hueAvg = hueSum / aliveCells.length;
      document.getElementById('hue-avg').innerText = `${hueAvg}`;
    }
  }

  public spawnBlinker(canvasX: number, canvasY: number, direction: DragDirection) {
    const gridX = Math.round(canvasX / SQUARE_SIZE);
    const gridY = Math.round(canvasY / SQUARE_SIZE);
    const color = Math.random() * 360;

    const glider = {
      [DragDirection.TOP_RIGHT]: [[true, false, false], [true, false, true], [true, true, false]],
      [DragDirection.BOT_RIGHT]: [[false, true, false], [false, false, true], [true, true, true]],
      [DragDirection.BOT_LEFT]: [[false, true, true], [true, false, true], [false, false, true]],
      [DragDirection.TOP_LEFT]: [[true, true, true], [true, false, false], [false, true, false]],
    }[direction];

    for (let x = 0; x < 3; x += 1) {
      for (let y = 0; y < 3; y += 1) {
        this.setCell(gridX - 1 + x, gridY - 1 + y, glider[x][y] ? color : DEAD);
      }
    }
  }
}
