const test = require('node:test');
const assert = require('node:assert/strict');
const Board = require('../src/js/Board');
const { PLAYER_X, PLAYER_O, EMPTY } = require('../src/js/constants');

test('a new board has 9 empty cells', () => {
  const board = new Board();
  assert.deepEqual(board.getCells(), Array(9).fill(EMPTY));
});

test('placeMark fills the requested cell', () => {
  const board = new Board();
  board.placeMark(4, PLAYER_X);
  assert.equal(board.getCells()[4], PLAYER_X);
});

test('placeMark throws on an already occupied cell', () => {
  const board = new Board();
  board.placeMark(0, PLAYER_X);
  assert.throws(() => board.placeMark(0, PLAYER_O), /already occupied/);
});

test('placeMark and isCellEmpty throw on an out-of-range index', () => {
  const board = new Board();
  assert.throws(() => board.placeMark(9, PLAYER_X), /Invalid cell index/);
  assert.throws(() => board.isCellEmpty(-1), /Invalid cell index/);
});

test('getAvailableMoves lists only empty cells', () => {
  const board = new Board();
  board.placeMark(0, PLAYER_X);
  board.placeMark(1, PLAYER_O);
  assert.deepEqual(board.getAvailableMoves(), [2, 3, 4, 5, 6, 7, 8]);
});

test('isFull is false until every cell is occupied', () => {
  const board = new Board();
  const marks = [PLAYER_X, PLAYER_O, PLAYER_X, PLAYER_O, PLAYER_X, PLAYER_O, PLAYER_X, PLAYER_O, PLAYER_X];
  marks.forEach((mark, index) => {
    assert.equal(board.isFull(), false);
    board.placeMark(index, mark);
  });
  assert.equal(board.isFull(), true);
});

test('getWinner detects a row win', () => {
  const board = new Board();
  [0, 1, 2].forEach((index) => board.placeMark(index, PLAYER_X));
  const winner = board.getWinner();
  assert.equal(winner.mark, PLAYER_X);
  assert.deepEqual(winner.combination, [0, 1, 2]);
});

test('getWinner detects a column win', () => {
  const board = new Board();
  [0, 3, 6].forEach((index) => board.placeMark(index, PLAYER_O));
  const winner = board.getWinner();
  assert.equal(winner.mark, PLAYER_O);
  assert.deepEqual(winner.combination, [0, 3, 6]);
});

test('getWinner detects a diagonal win', () => {
  const board = new Board();
  [2, 4, 6].forEach((index) => board.placeMark(index, PLAYER_X));
  const winner = board.getWinner();
  assert.equal(winner.mark, PLAYER_X);
  assert.deepEqual(winner.combination, [2, 4, 6]);
});

test('getWinner returns null when there is no winner', () => {
  const board = new Board();
  board.placeMark(0, PLAYER_X);
  board.placeMark(1, PLAYER_O);
  assert.equal(board.getWinner(), null);
});

test('clone produces an independent copy', () => {
  const board = new Board();
  board.placeMark(0, PLAYER_X);
  const clone = board.clone();
  clone.placeMark(1, PLAYER_O);
  assert.equal(board.isCellEmpty(1), true);
  assert.equal(clone.isCellEmpty(1), false);
});

test('reset clears the board', () => {
  const board = new Board();
  board.placeMark(0, PLAYER_X);
  board.reset();
  assert.deepEqual(board.getCells(), Array(9).fill(EMPTY));
});
