import {
  matrixDot,
  matrixPlus,
  matrixMinus,
  matrixApply,
  linearMatrixDot,
  getMatrix,
  getMatrixClone,
  transposeMatrix,
} from '../index';

describe('matrixDot', () => {
  it('should multiply matrices', () => {
    const A = [
      [3, 2, 5],
      [6, 4, 1],
    ];
    const B = [
      [2, 6],
      [5, 3],
      [1, 4],
    ];
    const result = [
      [21, 44],
      [33, 52],
    ];
    expect(matrixDot(A, B)).toEqual(result);
  });

  it('should throw an error if one of matrices has different amount of columns in rows', () => {
    const A = [
      [3, 2, 5],
      [6, 4],
    ];
    const B = [
      [2, 6],
      [5, 3],
      [1, 4],
    ];
    expect(() => matrixDot(A, B)).toThrow();
  });

  it('should throw an error if amount of columns in the 1st matrix does not match amount of rows in the 2nd matrix', () => {
    const A = [
      [3, 2, 5],
      [6, 4, 1],
    ];
    const B = [
      [2, 6, 1],
      [5, 3, 4],
    ];
    expect(() => matrixDot(A, B)).toThrow();
  });
});

describe('matrixPlus', () => {
  it('should add matrices', () => {
    const A = [
      [5, 2],
      [3, 7],
    ];
    const B = [
      [1, 3],
      [5, 2],
    ];
    const result = [
      [6, 5],
      [8, 9],
    ];
    expect(matrixPlus(A, B)).toEqual(result);
  });

  it('should throw an error if matrices are different in size', () => {
    const A = [
      [3, 2, 5],
      [6, 4, 1],
    ];
    const B = [
      [2, 6],
      [5, 3],
      [1, 4],
    ];
    expect(() => matrixPlus(A, B)).toThrow();
  });
});

describe('matrixMinus', () => {
  it('should substract matrices', () => {
    const A = [
      [5, 2],
      [3, 7],
    ];
    const B = [
      [1, 3],
      [5, 2],
    ];
    const result = [
      [4, -1],
      [-2, 5],
    ];
    expect(matrixMinus(A, B)).toEqual(result);
  });

  it('should throw an error if matrices are different in size', () => {
    const A = [
      [3, 2, 5],
      [6, 4, 1],
    ];
    const B = [
      [2, 6],
      [5, 3],
      [1, 4],
    ];
    expect(() => matrixMinus(A, B)).toThrow();
  });
});

describe('matrixApply', () => {
  it('should apply a function to each matrix item', () => {
    const matrix = [
      [3, 2, 5],
      [6, 4, 1],
    ];
    const result = [
      [9, 4, 25],
      [36, 16, 1],
    ];
    expect(matrixApply(matrix, (num) => num ** 2)).toEqual(result);
  });
});

describe('linearMatrixDot', () => {
  it('should multiply corresponding items of matrices', () => {
    const A = [
      [5, 2],
      [3, 7],
    ];
    const B = [
      [1, 3],
      [5, 2],
    ];
    const result = [
      [5, 6],
      [15, 14],
    ];
    expect(linearMatrixDot(A, B)).toEqual(result);
  });

  it('should throw an error if matrices are different in size', () => {
    const A = [
      [3, 2, 5],
      [6, 4, 1],
    ];
    const B = [
      [2, 6],
      [5, 3],
      [1, 4],
    ];
    expect(() => linearMatrixDot(A, B)).toThrow();
  });
});

describe('getMatrix', () => {
  it('should return custom filled matrix with set `rows` and `cols`', () => {
    const rows = 2;
    const cols = 3;
    const result = [
      [3, 3, 3],
      [3, 3, 3],
    ];
    expect(getMatrix(rows, cols, () => 3)).toEqual(result);
  });

  it('should return zero-filled matrix with set `rows` and `cols` if no fill function passed', () => {
    const rows = 2;
    const cols = 3;
    const result = [
      [0, 0, 0],
      [0, 0, 0],
    ];
    expect(getMatrix(rows, cols)).toEqual(result);
  });
});

describe('getMatrixClone', () => {
  it('should return custom filled clone of passed matrix', () => {
    const matrix = [
      [3, 2, 5],
      [6, 4, 1],
    ];
    const result = [
      [3, 3, 3],
      [3, 3, 3],
    ];
    expect(getMatrixClone(matrix, () => 3)).toEqual(result);
  });

  it('should return zero-filled clone of passed matrix if no fill function passed', () => {
    const matrix = [
      [3, 2, 5],
      [6, 4, 1],
    ];
    const result = [
      [0, 0, 0],
      [0, 0, 0],
    ];
    expect(getMatrixClone(matrix)).toEqual(result);
  });
});

describe('transposeMatrix', () => {
  it('should reverse matrix shape', () => {
    const matrix = [
      [3, 2, 5],
      [6, 4, 1],
    ];
    const result = [
      [3, 6],
      [2, 4],
      [5, 1],
    ];
    expect(transposeMatrix(matrix)).toEqual(result);
  });

  it('should throw an error if passed matrix has different amount of columns in rows', () => {
    const matrix = [
      [3, 2, 5],
      [6, 4],
    ];
    expect(() => transposeMatrix(matrix)).toThrow();
  });
});
