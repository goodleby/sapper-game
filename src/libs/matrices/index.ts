// Multiply matrices with math error handling
export const matrixDot = (A: number[][], B: number[][]): number[][] => {
  // Math error handling
  const matrices = [A, B];
  const cols = matrices.map((item) => item[0].length);
  if (!matrices.every((item, i) => item.every((row) => row.length === cols[i]))) {
    throw new Error('All rows in a matrix must have equal amount of columns');
  } else if (cols[0] !== B.length) {
    throw new Error(
      'Amount of columns in the 1st matrix must match amount of rows in the 2nd matrix'
    );
  }
  // Calculations
  return A.map((rowA) =>
    B[0].map((_, colBIndex) =>
      rowA.reduce((acc, itemA, rowBIndex) => acc + itemA * B[rowBIndex][colBIndex], 0)
    )
  );
};

// Add up matrices with math error handling
export const matrixPlus = (A: number[][], B: number[][]): number[][] => {
  // Math error handling
  const matrices = [A, B];
  const cols = A[0].length;
  if (
    !matrices.every((item) => item.every((row) => row.length === cols)) ||
    A.length !== B.length
  ) {
    throw new Error('Matrices must be the same size');
  }
  // Calculations
  return A.map((rowA, rowI) => rowA.map((itemA, colI) => itemA + B[rowI][colI]));
};

// Substract matrices with math error handling
export const matrixMinus = (A: number[][], B: number[][]): number[][] => {
  // Math error handling
  const matrices = [A, B];
  const cols = A[0].length;
  if (
    !matrices.every((item) => item.every((row) => row.length === cols)) ||
    A.length !== B.length
  ) {
    throw new Error('Matrices must be the same size');
  }
  // Calculations
  return A.map((rowA, rowI) => rowA.map((itemA, colI) => itemA - B[rowI][colI]));
};

// Regular multiplication between matrices' corresponding items
export const linearMatrixDot = (A: number[][], B: number[][]): number[][] => {
  // Math error handling
  const matrices = [A, B];
  const cols = A[0].length;
  if (
    !matrices.every((item) => item.every((row) => row.length === cols)) ||
    A.length !== B.length
  ) {
    throw new Error('Matrices must be the same size');
  }
  // Calculations
  return A.map((rowA, i) => rowA.map((colA, j) => colA * B[i][j]));
};

// Apply a function to each matrix item
export const matrixApply = (matrix: any[][], fn: (item: any) => any): any[][] =>
  matrix.map((row) => row.map((item) => fn(item)));

// Get custom filled matrix with set `rows` and `columns`
export const getMatrix = (
  rows: number,
  columns: number,
  fillFunction: (x: number, y: number) => any = () => 0
): any[][] =>
  Array(rows)
    .fill(0)
    .map((_, y) =>
      Array(columns)
        .fill(0)
        .map((_, x) => fillFunction(x, y))
    );

// Get custom filled matrix clone
export const getMatrixClone = (matrix: any[], fillFunction: () => any = () => 0): any[] =>
  matrix.map((item) =>
    Array.isArray(item) ? getMatrixClone(item, fillFunction) : fillFunction()
  );

// Reverse matrix shape
export const transposeMatrix = (matrix: any[][]): any[][] => {
  // Math error handling
  const cols = matrix[0].length;
  if (!matrix.every((row) => row.length === cols)) {
    throw new Error('All rows in a matrix must have equal amount of columns');
  }
  // Transformations
  return Array(cols)
    .fill(0)
    .map((_, i) => matrix.map((item) => item[i]));
};
