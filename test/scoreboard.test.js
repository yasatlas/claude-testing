const test = require('node:test');
const assert = require('node:assert/strict');
const Scoreboard = require('../src/js/Scoreboard');
const { PLAYER_X, PLAYER_O } = require('../src/js/constants');

test('a new scoreboard starts at zero', () => {
  const scoreboard = new Scoreboard(false);
  assert.deepEqual(scoreboard.getScores(), { X: 0, O: 0, draws: 0 });
});

test('recordWin increments the winner tally only', () => {
  const scoreboard = new Scoreboard(false);
  scoreboard.recordWin(PLAYER_X);
  scoreboard.recordWin(PLAYER_X);
  scoreboard.recordWin(PLAYER_O);
  assert.deepEqual(scoreboard.getScores(), { X: 2, O: 1, draws: 0 });
});

test('recordDraw increments the draw tally', () => {
  const scoreboard = new Scoreboard(false);
  scoreboard.recordDraw();
  assert.deepEqual(scoreboard.getScores(), { X: 0, O: 0, draws: 1 });
});

test('recordWin rejects an unknown mark', () => {
  const scoreboard = new Scoreboard(false);
  assert.throws(() => scoreboard.recordWin('Z'), /Unknown mark/);
});

test('reset clears all tallies', () => {
  const scoreboard = new Scoreboard(false);
  scoreboard.recordWin(PLAYER_X);
  scoreboard.recordDraw();
  scoreboard.reset();
  assert.deepEqual(scoreboard.getScores(), { X: 0, O: 0, draws: 0 });
});

test('getScores returns a copy, not a live reference', () => {
  const scoreboard = new Scoreboard(false);
  const scores = scoreboard.getScores();
  scores.X = 99;
  assert.equal(scoreboard.getScores().X, 0);
});

test('a persistent scoreboard saves and reloads via storage', () => {
  const storage = require('../src/js/storage');
  storage.clear('scoreboard');

  const first = new Scoreboard(true);
  first.recordWin(PLAYER_X);
  first.recordDraw();

  const second = new Scoreboard(true);
  assert.deepEqual(second.getScores(), { X: 1, O: 0, draws: 1 });

  storage.clear('scoreboard');
});
