// Core Tic Tac Toe game logic.
// Works both in the browser (as a global `TicTacToe`) and in Node.js (via module.exports).

(function (root) {
  const WINNING_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];

  function createEmptyBoard() {
    return Array(9).fill(null);
  }

  // Returns { winner: 'X'|'O', line: [a,b,c] } if there is a winner,
  // 'draw' if the board is full with no winner, or null if the game continues.
  function getGameStatus(board) {
    for (const [a, b, c] of WINNING_LINES) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: [a, b, c] };
      }
    }
    if (board.every((cell) => cell !== null)) {
      return { winner: null, line: null, draw: true };
    }
    return null;
  }

  function isValidMove(board, index) {
    return (
      Number.isInteger(index) &&
      index >= 0 &&
      index < board.length &&
      board[index] === null
    );
  }

  // Returns a new board with the move applied. Throws if the move is invalid.
  function makeMove(board, index, player) {
    if (!isValidMove(board, index)) {
      throw new Error(`Invalid move: cell ${index} is not available`);
    }
    const next = board.slice();
    next[index] = player;
    return next;
  }

  const TicTacToe = {
    WINNING_LINES,
    createEmptyBoard,
    getGameStatus,
    isValidMove,
    makeMove,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = TicTacToe;
  } else {
    root.TicTacToe = TicTacToe;
  }
})(typeof window !== "undefined" ? window : globalThis);
