const test = require('node:test');
const assert = require('node:assert/strict');
const AI = require('../src/js/AI');
const Board = require('../src/js/Board');
const { PLAYER_X, PLAYER_O } = require('../src/js/constants');

test('getBestMove returns null when the board is full', () => {
  const board = new Board();
  const marks = [PLAYER_X, PLAYER_O, PLAYER_X, PLAYER_O, PLAYER_X, PLAYER_O, PLAYER_O, PLAYER_X, PLAYER_O];
  marks.forEach((mark, index) => board.placeMark(index, mark));
  assert.equal(AI.getBestMove(board, PLAYER_X), null);
});

test('getBestMove takes the immediate winning move', () => {
  const board = new Board();
  board.placeMark(0, PLAYER_X);
  board.placeMark(1, PLAYER_X);
  board.placeMark(3, PLAYER_O);
  board.placeMark(4, PLAYER_O);

  // X can win by completing the top row at index 2.
  assert.equal(AI.getBestMove(board, PLAYER_X), 2);
});

test('getBestMove blocks the opponent from winning', () => {
  const board = new Board();
  board.placeMark(0, PLAYER_X);
  board.placeMark(1, PLAYER_X);
  board.placeMark(3, PLAYER_O);
  board.placeMark(6, PLAYER_O);

  // O threatens to win at index 2 (top row) next; more importantly O also
  // threatens the left column (3, 6) which is already blocked by X at 0.
  // O must block X's immediate top-row win at index 2.
  assert.equal(AI.getBestMove(board, PLAYER_O), 2);
});

test('the AI never loses a full game against itself', () => {
  const board = new Board();
  let currentMark = PLAYER_X;

  while (!board.getWinner() && !board.isFull()) {
    const move = AI.getBestMove(board, currentMark);
    board.placeMark(move, currentMark);
    currentMark = currentMark === PLAYER_X ? PLAYER_O : PLAYER_X;
  }

  // Two perfect players must always draw.
  assert.equal(board.getWinner(), null);
  assert.equal(board.isFull(), true);
});

test('the AI never loses against every possible first human move', () => {
  for (let humanFirstMove = 0; humanFirstMove < 9; humanFirstMove += 1) {
    const board = new Board();
    board.placeMark(humanFirstMove, PLAYER_X);
    let currentMark = PLAYER_O;

    while (!board.getWinner() && !board.isFull()) {
      const move = AI.getBestMove(board, currentMark);
      board.placeMark(move, currentMark);
      currentMark = currentMark === PLAYER_X ? PLAYER_O : PLAYER_X;
    }

    const winner = board.getWinner();
    assert.notEqual(winner && winner.mark, PLAYER_X, `AI lost after human opened at ${humanFirstMove}`);
  }
});
