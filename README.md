# Tic-Tac-Toe

A small command-line Tic-Tac-Toe game written in Node.js.

## Requirements

- Node.js 18+ (uses the built-in `node:test` runner)

## Play

```bash
npm start
```

Players take turns typing a number from 1-9 to place their mark on the
corresponding cell:

```
 1 | 2 | 3
-----------
 4 | 5 | 6
-----------
 7 | 8 | 9
```

Player `X` always goes first. The game ends when a player gets three marks
in a row (horizontally, vertically, or diagonally), or when the board fills
up with no winner (a draw).

## Run tests

```bash
npm test
```

## Project structure

- `src/game.js` - pure game logic (board state, move validation, win/draw
  detection, rendering). No I/O, easy to unit test.
- `src/cli.js` - terminal interface that reads player input and prints the
  board using `src/game.js`.
- `test/game.test.js` - unit tests for the game logic.
