const SQUARE_SIZE = 4;

export default class Grid {
  private readonly canvas: HTMLCanvasElement;

  private readonly height: number;

  private readonly width: number;

  private grid: boolean[][];

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
    this.grid = new Array(this.height);
    for (let y = 0; y < this.height; y += 1) {
      const line = new Array(this.width);
      this.grid[y] = line;
      for (let x = 0; x < this.width; x += 1) {
        line[x] = Math.random() < 0.5;
      }
    }
  }

  /**
   * Clear canvas and render current grid layout
   */
  private render() {
    const context = this.canvas.getContext('2d');
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.fillStyle = 'white';
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        if (this.grid[y][x]) {
          context.fillRect(
            x * SQUARE_SIZE, y * SQUARE_SIZE,
            SQUARE_SIZE, SQUARE_SIZE,
          );
        }
      }
    }
  }

  /**
   * Count how many neighboring cells are currently alive.
   *
   * This coerces undefined to false with !!, then coerces the boolean to a
   * number by addition. It's ugly but multiple times faster than including
   * type checks.
   */
  private countCellNeighbors(x: number, y: number): number {
    // @ts-ignore
    let count: number = !!this.grid[y][x - 1] + !!this.grid[y][x + 1];
    if (y > 0) {
      // @ts-ignore
      count += !!this.grid[y - 1][x - 1] + !!this.grid[y - 1][x] + !!this.grid[y - 1][x + 1];
    }

    if (y < this.height - 1) {
      // @ts-ignore
      count += !!this.grid[y + 1][x - 1] + !!this.grid[y + 1][x] + !!this.grid[y + 1][x + 1];
    }

    return count;
  }

  private tick() {
    const target: boolean[][] = new Array(this.height);
    for (let y = 0; y < this.height; y += 1) {
      target[y] = new Array(this.width);
      for (let x = 0; x < this.width; x += 1) {
        const neighbors = this.countCellNeighbors(x, y);
        target[y][x] = (neighbors === 3) || ((neighbors === 2) && this.grid[y][x]);
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
  }
}
