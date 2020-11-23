export class Cell {
  x: number;
  y: number;

  flagged = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toggleFlag() {
    this.flagged = !this.flagged;
  }
}
