# Tic-Tac-Toe

A dependency-free, browser-based Tic-Tac-Toe game built with vanilla
JavaScript. Play against a friend or challenge an unbeatable AI opponent
powered by the minimax algorithm.

## Features

- Classic 3x3 Tic-Tac-Toe gameplay in the browser
- Unbeatable computer opponent using minimax with depth-aware scoring
- Running scoreboard that persists between sessions via `localStorage`
- Fully modular source code (board, players, game state, AI, storage, UI)
- Unit tests for every module using Node's built-in test runner

## Getting started

No build step or dependencies are required. Simply open `index.html` in a
browser:

```bash
open index.html
```

Or serve it locally:

```bash
npm start
```

## Running the tests

```bash
npm test
```

This runs the full unit test suite with Node's built-in test runner
(`node --test`), covering the board, game flow, AI decision-making,
scoreboard and storage modules.

## Project structure

```
.
├── index.html            # Game markup
├── src/
│   ├── styles.css        # Styling for the board and UI
│   └── js/
│       ├── constants.js  # Shared constants (marks, winning lines)
│       ├── storage.js    # localStorage wrapper with in-memory fallback
│       ├── Board.js      # Board state and win detection
│       ├── Player.js     # Player model (human or AI)
│       ├── AI.js         # Minimax-based move selection
│       ├── Game.js       # Turn management and game status
│       ├── Scoreboard.js # Win/draw tracking and persistence
│       └── main.js       # DOM wiring and rendering
└── test/
    ├── board.test.js
    ├── game.test.js
    ├── ai.test.js
    ├── scoreboard.test.js
    └── storage.test.js
```

## How the AI works

The computer opponent uses the [minimax algorithm](https://en.wikipedia.org/wiki/Minimax)
to explore every possible continuation of the game, preferring faster wins
and slower losses. Because it searches the full game tree, it never loses:
the best a human opponent can achieve is a draw.
