import Cell from './cell';

export class Step extends Cell {
  mines: number;

  constructor(x: number, y: number, mines: number) {
    super(x, y);
    this.mines = mines;
  }
}

export default Step;
