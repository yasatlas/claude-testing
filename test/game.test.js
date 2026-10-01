const test = require('node:test');
const assert = require('node:assert/strict');
const Game = require('../src/js/Game');
const Player = require('../src/js/Player');
const { PLAYER_X, PLAYER_O } = require('../src/js/constants');

function createGame() {
  const playerX = new Player('Alice', PLAYER_X);
  const playerO = new Player('Bob', PLAYER_O);
  return new Game(playerX, playerO);
}

test('a new game starts in progress with player X first', () => {
  const game = createGame();
  assert.equal(game.status, Game.STATUS.IN_PROGRESS);
  assert.equal(game.currentMark, PLAYER_X);
  assert.equal(game.getCurrentPlayer().name, 'Alice');
});

test('play alternates turns between players', () => {
  const game = createGame();
  game.play(0);
  assert.equal(game.currentMark, PLAYER_O);
  game.play(1);
  assert.equal(game.currentMark, PLAYER_X);
});

test('play detects a win and stops the game', () => {
  const game = createGame();
  game.play(0); // X
  game.play(3); // O
  game.play(1); // X
  game.play(4); // O
  game.play(2); // X wins top row

  assert.equal(game.status, Game.STATUS.WON);
  assert.equal(game.winner.name, 'Alice');
  assert.deepEqual(game.winningCombination, [0, 1, 2]);
});

test('play detects a draw when the board fills with no winner', () => {
  const game = createGame();
  const moves = [0, 1, 2, 4, 3, 5, 7, 6, 8];
  // X: 0,2,3,7,8  O: 1,4,5,6 -> no straight line for either player
  moves.forEach((index) => game.play(index));

  assert.equal(game.status, Game.STATUS.DRAW);
  assert.equal(game.winner, null);
});

test('play throws once the game has ended', () => {
  const game = createGame();
  [0, 3, 1, 4, 2].forEach((index) => game.play(index));
  assert.equal(game.status, Game.STATUS.WON);
  assert.throws(() => game.play(5), /already ended/);
});

test('reset returns the game to its initial state', () => {
  const game = createGame();
  game.play(0);
  game.play(1);
  game.reset();

  assert.equal(game.status, Game.STATUS.IN_PROGRESS);
  assert.equal(game.currentMark, PLAYER_X);
  assert.equal(game.winner, null);
  assert.equal(game.winningCombination, null);
  assert.deepEqual(game.board.getAvailableMoves(), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
});
