// Wires the TicTacToe game logic (game.js) up to the DOM.
(function () {
  const { createEmptyBoard, getGameStatus, isValidMove, makeMove } = window.TicTacToe;

  const boardEl = document.getElementById("board");
  const statusEl = document.getElementById("status");
  const resetBtn = document.getElementById("reset");

  let board = createEmptyBoard();
  let currentPlayer = "X";
  let gameOver = false;

  function render() {
    boardEl.innerHTML = "";
    const status = getGameStatus(board);
    const winningLine = status && status.line ? status.line : [];

    board.forEach((value, index) => {
      const cell = document.createElement("button");
      cell.className = "cell" + (winningLine.includes(index) ? " win" : "");
      cell.textContent = value || "";
      cell.disabled = gameOver || value !== null;
      cell.setAttribute("aria-label", `Cell ${index + 1}`);
      cell.addEventListener("click", () => handleMove(index));
      boardEl.appendChild(cell);
    });

    if (status && status.winner) {
      statusEl.textContent = `Player ${status.winner} wins!`;
    } else if (status && status.draw) {
      statusEl.textContent = "It's a draw!";
    } else {
      statusEl.textContent = `Player ${currentPlayer}'s turn`;
    }
  }

  function handleMove(index) {
    if (gameOver || !isValidMove(board, index)) {
      return;
    }
    board = makeMove(board, index, currentPlayer);
    const status = getGameStatus(board);
    if (status) {
      gameOver = true;
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
    render();
  }

  function reset() {
    board = createEmptyBoard();
    currentPlayer = "X";
    gameOver = false;
    render();
  }

  resetBtn.addEventListener("click", reset);
  render();
})();
