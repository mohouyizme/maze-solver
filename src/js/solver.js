import Dom from './dom';

const dom = new Dom();

export default class Solver {
  constructor(maze, size) {
    this.maze = maze;
    this.size = size;
    this.stack = [];
  }

  resetMazeVisits() {
    this.maze.forEach(row => row.forEach(col => (col.visited = false)));
  }

  checkNeighbors(row, col) {
    const neighbors = [];

    const directions = {
      top: row - 1 >= 0 ? this.maze[row - 1][col] : false,
      right: col + 1 < this.size ? this.maze[row][col + 1] : false,
      bottom: row + 1 < this.size ? this.maze[row + 1][col] : false,
      left: col - 1 >= 0 ? this.maze[row][col - 1] : false
    };

    let index = 0;
    for (let key in directions) {
      switch (key) {
        case 'top':
          index = [0, 2];
          break;
        case 'right':
          index = [1, 3];
          break;
        case 'bottom':
          index = [2, 0];
          break;
        case 'left':
          index = [3, 1];
          break;
      }
      if (
        directions[key].visited === false &&
        directions[key].walls[index[1]] === false
      ) {
        neighbors.push(directions[key]);
      } else if (directions[key] === false) {
        if (
          this.maze[row][col].walls[index[0]] === false &&
          this.maze[row][col] !== this.startCell
        ) {
          dom.addOrRemoveClass(
            this.current.location.row,
            this.current.location.col,
            'add',
            'end'
          );
          return { end: true, cell: this.maze[row][col] };
        }
      }
    }

    if (neighbors.length > 0)
      return {
        end: false,
        cell: neighbors[Math.floor(Math.random() * neighbors.length)]
      };
    return { end: false, cell: undefined };
  }

  nextMove(cb) {
    setTimeout(() => {
      const next = this.checkNeighbors(
        this.current.location.row,
        this.current.location.col
      );
      dom.moveTracker(
        this.current.location.row,
        this.current.location.col,
        false
      );

      if (next.cell) {
        this.stack.push(this.current);
        dom.addOrRemoveClass(
          this.current.location.row,
          this.current.location.col,
          'add',
          'path'
        );
        next.cell.visited = true;
        this.current = next.cell;
        this.nextMove(cb);
      } else if (this.stack.length > 0) {
        this.current = this.stack.pop();
        if (this.current !== this.startCell)
          dom.addOrRemoveClass(
            this.current.location.row,
            this.current.location.col,
            'remove',
            'path'
          );
        this.nextMove(cb);
      } else if (cb) {
        dom.addOrRemoveClass(
          this.current.location.row,
          this.current.location.col,
          'remove',
          'path'
        );
        cb();
      }
    }, 100);
  }

  solve(startCell) {
    dom.moveTracker(startCell.location.row, startCell.location.col, false);
    this.current = startCell;
    this.startCell = startCell;
    this.resetMazeVisits();
    this.startCell.visited = true;
    this.nextMove();
  }
}
