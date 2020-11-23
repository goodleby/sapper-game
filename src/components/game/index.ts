import { getMatrix } from '../../libs/matrices';
import { getRandNum } from '../../libs/math';
import { GameCoordinates } from '../../interfaces';
import { Cell, Mine, Step } from '../cell';

export class Game {
  _play: boolean;
  area: number;
  root: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  field: Cell[][];

  fieldSize = 10;
  cellSize = 30;
  mines = 15;

  constructor(selector: string) {
    this.area = this.fieldSize ** 2;
    this.root = document.querySelector(selector);
    this.root.innerHTML = '';

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = this.fieldSize * this.cellSize;
    this.ctx = this.canvas.getContext('2d');

    this.root.append(this.canvas);

    this.field = getMatrix(this.fieldSize, this.fieldSize, (x, y) => new Cell(x, y));

    this.canvas.addEventListener('click', (e) => this.handleMove(e));
    this.canvas.addEventListener('contextmenu', (e) => this.handleFlag(e));

    this.createMines();
    this.renderField();
    this.play();
  }

  play() {
    this._play = true;
  }

  pause() {
    this._play = false;
  }

  lose() {
    this.pause();
    this.renderMines();
    console.log('Sorry, you lost');
  }

  win() {
    this.pause();
    this.renderMines(false);
    console.log('You won!');
  }

  getRandCoords(): GameCoordinates {
    const skipCells: number[] = [];

    this.field.forEach((row) => {
      const cells = row
        .filter(
          ({ x, y }) => this.checkMine(x, y) || this.checkStep(x, y) || this.checkFlag(x, y)
        )
        .map(({ x, y }) => x + y * this.fieldSize);
      skipCells.push(...cells);
    });

    const cellIndex = getRandNum(0, this.area - 1, skipCells);
    const y = Math.floor(cellIndex / this.fieldSize);
    const x = cellIndex - y * this.fieldSize;

    return { x, y };
  }

  getSurroundingCells(x: number, y: number): Cell[] {
    const { field, fieldSize } = this;
    const cells: Cell[] = [];
    for (let sy = Math.max(y - 1, 0); sy <= Math.min(y + 1, fieldSize - 1); sy++) {
      for (let sx = Math.max(x - 1, 0); sx <= Math.min(x + 1, fieldSize - 1); sx++) {
        if (sx === x && sy === y) continue;
        cells.push(field[sy][sx]);
      }
    }
    return cells;
  }

  renderField() {
    const { fieldSize, ctx, cellSize } = this;
    ctx.fillStyle = '#000';
    for (let x = 0; x < fieldSize; x++) {
      for (let y = 0; y < fieldSize; y++) {
        ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
      }
    }
  }

  clearField() {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);
  }

  renderMines(exploded = true) {
    const { cellSize, ctx, field } = this;
    ctx.fillStyle = exploded ? '#f22' : '#2f2';
    field.forEach((row) =>
      row.forEach(({ x, y }) => {
        if (this.checkMine(x, y)) {
          ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
        }
      })
    );
  }

  createMines() {
    for (let i = 0; i < this.mines; i++) {
      const { x, y } = this.getRandCoords();
      this.field[y][x] = new Mine(x, y);
    }
  }

  checkMine(x: number, y: number): boolean {
    return this.field[y][x] instanceof Mine;
  }

  checkFlag(x: number, y: number) {
    return this.field[y][x].flagged;
  }

  renderStep(step: Step) {
    const { x, y } = step;
    const { cellSize, ctx } = this;
    ctx.fillStyle = '#aaa';
    ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
    if (step.mines > 0) {
      ctx.fillStyle = '#000';
      ctx.font = '25px Arial';
      ctx.fillText(step.mines.toString(), x * cellSize + 8, y * cellSize + cellSize - 7);
    }
  }

  step(x: number, y: number) {
    const surrouding = this.getSurroundingCells(x, y);
    const mines = surrouding.filter(({ x, y }) => this.checkMine(x, y)).length;
    const step = new Step(x, y, mines);
    this.field[y][x] = step;
    this.renderStep(step);
    if (mines === 0) {
      surrouding
        .filter(({ x, y }) => !this.checkStep(x, y))
        .forEach(({ x, y }) => this.step(x, y));
    }
  }

  checkStep(x: number, y: number) {
    return this.field[y][x] instanceof Step;
  }

  renderFlag(cell: Cell) {
    const { x, y } = cell;
    const { ctx, cellSize } = this;
    if (cell.flagged) {
      ctx.fillStyle = '#ff2';
      ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
    } else {
      ctx.fillStyle = '#000';
      ctx.fillRect(x * cellSize + 1, y * cellSize + 1, cellSize - 2, cellSize - 2);
    }
  }

  toggleFlag(x: number, y: number) {
    const cell = this.field[y][x];
    cell.toggleFlag();
    this.renderFlag(cell);
  }

  checkWin(): boolean {
    return this.field.every((row) =>
      row.every(({ x, y }) => this.checkStep(x, y) || this.checkMine(x, y))
    );
  }

  handleMove(e: MouseEvent) {
    if (!this._play) return;

    const x = Math.floor(e.offsetX / this.cellSize);
    const y = Math.floor(e.offsetY / this.cellSize);

    if (this.checkFlag(x, y)) return;
    if (this.checkMine(x, y)) return this.lose();
    if (this.checkStep(x, y)) return;
    this.step(x, y);
    if (this.checkWin()) this.win();
  }

  handleFlag(e: MouseEvent) {
    e.preventDefault();
    if (!this._play) return;

    const x = Math.floor(e.offsetX / this.cellSize);
    const y = Math.floor(e.offsetY / this.cellSize);

    if (this.checkStep(x, y)) return;
    this.toggleFlag(x, y);
  }
}
