import Dom from './dom';

const dom = new Dom();

export default class Maze {
  constructor(size) {
    this.maze = [];
    this.stack = [];
    this.size = size;
  }

  generateMaze() {
    dom.updateContainerWidth(this.size);

    for (let row = 0; row < this.size; row += 1) {
      this.maze[row] = [];
      for (let col = 0; col < this.size; col += 1) {
        this.maze[row][col] = {
          walls: [true, true, true, true],
          visited: false,
          location: { row, col }
        };
      }
    }
    const startPoint = this.entryAndExit();
    const randomIndex = () => Math.floor(Math.random() * this.size);
    this.current = this.maze[randomIndex()][randomIndex()];
    this.current.visited = true;

    return startPoint;
  }

  checkNeighbors(row, col) {
    const neighbors = [];

    const directions = {
      top: row - 1 >= 0 ? this.maze[row - 1][col] : false,
      right: col + 1 < this.size ? this.maze[row][col + 1] : false,
      bottom: row + 1 < this.size ? this.maze[row + 1][col] : false,
      left: col - 1 >= 0 ? this.maze[row][col - 1] : false
    };

    for (let key in directions)
      if (directions[key].visited === false) neighbors.push(directions[key]);

    if (neighbors.length > 0)
      return neighbors[Math.floor(Math.random() * neighbors.length)];
  }

  removeWalls(current, next) {
    const axis = {
      x: current.location.row - next.location.row,
      y: current.location.col - next.location.col
    };

    switch (axis.x) {
      case 1:
        current.walls[0] = false;
        next.walls[2] = false;
        break;
      case -1:
        current.walls[2] = false;
        next.walls[0] = false;
        break;
    }

    switch (axis.y) {
      case 1:
        current.walls[3] = false;
        next.walls[1] = false;
        break;
      case -1:
        current.walls[1] = false;
        next.walls[3] = false;
        break;
    }

    dom.updateBorders(this.maze);
  }

  nextMove(cb) {
    const next = this.checkNeighbors(
      this.current.location.row,
      this.current.location.col
    );

    if (next) {
      next.visited = true;
      this.stack.push(this.current);
      this.removeWalls(this.current, next);
      this.current = next;
      this.nextMove(cb);
    } else if (this.stack.length > 0) {
      this.current = this.stack.pop();
      this.nextMove(cb);
    } else if (cb) cb();
  }

  entryAndExit() {
    const randomEntry = {
      side: Math.floor(Math.random() * 4),
      index: Math.floor(Math.random() * this.size)
    };
    const randomExit = {
      index: Math.floor(Math.random() * this.size)
    };
    let start;
    let entry;

    switch (randomEntry.side) {
      case 0:
        start = this.maze[0][randomEntry.index].walls[0] = false;
        entry = this.maze[0][randomEntry.index];
        break;
      case 1:
        start = this.maze[randomEntry.index][this.size - 1].walls[1] = false;
        entry = this.maze[randomEntry.index][this.size - 1];
        break;
      case 2:
        start = this.maze[this.size - 1][randomEntry.index].walls[2] = false;
        entry = this.maze[this.size - 1][randomEntry.index];
        break;
      case 3:
        start = this.maze[randomEntry.index][0].walls[3] = false;
        entry = this.maze[randomEntry.index][0];
        break;
    }

    switch (randomEntry.side) {
      case 0:
        this.maze[this.size - 1][randomExit.index].walls[2] = false;
        break;
      case 1:
        this.maze[randomExit.index][0].walls[3] = false;
        break;
      case 2:
        this.maze[0][randomExit.index].walls[0] = false;
        break;
      case 3:
        this.maze[randomExit.index][this.size - 1].walls[1] = false;
        break;
    }

    return entry;
  }
}
