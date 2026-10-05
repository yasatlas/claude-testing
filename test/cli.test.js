'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { PassThrough } = require('node:stream');
const { playGame } = require('../src/cli');

function run(moves) {
  const input = new PassThrough();
  const output = new PassThrough();
  let out = '';
  output.on('data', (chunk) => {
    out += chunk.toString();
  });

  const result = playGame({ input, output });
  input.end(moves.map((m) => `${m}\n`).join(''));

  return result.then((board) => ({ board, out }));
}

test('CLI plays a full game to a win via piped input', async () => {
  // X: 1, 2, 3 (top row) / O: 4, 5
  const { board, out } = await run([1, 4, 2, 5, 3]);
  assert.deepEqual(board, ['X', 'X', 'X', 'O', 'O', null, null, null, null]);
  assert.ok(out.includes('Player X wins!'));
});

test('CLI re-prompts on an occupied cell instead of crashing', async () => {
  // O tries cell 1 again (already X), then picks 4 instead.
  const { out } = await run([1, 1, 4, 2, 5, 3]);
  assert.ok(out.includes('already taken'));
  assert.ok(out.includes('Player X wins!'));
});

test('CLI re-prompts on an out-of-range entry', async () => {
  const { out } = await run([0, 1, 4, 2, 5, 3]);
  assert.ok(out.includes('Please enter a number between 1 and 9.'));
  assert.ok(out.includes('Player X wins!'));
});

test('CLI reaches a draw when the board fills with no winner', async () => {
  // X | O | X
  // X | O | O
  // O | X | X
  const moves = [1, 2, 3, 5, 4, 6, 8, 7, 9];
  const { board, out } = await run(moves);
  assert.ok(board.every((cell) => cell !== null));
  assert.ok(out.includes("It's a draw!"));
});
