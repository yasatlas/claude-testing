(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.TicTacToe = root.TicTacToe || {};
    root.TicTacToe.constants = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const PLAYER_X = 'X';
  const PLAYER_O = 'O';
  const EMPTY = null;

  const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return { PLAYER_X, PLAYER_O, EMPTY, WINNING_COMBINATIONS };
});
