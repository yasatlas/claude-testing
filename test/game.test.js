const test = require("node:test");
const assert = require("node:assert/strict");
const {
  createEmptyBoard,
  getWinner,
  isBoardFull,
  applyMove,
  getNextPlayer,
  getGameStatus,
} = require("../game");

test("createEmptyBoard returns 9 empty cells", () => {
  const board = createEmptyBoard();
  assert.equal(board.length, 9);
  assert.ok(board.every((cell) => cell === null));
});

test("getWinner detects a row win", () => {
  const board = ["X", "X", "X", null, "O", "O", null, null, null];
  const result = getWinner(board);
  assert.deepEqual(result, { winner: "X", line: [0, 1, 2] });
});

test("getWinner detects a column win", () => {
  const board = ["O", "X", null, "O", "X", null, "O", null, null];
  const result = getWinner(board);
  assert.deepEqual(result, { winner: "O", line: [0, 3, 6] });
});

test("getWinner detects a diagonal win", () => {
  const board = ["X", "O", "O", null, "X", null, null, null, "X"];
  const result = getWinner(board);
  assert.deepEqual(result, { winner: "X", line: [0, 4, 8] });
});

test("getWinner returns null when there is no winner", () => {
  const board = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];
  assert.equal(getWinner(board), null);
});

test("isBoardFull returns false when cells remain", () => {
  const board = createEmptyBoard();
  assert.equal(isBoardFull(board), false);
});

test("isBoardFull returns true when no cells remain", () => {
  const board = Array(9).fill("X");
  assert.equal(isBoardFull(board), true);
});

test("applyMove places a mark without mutating the original board", () => {
  const board = createEmptyBoard();
  const next = applyMove(board, 4, "X");
  assert.equal(next[4], "X");
  assert.equal(board[4], null);
});

test("applyMove throws when the cell is already taken", () => {
  const board = applyMove(createEmptyBoard(), 0, "X");
  assert.throws(() => applyMove(board, 0, "O"), /already taken/);
});

test("applyMove throws for an out-of-range index", () => {
  const board = createEmptyBoard();
  assert.throws(() => applyMove(board, 9, "X"), /Invalid cell index/);
});

test("getNextPlayer alternates between X and O", () => {
  assert.equal(getNextPlayer("X"), "O");
  assert.equal(getNextPlayer("O"), "X");
});

test("getGameStatus reports in-progress on an empty board", () => {
  assert.deepEqual(getGameStatus(createEmptyBoard()), {
    status: "in-progress",
  });
});

test("getGameStatus reports a win", () => {
  const board = ["X", "X", "X", null, "O", "O", null, null, null];
  assert.deepEqual(getGameStatus(board), {
    status: "win",
    winner: "X",
    line: [0, 1, 2],
  });
});

test("getGameStatus reports a draw", () => {
  const board = ["X", "O", "X", "X", "O", "O", "O", "X", "X"];
  assert.deepEqual(getGameStatus(board), { status: "draw" });
});
