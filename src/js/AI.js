(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(require('./constants'));
  } else {
    root.TicTacToe = root.TicTacToe || {};
    root.TicTacToe.AI = factory(root.TicTacToe.constants);
  }
})(typeof window !== 'undefined' ? window : globalThis, function (constants) {
  const { PLAYER_X, PLAYER_O } = constants;

  function opponentOf(mark) {
    return mark === PLAYER_X ? PLAYER_O : PLAYER_X;
  }

  /**
   * Recursively scores a board from the perspective of `mark`.
   * Wins closer to the current move are scored higher than distant ones,
   * which makes the AI prefer the fastest win and the slowest loss.
   */
  function minimax(board, mark, turnMark, depth) {
    const winner = board.getWinner();
    if (winner) {
      return winner.mark === mark ? 10 - depth : depth - 10;
    }

    if (board.isFull()) {
      return 0;
    }

    const nextTurnMark = opponentOf(turnMark);
    const scores = board.getAvailableMoves().map((move) => {
      const nextBoard = board.clone();
      nextBoard.placeMark(move, turnMark);
      return minimax(nextBoard, mark, nextTurnMark, depth + 1);
    });

    return turnMark === mark ? Math.max(...scores) : Math.min(...scores);
  }

  /**
   * Returns the optimal next move index for `mark` on the given board,
   * or `null` if there are no moves available.
   */
  function getBestMove(board, mark) {
    const availableMoves = board.getAvailableMoves();
    if (availableMoves.length === 0) {
      return null;
    }

    let bestMove = availableMoves[0];
    let bestScore = -Infinity;

    for (const move of availableMoves) {
      const nextBoard = board.clone();
      nextBoard.placeMark(move, mark);
      const score = minimax(nextBoard, mark, opponentOf(mark), 1);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  return { getBestMove };
});
