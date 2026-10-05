# Tic-Tac-Toe

A small, dependency-free, two-player Tic-Tac-Toe game that runs in the terminal.

## Project structure

- `src/game.js` — pure game logic: board state, move validation, win/draw
  detection, and board rendering. Has no I/O, so it's fully unit-testable.
- `src/cli.js` — terminal interface built on top of `src/game.js`; prompts
  each player in turn and prints the board after every move. Driven by
  readline's `line` event so it works with both an interactive TTY and
  piped/non-interactive input.
- `test/game.test.js` — unit tests for `src/game.js`, run with Node's
  built-in test runner.
- `test/cli.test.js` — integration tests that drive `src/cli.js` end-to-end
  over in-memory streams (wins, draws, and invalid-input handling).

## Requirements

- Node.js 18+ (no external dependencies).

## How to play

```bash
npm start
```

Players take turns as `X` and `O`. Enter a number from 1-9 to place your mark
in the matching cell:

```
 1 | 2 | 3
---+---+---
 4 | 5 | 6
---+---+---
 7 | 8 | 9
```

The game ends when a player gets three in a row (horizontally, vertically, or
diagonally) or when the board fills up with no winner (a draw).

## Running the tests

```bash
npm test
```
