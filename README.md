# Tic Tac Toe

A small, dependency-free two-player Tic Tac Toe game that runs entirely in the browser.

## Play

Open `index.html` in any web browser. Players take turns clicking cells as
`X` and `O`. The game announces a winner (highlighting the winning line) or a
draw, and can be restarted with the **Restart** button.

## Project structure

- `game.js` – Pure game logic (board state, win/draw detection, move
  validation). Works in both the browser and Node.js.
- `app.js` – Wires the game logic up to the DOM.
- `index.html` – Page markup and styles.
- `game.test.js` – Unit tests for `game.js`.

## Tests

Run the test suite with Node.js:

```bash
npm test
```
