(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(require('./constants'));
  } else {
    root.TicTacToe = root.TicTacToe || {};
    root.TicTacToe.Board = factory(root.TicTacToe.constants);
  }
})(typeof window !== 'undefined' ? window : globalThis, function (constants) {
  const { EMPTY, WINNING_COMBINATIONS } = constants;

  class Board {
    constructor(cells = Array(9).fill(EMPTY)) {
      this.cells = cells.slice();
    }

    getCells() {
      return this.cells.slice();
    }

    isCellEmpty(index) {
      this.assertValidIndex(index);
      return this.cells[index] === EMPTY;
    }

    placeMark(index, mark) {
      this.assertValidIndex(index);
      if (!this.isCellEmpty(index)) {
        throw new Error(`Cell ${index} is already occupied`);
      }
      this.cells[index] = mark;
    }

    getAvailableMoves() {
      return this.cells
        .map((cell, index) => (cell === EMPTY ? index : null))
        .filter((index) => index !== null);
    }

    isFull() {
      return this.getAvailableMoves().length === 0;
    }

    getWinner() {
      for (const combination of WINNING_COMBINATIONS) {
        const [a, b, c] = combination;
        if (
          this.cells[a] !== EMPTY &&
          this.cells[a] === this.cells[b] &&
          this.cells[b] === this.cells[c]
        ) {
          return { mark: this.cells[a], combination };
        }
      }
      return null;
    }

    clone() {
      return new Board(this.cells);
    }

    reset() {
      this.cells = Array(9).fill(EMPTY);
    }

    assertValidIndex(index) {
      if (!Number.isInteger(index) || index < 0 || index > 8) {
        throw new Error(`Invalid cell index: ${index}`);
      }
    }
  }

  return Board;
});
