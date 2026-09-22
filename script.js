// Browser wiring: connects the pure game logic in game.js to the DOM.
(function () {
  const { createEmptyBoard, applyMove, getNextPlayer, getGameStatus } =
    window.TicTacToe;

  const boardEl = document.getElementById("board");
  const statusEl = document.getElementById("status");
  const resetButton = document.getElementById("reset");

  let board = createEmptyBoard();
  let currentPlayer = "X";
  let gameOver = false;

  function render() {
    boardEl.innerHTML = "";
    const status = getGameStatus(board);
    const winningLine = status.status === "win" ? status.line : [];

    board.forEach((value, index) => {
      const cell = document.createElement("button");
      cell.className = "cell";
      cell.textContent = value ?? "";
      cell.setAttribute("aria-label", `Cell ${index + 1}`);
      cell.disabled = value !== null || gameOver;
      if (winningLine.includes(index)) {
        cell.classList.add("win");
      }
      cell.addEventListener("click", () => handleMove(index));
      boardEl.appendChild(cell);
    });

    if (status.status === "win") {
      statusEl.textContent = `Player ${status.winner} wins!`;
      gameOver = true;
    } else if (status.status === "draw") {
      statusEl.textContent = "It's a draw!";
      gameOver = true;
    } else {
      statusEl.textContent = `Player ${currentPlayer}'s turn`;
    }
  }

  function handleMove(index) {
    if (gameOver || board[index] !== null) {
      return;
    }
    board = applyMove(board, index, currentPlayer);
    currentPlayer = getNextPlayer(currentPlayer);
    render();
  }

  function reset() {
    board = createEmptyBoard();
    currentPlayer = "X";
    gameOver = false;
    render();
  }

  resetButton.addEventListener("click", reset);

  render();
})();
