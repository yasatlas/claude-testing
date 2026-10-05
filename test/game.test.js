'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  createBoard,
  getWinner,
  isDraw,
  isGameOver,
  makeMove,
  renderBoard,
} = require('../src/game');

test('createBoard returns 9 empty cells', () => {
  const board = createBoard();
  assert.equal(board.length, 9);
  assert.ok(board.every((cell) => cell === null));
});

test('makeMove places a symbol on an empty cell', () => {
  const board = createBoard();
  const next = makeMove(board, 4, 'X');
  assert.equal(next[4], 'X');
  // original board is left untouched
  assert.equal(board[4], null);
});

test('makeMove rejects an occupied cell', () => {
  let board = createBoard();
  board = makeMove(board, 0, 'X');
  assert.throws(() => makeMove(board, 0, 'O'), /already occupied/);
});

test('makeMove rejects an out-of-bounds index', () => {
  const board = createBoard();
  assert.throws(() => makeMove(board, 9, 'X'), /out of bounds/);
  assert.throws(() => makeMove(board, -1, 'X'), /out of bounds/);
});

test('makeMove rejects an invalid symbol', () => {
  const board = createBoard();
  assert.throws(() => makeMove(board, 0, 'Z'), /must be 'X' or 'O'/);
});

test('makeMove rejects a move once the game is over', () => {
  let board = createBoard();
  for (const [index, symbol] of [
    [0, 'X'],
    [3, 'O'],
    [1, 'X'],
    [4, 'O'],
    [2, 'X'], // X wins top row
  ]) {
    board = makeMove(board, index, symbol);
  }
  assert.throws(() => makeMove(board, 5, 'O'), /already over/);
});

test('getWinner detects a row win', () => {
  let board = createBoard();
  for (const index of [0, 1, 2]) board = makeMove(board, index, 'X');
  assert.equal(getWinner(board), 'X');
});

test('getWinner detects a column win', () => {
  let board = createBoard();
  for (const index of [0, 3, 6]) board = makeMove(board, index, 'O');
  assert.equal(getWinner(board), 'O');
});

test('getWinner detects a diagonal win', () => {
  let board = createBoard();
  for (const index of [0, 4, 8]) board = makeMove(board, index, 'X');
  assert.equal(getWinner(board), 'X');
});

test('getWinner returns null when there is no winner', () => {
  const board = createBoard();
  assert.equal(getWinner(board), null);
});

test('isDraw is true for a full board with no winner', () => {
  // X | O | X
  // X | O | O
  // O | X | X
  let board = createBoard();
  const moves = [
    [0, 'X'],
    [1, 'O'],
    [2, 'X'],
    [4, 'O'],
    [3, 'X'],
    [5, 'O'],
    [7, 'X'],
    [6, 'O'],
    [8, 'X'],
  ];
  for (const [index, symbol] of moves) board = makeMove(board, index, symbol);
  assert.equal(isDraw(board), true);
  assert.equal(getWinner(board), null);
});

test('isDraw is false when the board still has empty cells', () => {
  const board = createBoard();
  assert.equal(isDraw(board), false);
});

test('isGameOver is true on a win and on a draw, false otherwise', () => {
  const empty = createBoard();
  assert.equal(isGameOver(empty), false);

  let won = createBoard();
  for (const index of [0, 1, 2]) won = makeMove(won, index, 'X');
  assert.equal(isGameOver(won), true);
});

test('renderBoard shows symbols for played cells and numbers for empty ones', () => {
  let board = createBoard();
  board = makeMove(board, 0, 'X');
  board = makeMove(board, 4, 'O');
  const rendered = renderBoard(board);

  assert.ok(rendered.includes('X'));
  assert.ok(rendered.includes('O'));
  assert.ok(rendered.includes('2')); // empty cell at index 1 shows its 1-based position
  assert.ok(rendered.includes('9')); // empty cell at index 8 shows its 1-based position
});
