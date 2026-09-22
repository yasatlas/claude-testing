# Tic Tac Toe

A small, dependency-free Tic Tac Toe game that runs entirely in the browser.

## Play

Open `index.html` in any modern browser. No build step or server required.

## Project structure

- `index.html` – page markup
- `style.css` – styling for the board and controls
- `game.js` – pure game logic (board state, win/draw detection) with no DOM
  dependencies, so it can be unit tested and reused
- `script.js` – wires the game logic up to the DOM (rendering, click
  handling, reset button)
- `test/game.test.js` – unit tests for `game.js`

## Running the tests

Tests use Node's built-in test runner, so no dependencies need to be
installed.

```
npm test
```
