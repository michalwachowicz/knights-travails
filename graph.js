const Queue = require("./queue");

module.exports = class BoardGraph {
  constructor() {
    this.vertices = {};

    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {
        const moves = [
          [row + 2, column + 1],
          [row + 2, column - 1],
          [row - 2, column + 1],
          [row - 2, column - 1],
          [row + 1, column + 2],
          [row + 1, column - 2],
          [row - 1, column + 2],
          [row - 1, column - 2],
        ];

        this.vertices[`${row},${column}`] = moves.filter(
          (move) => move[0] >= 0 && move[0] < 8 && move[1] >= 0 && move[1] < 8
        );
      }
    }
  }

  #moveToArray(move) {
    const [a, b] = move.split(",");
    return [parseInt(a), parseInt(b)];
  }

  #getStepsArray(startStr, endStr, predecessors) {
    const arr = [];
    let current = endStr;

    while (current !== startStr) {
      arr.push(this.#moveToArray(current));
      current = predecessors.get(current);
    }

    return arr.reverse();
  }

  path(startStr, endStr) {
    if (startStr === endStr) return [];

    const queue = new Queue();
    const visited = new Set();
    const predecessors = new Map();

    queue.enqueue(startStr);
    visited.add(startStr);

    while (!queue.isEmpty()) {
      const position = queue.dequeue();
      const moves = this.vertices[position];

      for (let move of moves) {
        const moveStr = move.toString();

        if (!visited.has(moveStr)) {
          queue.enqueue(moveStr);
          visited.add(moveStr);

          predecessors.set(moveStr, position);
        }

        if (moveStr === endStr) {
          return this.#getStepsArray(startStr, endStr, predecessors);
        }
      }
    }

    return null;
  }

  knightMoves(start, end) {
    const path = this.path(start.toString(), end.toString());

    if (path === null)
      throw new Error("Input positions must be within chess board matrix");

    const moves = path.length;
    if (!moves) {
      console.log(`You made it in ${moves} moves!`);
      return;
    }

    console.log(`You made it in ${moves} moves! Here's your path:`);
    path.forEach((move) => console.log(move));
  }
};
