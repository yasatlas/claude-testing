(function () {
  const { constants, Player, AI, Game, Scoreboard } = window.TicTacToe;
  const { PLAYER_X, PLAYER_O } = constants;

  document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const statusElement = document.getElementById('status');
    const resetButton = document.getElementById('reset-button');
    const scoreXElement = document.getElementById('score-x');
    const scoreOElement = document.getElementById('score-o');
    const scoreDrawElement = document.getElementById('score-draw');

    const human = new Player('You', PLAYER_X, Player.TYPES.HUMAN);
    const computer = new Player('Computer', PLAYER_O, Player.TYPES.AI);
    const scoreboard = new Scoreboard();

    let game = new Game(human, computer);

    function renderScores() {
      const scores = scoreboard.getScores();
      scoreXElement.textContent = String(scores[PLAYER_X]);
      scoreOElement.textContent = String(scores[PLAYER_O]);
      scoreDrawElement.textContent = String(scores.draws);
    }

    function renderBoard() {
      const cells = game.board.getCells();
      boardElement.querySelectorAll('.cell').forEach((cellEl, index) => {
        cellEl.textContent = cells[index] || '';
        const isWinningCell = Boolean(
          game.winningCombination && game.winningCombination.includes(index)
        );
        cellEl.classList.toggle('winning', isWinningCell);
        cellEl.disabled = Boolean(cells[index]) || game.isOver();
      });
    }

    function renderStatus() {
      if (game.status === Game.STATUS.WON) {
        statusElement.textContent = `${game.winner.name} wins!`;
      } else if (game.status === Game.STATUS.DRAW) {
        statusElement.textContent = "It's a draw!";
      } else {
        statusElement.textContent = `${game.getCurrentPlayer().name}'s turn (${game.currentMark})`;
      }
    }

    function handleGameEnd() {
      if (game.status === Game.STATUS.WON) {
        scoreboard.recordWin(game.winner.mark);
      } else if (game.status === Game.STATUS.DRAW) {
        scoreboard.recordDraw();
      }
      renderScores();
    }

    function maybeTakeAiTurn() {
      const currentPlayer = game.getCurrentPlayer();
      if (game.isOver() || !currentPlayer.isAI()) {
        return;
      }

      window.setTimeout(() => {
        const move = AI.getBestMove(game.board, currentPlayer.mark);
        if (move !== null) {
          game.play(move);
        }
        renderBoard();
        renderStatus();
        if (game.isOver()) {
          handleGameEnd();
        }
      }, 300);
    }

    function handleCellClick(event) {
      const index = Number(event.target.dataset.index);
      const currentPlayer = game.getCurrentPlayer();

      if (game.isOver() || currentPlayer.isAI() || !game.board.isCellEmpty(index)) {
        return;
      }

      game.play(index);
      renderBoard();
      renderStatus();

      if (game.isOver()) {
        handleGameEnd();
      } else {
        maybeTakeAiTurn();
      }
    }

    function newGame() {
      game = new Game(human, computer);
      renderBoard();
      renderStatus();
    }

    boardElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('cell')) {
        handleCellClick(event);
      }
    });

    resetButton.addEventListener('click', newGame);

    renderBoard();
    renderStatus();
    renderScores();
  });
})();
