'use strict';

const BOARD_SIZE = 9;
const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Creates a fresh, empty 3x3 board represented as a flat array of 9 cells.
 * Each cell is either 'X', 'O', or null.
 */
function createBoard() {
  return Array(BOARD_SIZE).fill(null);
}

/**
 * Returns the winning symbol ('X' or 'O') if the board has a winning line,
 * otherwise null.
 */
function getWinner(board) {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

/**
 * A board is a draw when every cell is filled and there is no winner.
 */
function isDraw(board) {
  return board.every((cell) => cell !== null) && !getWinner(board);
}

/**
 * The game is over when there is a winner or the board is a draw.
 */
function isGameOver(board) {
  return getWinner(board) !== null || isDraw(board);
}

/**
 * Attempts to place `symbol` at `index` on the board.
 * Returns a new board on success, or throws on an invalid move.
 */
function makeMove(board, index, symbol) {
  if (!Number.isInteger(index) || index < 0 || index >= BOARD_SIZE) {
    throw new Error(`Invalid move: index ${index} is out of bounds`);
  }
  if (symbol !== 'X' && symbol !== 'O') {
    throw new Error(`Invalid move: symbol must be 'X' or 'O', got ${symbol}`);
  }
  if (isGameOver(board)) {
    throw new Error('Invalid move: the game is already over');
  }
  if (board[index] !== null) {
    throw new Error(`Invalid move: cell ${index} is already occupied`);
  }

  const next = board.slice();
  next[index] = symbol;
  return next;
}

/**
 * Renders the board as a human-readable 3x3 grid string, e.g.:
 *
 *  X | O | 3
 * ---+---+---
 *  4 | X | 6
 * ---+---+---
 *  7 | 8 | O
 *
 * Empty cells show their 1-based position so players know which index to
 * pick for their next move.
 */
function renderBoard(board) {
  const cell = (i) => (board[i] === null ? String(i + 1) : board[i]);
  const row = (a, b, c) => ` ${cell(a)} | ${cell(b)} | ${cell(c)} `;
  return [row(0, 1, 2), '---+---+---', row(3, 4, 5), '---+---+---', row(6, 7, 8)].join('\n');
}

module.exports = {
  BOARD_SIZE,
  WINNING_LINES,
  createBoard,
  getWinner,
  isDraw,
  isGameOver,
  makeMove,
  renderBoard,
};
