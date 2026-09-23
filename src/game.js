'use strict';

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
 * Creates a fresh Tic-Tac-Toe game.
 * The board is a 9-element array of cells, each 'X', 'O', or null.
 * Player 'X' always moves first.
 */
function createGame() {
  return {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    winningLine: null,
  };
}

/**
 * Returns the winning line (array of 3 indexes) if there is a winner, otherwise null.
 */
function findWinningLine(board) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return line;
    }
  }
  return null;
}

function isBoardFull(board) {
  return board.every((cell) => cell !== null);
}

/**
 * Attempts to play at the given cell index for the current player.
 * Returns a new game state; does not mutate the input state.
 * Throws an Error if the move is invalid (out of range, occupied cell, or game already over).
 */
function play(game, index) {
  if (!Number.isInteger(index) || index < 0 || index > 8) {
    throw new Error(`Invalid cell index: ${index}. Must be an integer between 0 and 8.`);
  }
  if (game.winner || isBoardFull(game.board)) {
    throw new Error('Game is already over.');
  }
  if (game.board[index] !== null) {
    throw new Error(`Cell ${index} is already occupied.`);
  }

  const board = game.board.slice();
  board[index] = game.currentPlayer;

  const winningLine = findWinningLine(board);
  const winner = winningLine ? game.currentPlayer : null;

  return {
    board,
    currentPlayer: game.currentPlayer === 'X' ? 'O' : 'X',
    winner,
    winningLine,
  };
}

/**
 * Returns true if the game has ended, either by a win or a draw.
 */
function isGameOver(game) {
  return Boolean(game.winner) || isBoardFull(game.board);
}

/**
 * Returns true if the game ended in a draw (board full, no winner).
 */
function isDraw(game) {
  return !game.winner && isBoardFull(game.board);
}

/**
 * Renders the board as a human-readable string, e.g.:
 *  X | O | X
 * -----------
 *  O | X | O
 * -----------
 *  X |   | O
 */
function renderBoard(board) {
  const cell = (i) => (board[i] === null ? ' ' : board[i]);
  const rows = [];
  for (let r = 0; r < 3; r += 1) {
    const i = r * 3;
    rows.push(` ${cell(i)} | ${cell(i + 1)} | ${cell(i + 2)} `);
  }
  return rows.join('\n-----------\n');
}

module.exports = {
  createGame,
  play,
  isGameOver,
  isDraw,
  findWinningLine,
  renderBoard,
  WINNING_LINES,
};
