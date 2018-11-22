import Maze from "./maze";
import Dom from "./dom";
import Solver from "./solver";

const maze = new Maze(10);
const dom = new Dom();
const solver = new Solver(maze.maze, maze.size);

class App {
  constructor() {
    this.startingPoint;
  }

  start() {
    this.startingPoint = maze.generateMaze();
    dom.generateMaze(maze.maze);
    maze.nextMove(() => solver.solve(this.startingPoint));
  }
}

const app = new App();

app.start();
