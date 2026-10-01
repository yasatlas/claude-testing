(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(require('./constants'), require('./Board'));
  } else {
    root.TicTacToe = root.TicTacToe || {};
    root.TicTacToe.Game = factory(root.TicTacToe.constants, root.TicTacToe.Board);
  }
})(typeof window !== 'undefined' ? window : globalThis, function (constants, Board) {
  const { PLAYER_X, PLAYER_O } = constants;

  const STATUS = {
    IN_PROGRESS: 'in_progress',
    WON: 'won',
    DRAW: 'draw',
  };

  class Game {
    constructor(playerX, playerO) {
      this.board = new Board();
      this.players = { [PLAYER_X]: playerX, [PLAYER_O]: playerO };
      this.currentMark = PLAYER_X;
      this.status = STATUS.IN_PROGRESS;
      this.winner = null;
      this.winningCombination = null;
    }

    getCurrentPlayer() {
      return this.players[this.currentMark];
    }

    play(index) {
      if (this.isOver()) {
        throw new Error('Cannot play: the game has already ended');
      }

      this.board.placeMark(index, this.currentMark);
      this.evaluateStatus();

      if (!this.isOver()) {
        this.switchTurn();
      }

      return this.status;
    }

    evaluateStatus() {
      const result = this.board.getWinner();
      if (result) {
        this.status = STATUS.WON;
        this.winner = this.players[result.mark];
        this.winningCombination = result.combination;
        return;
      }

      if (this.board.isFull()) {
        this.status = STATUS.DRAW;
      }
    }

    switchTurn() {
      this.currentMark = this.currentMark === PLAYER_X ? PLAYER_O : PLAYER_X;
    }

    reset() {
      this.board.reset();
      this.currentMark = PLAYER_X;
      this.status = STATUS.IN_PROGRESS;
      this.winner = null;
      this.winningCombination = null;
    }

    isOver() {
      return this.status !== STATUS.IN_PROGRESS;
    }
  }

  Game.STATUS = STATUS;

  return Game;
});
