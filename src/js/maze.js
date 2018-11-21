import Dom from "./dom";

const dom = new Dom();

export default class Maze {
  constructor(size) {
    // Constructor function with some default values
    this.maze = []; // The maze object is a 2D array contains maze cells
    this.stack = []; // Stack array is to save last visited cells in case road is closed, backtracking stuff ;)
    this.size = size; // Number of rows and cols
  }

  generateMaze() {
    // The maze generator which generate a random maze/map
    dom.updateContainerWidth(this.size); // Update the size of the maze container based on the given size

    for (let row = 0; row < this.size; row += 1) {
      // Loop x times to generate maze rows
      this.maze[row] = []; // Initialize an empty array to index of row in this.maze object
      for (let col = 0; col < this.size; col += 1) {
        // Loop x times to generate maze cols
        this.maze[row][col] = {
          // Assign a cell to a the current col in row
          walls: [true, true, true, true], // top, right, bottom, left
          visited: false, // The cell is already visited or not
          location: { row, col } // indexes of the cell
        };
      }
    }
    const startPoint = this.entryAndExit(); // this function generate start/end locations and returns starting point and stores it to startPoint constant/variable
    const randomIndex = () => Math.floor(Math.random() * this.size); // It returns a random number between 0 and maze given size (this.size)
    this.current = this.maze[randomIndex()][randomIndex()]; // It selects a random cell were generating will start from and store it to (this.current)
    this.current.visited = true; // Sign current cell as visited by switching (this.current.visited) to true

    return startPoint; // Returning the start point
  }

  checkNeighbors(row, col) {
    // Check possible directions to move
    const neighbors = []; // Array to store possible directions

    const directions = {
      // Object of all four directions with an inline condition to check if the selected cell is not outside the maze
      top: row - 1 >= 0 ? this.maze[row - 1][col] : false, // top => row - 1
      right: col + 1 < this.size ? this.maze[row][col + 1] : false, // right => col + 1
      bottom: row + 1 < this.size ? this.maze[row + 1][col] : false, // bottom => row + 1
      left: col - 1 >= 0 ? this.maze[row][col - 1] : false // left => col - 1
    };

    for (let key in directions) // Looping over directions object
      if (directions[key].visited === false) neighbors.push(directions[key]); // Push the possible direction to neighbors array if it's not visited

    if (neighbors.length > 0)
      // Check if neighbors array is not empty
      return neighbors[Math.floor(Math.random() * neighbors.length)]; // Return a random direction from neighbors array
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
