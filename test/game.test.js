'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  createGame,
  play,
  isGameOver,
  isDraw,
  findWinningLine,
  renderBoard,
} = require('../src/game');

test('createGame returns an empty board with X starting first', () => {
  const game = createGame();
  assert.deepEqual(game.board, Array(9).fill(null));
  assert.equal(game.currentPlayer, 'X');
  assert.equal(game.winner, null);
  assert.equal(game.winningLine, null);
});

test('play places the current player mark and switches turns', () => {
  const game = createGame();
  const next = play(game, 0);
  assert.equal(next.board[0], 'X');
  assert.equal(next.currentPlayer, 'O');
  // original state is not mutated
  assert.equal(game.board[0], null);
});

test('play throws on out-of-range index', () => {
  const game = createGame();
  assert.throws(() => play(game, -1), /Invalid cell index/);
  assert.throws(() => play(game, 9), /Invalid cell index/);
  assert.throws(() => play(game, 1.5), /Invalid cell index/);
});

test('play throws when cell already occupied', () => {
  let game = createGame();
  game = play(game, 4);
  assert.throws(() => play(game, 4), /already occupied/);
});

test('play throws once the game is over', () => {
  // X wins on top row: X X X / O O .
  let game = createGame();
  game = play(game, 0); // X
  game = play(game, 3); // O
  game = play(game, 1); // X
  game = play(game, 4); // O
  game = play(game, 2); // X wins
  assert.equal(game.winner, 'X');
  assert.throws(() => play(game, 5), /Game is already over/);
});

test('detects a horizontal win', () => {
  let game = createGame();
  game = play(game, 0); // X
  game = play(game, 3); // O
  game = play(game, 1); // X
  game = play(game, 4); // O
  game = play(game, 2); // X wins top row
  assert.equal(game.winner, 'X');
  assert.deepEqual(game.winningLine, [0, 1, 2]);
  assert.equal(isGameOver(game), true);
});

test('detects a vertical win', () => {
  let game = createGame();
  game = play(game, 0); // X
  game = play(game, 1); // O
  game = play(game, 3); // X
  game = play(game, 2); // O
  game = play(game, 6); // X wins left column
  assert.equal(game.winner, 'X');
  assert.deepEqual(game.winningLine, [0, 3, 6]);
});

test('detects a diagonal win', () => {
  let game = createGame();
  game = play(game, 0); // X
  game = play(game, 1); // O
  game = play(game, 4); // X
  game = play(game, 2); // O
  game = play(game, 8); // X wins diagonal
  assert.equal(game.winner, 'X');
  assert.deepEqual(game.winningLine, [0, 4, 8]);
});

test('detects a draw with no winner', () => {
  // X | O | X
  // X | O | O
  // O | X | X
  const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
  let game = createGame();
  for (const move of moves) {
    game = play(game, move);
  }
  assert.equal(game.winner, null);
  assert.equal(isDraw(game), true);
  assert.equal(isGameOver(game), true);
});

test('findWinningLine returns null for a board with no winner', () => {
  const board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
  assert.equal(findWinningLine(board), null);
});

test('renderBoard renders a human readable grid', () => {
  const game = createGame();
  const rendered = renderBoard(game.board);
  assert.equal(
    rendered,
    '   |   |   \n-----------\n   |   |   \n-----------\n   |   |   '
  );
});
