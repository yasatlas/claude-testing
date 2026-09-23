'use strict';

const readline = require('node:readline');
const { createGame, play, isGameOver, isDraw, renderBoard } = require('./game');

function promptMove(rl, game) {
  return new Promise((resolve) => {
    rl.question(`Player ${game.currentPlayer}, choose a cell (1-9): `, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  let game = createGame();

  console.log('Tic-Tac-Toe! Cells are numbered 1-9, left to right, top to bottom.\n');
  console.log(renderBoard(game.board));

  while (!isGameOver(game)) {
    // eslint-disable-next-line no-await-in-loop
    const answer = await promptMove(rl, game);
    const index = Number(answer) - 1;

    try {
      game = play(game, index);
    } catch (err) {
      console.log(`Invalid move: ${err.message}`);
      continue;
    }

    console.log(`\n${renderBoard(game.board)}\n`);
  }

  if (game.winner) {
    console.log(`Player ${game.winner} wins!`);
  } else if (isDraw(game)) {
    console.log("It's a draw!");
  }

  rl.close();
}

if (require.main === module) {
  main();
}

module.exports = { main };
