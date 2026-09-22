// Pure game logic for Tic Tac Toe, kept free of DOM/browser dependencies
// so it can be reused in the browser (via a <script> tag) and unit tested
// under Node.js.

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

function createEmptyBoard() {
  return Array(9).fill(null);
}

// Returns { winner: 'X' | 'O', line: [a, b, c] } if there is a winner,
// otherwise null.
function getWinner(board) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line };
    }
  }
  return null;
}

function isBoardFull(board) {
  return board.every((cell) => cell !== null);
}

// Applies a move for `player` at `index` and returns a new board.
// Throws if the move is invalid (out of range or cell already taken).
function applyMove(board, index, player) {
  if (index < 0 || index > 8) {
    throw new Error(`Invalid cell index: ${index}`);
  }
  if (board[index] !== null) {
    throw new Error(`Cell ${index} is already taken`);
  }
  const next = board.slice();
  next[index] = player;
  return next;
}

function getNextPlayer(current) {
  return current === "X" ? "O" : "X";
}

// Computes the overall game status for a board.
// Returns one of:
//   { status: 'in-progress' }
//   { status: 'win', winner, line }
//   { status: 'draw' }
function getGameStatus(board) {
  const result = getWinner(board);
  if (result) {
    return { status: "win", winner: result.winner, line: result.line };
  }
  if (isBoardFull(board)) {
    return { status: "draw" };
  }
  return { status: "in-progress" };
}

const api = {
  WINNING_LINES,
  createEmptyBoard,
  getWinner,
  isBoardFull,
  applyMove,
  getNextPlayer,
  getGameStatus,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
}
if (typeof window !== "undefined") {
  window.TicTacToe = api;
}
