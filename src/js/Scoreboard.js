(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory(require('./storage'));
  } else {
    root.TicTacToe = root.TicTacToe || {};
    root.TicTacToe.Scoreboard = factory(root.TicTacToe.storage);
  }
})(typeof window !== 'undefined' ? window : globalThis, function (storage) {
  const STORAGE_KEY = 'scoreboard';
  const DEFAULT_SCORES = { X: 0, O: 0, draws: 0 };

  class Scoreboard {
    constructor(persist = true) {
      this.persist = persist;
      this.scores = persist
        ? storage.load(STORAGE_KEY, { ...DEFAULT_SCORES })
        : { ...DEFAULT_SCORES };
    }

    recordWin(mark) {
      if (!(mark in this.scores)) {
        throw new Error(`Unknown mark: ${mark}`);
      }
      this.scores[mark] += 1;
      this.save();
    }

    recordDraw() {
      this.scores.draws += 1;
      this.save();
    }

    getScores() {
      return { ...this.scores };
    }

    reset() {
      this.scores = { ...DEFAULT_SCORES };
      this.save();
    }

    save() {
      if (this.persist) {
        storage.save(STORAGE_KEY, this.scores);
      }
    }
  }

  return Scoreboard;
});
