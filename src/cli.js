'use strict';

const readline = require('readline');
const { createBoard, makeMove, getWinner, isDraw, isGameOver, renderBoard } = require('./game');

/**
 * Runs an interactive two-player Tic-Tac-Toe session over the given
 * input/output streams (defaults to the process's stdin/stdout).
 *
 * Uses the readline interface's 'line' event, rather than chained
 * `rl.question()` calls, so the game also works correctly when stdin is a
 * non-interactive pipe (e.g. piped input in tests or scripts) and not just
 * a TTY.
 */
function playGame({ input = process.stdin, output = process.stdout } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input, output });
    let board = createBoard();
    let symbol = 'X';

    const prompt = () => rl.setPrompt(`Player ${symbol}, enter a cell (1-9): `) || rl.prompt();

    output.write("Let's play Tic-Tac-Toe!\n\n");
    output.write(`${renderBoard(board)}\n`);
    prompt();

    rl.on('line', (line) => {
      const index = Number.parseInt(line, 10) - 1;

      if (!Number.isInteger(index) || index < 0 || index >= board.length) {
        output.write('Please enter a number between 1 and 9.\n');
        prompt();
        return;
      }
      if (board[index] !== null) {
        output.write('That cell is already taken. Choose another one.\n');
        prompt();
        return;
      }

      board = makeMove(board, index, symbol);
      output.write(`\n${renderBoard(board)}\n\n`);

      const winner = getWinner(board);
      if (winner) {
        output.write(`Player ${winner} wins!\n`);
        rl.close();
        return;
      }
      if (isDraw(board)) {
        output.write("It's a draw!\n");
        rl.close();
        return;
      }

      symbol = symbol === 'X' ? 'O' : 'X';
      prompt();
    });

    rl.on('close', () => resolve(board));
  });
}

if (require.main === module) {
  playGame();
}

module.exports = { playGame };
