// Simple assertion-based test suite for game.js (no external test framework needed).
// Run with: node game.test.js
const assert = require("assert");
const {
  createEmptyBoard,
  getGameStatus,
  isValidMove,
  makeMove,
} = require("./game");

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (err) {
    console.error(`FAIL - ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

test("createEmptyBoard returns 9 empty cells", () => {
  const board = createEmptyBoard();
  assert.strictEqual(board.length, 9);
  assert.ok(board.every((cell) => cell === null));
});

test("getGameStatus returns null for a fresh board", () => {
  assert.strictEqual(getGameStatus(createEmptyBoard()), null);
});

test("getGameStatus detects a row win", () => {
  const board = ["X", "X", "X", null, "O", "O", null, null, null];
  const status = getGameStatus(board);
  assert.strictEqual(status.winner, "X");
  assert.deepStrictEqual(status.line, [0, 1, 2]);
});

test("getGameStatus detects a column win", () => {
  const board = ["O", "X", null, "O", "X", null, "O", null, "X"];
  const status = getGameStatus(board);
  assert.strictEqual(status.winner, "O");
  assert.deepStrictEqual(status.line, [0, 3, 6]);
});

test("getGameStatus detects a diagonal win", () => {
  const board = ["X", "O", "O", null, "X", null, null, null, "X"];
  const status = getGameStatus(board);
  assert.strictEqual(status.winner, "X");
  assert.deepStrictEqual(status.line, [0, 4, 8]);
});

test("getGameStatus detects a draw", () => {
  const board = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];
  const status = getGameStatus(board);
  assert.strictEqual(status.winner, null);
  assert.strictEqual(status.draw, true);
});

test("isValidMove rejects occupied and out-of-range cells", () => {
  const board = createEmptyBoard();
  board[0] = "X";
  assert.strictEqual(isValidMove(board, 0), false);
  assert.strictEqual(isValidMove(board, 1), true);
  assert.strictEqual(isValidMove(board, -1), false);
  assert.strictEqual(isValidMove(board, 9), false);
});

test("makeMove places a mark without mutating the original board", () => {
  const board = createEmptyBoard();
  const next = makeMove(board, 4, "X");
  assert.strictEqual(board[4], null);
  assert.strictEqual(next[4], "X");
});

test("makeMove throws on an invalid move", () => {
  const board = createEmptyBoard();
  board[4] = "X";
  assert.throws(() => makeMove(board, 4, "O"));
});
