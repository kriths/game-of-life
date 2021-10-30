import DragDirection from './direction';

interface ClickPosition {
  x: number;
  y: number;
}

type DragEventHandler = (x: number, y: number, direction: DragDirection) => void;

export default class DragListener {
  private readonly canvas: HTMLCanvasElement;

  private readonly onDrag: DragEventHandler;

  private dragStart?: ClickPosition;

  constructor(onDrag: DragEventHandler, canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.onDrag = onDrag;

    window.addEventListener('mousedown', this.onMouseDown.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  private onMouseDown(e: MouseEvent) {
    this.dragStart = {
      x: e.clientX,
      y: e.clientY,
    };
  }

  private onMouseUp(e: MouseEvent) {
    if (!this.dragStart) return;

    const { x: startX, y: startY } = this.dragStart;
    const endX = e.clientX;
    const endY = e.clientY;
    this.dragStart = null;

    const angle = Math.atan2(endY - startY, endX - startX);
    let direction: DragDirection;
    if (angle < -Math.PI / 2) direction = DragDirection.TOP_LEFT;
    else if (angle < 0) direction = DragDirection.TOP_RIGHT;
    else if (angle < Math.PI / 2) direction = DragDirection.BOT_RIGHT;
    else direction = DragDirection.BOT_LEFT;

    this.onDrag(startX, startY, direction);
  }
}
