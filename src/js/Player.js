(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();
  } else {
    root.TicTacToe = root.TicTacToe || {};
    root.TicTacToe.Player = factory();
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  const TYPES = {
    HUMAN: 'human',
    AI: 'ai',
  };

  class Player {
    constructor(name, mark, type = TYPES.HUMAN) {
      this.name = name;
      this.mark = mark;
      this.type = type;
    }

    isAI() {
      return this.type === TYPES.AI;
    }

    isHuman() {
      return this.type === TYPES.HUMAN;
    }
  }

  Player.TYPES = TYPES;

  return Player;
});
