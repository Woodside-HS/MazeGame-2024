"use strict";
/* A maze */
function Maze(world, row, col, renderCenter) {
    this.world = world;
    this.row = row;//num of rows in the maze 
    this.col = col;//num of cols in the maze 
    this.context = world.context;
    //width of the square cells 
    this.renderCenter = renderCenter;
    if (renderCenter)
        this.cellWidth = this.world.canvas.width / 15; // For center rendering
    else
        this.cellWidth = 50;
    //width of the walls
    this.wallWidth = 8;
    //array for all the cells 
    this.grid = [];
    //keep track of cells visited 
    this.path = [];
    //begin mazeGen before rendering 
    this.entry;
    this.exit;

    // Load images
    this.images = {};
    //this.loadImages();
}

Maze.prototype.getCellWidth = function(){
    return this.cellWidth
}

Object.defineProperty(Maze.prototype, "width", {
    get: function () {
	return this.col;
    }
});

Object.defineProperty(Maze.prototype, "height", {
    get: function () {
	return this.row;
    }
});

Maze.prototype.regenerate = function () {
    /* reset everything starting with maze */
    //reset grid 
    this.grid = [];
    for (let r = 0; r < this.row; r++) {
        this.grid[r] = [];
        for (let c = 0; c < this.col; c++) {
            this.grid[r][c] = new Cell(this.world, r, c, this.cellWidth, this.wallWidth);
        }
    }
    // begin mazeGen before rendering 
    this.path = [];
    this.explore(0, 0);
    this.entryExit();
    // Load images
    this.images = {};
    this.loadImages();
}

Maze.prototype.entryExit = function () {
    this.entry = this.grid[0][0];
    this.exit;
    //always start at top left, remove left and top wall to signify entrance 
    this.entry.walls[0] = false;
    this.entry.walls[3] = false;
    //make a random exit on the right or bottom of the maze 
    if (Math.random() * 2 > 1) {//right exit 
        let r = Math.floor(Math.random() * this.grid.length);
        this.exit = this.grid[r][this.grid[0].length - 1];
        //remove right wall 
        this.exit.walls[1] = false;
    }
    else {//bottom exit 
        let c = Math.floor(Math.random() * this.grid[0].length);
        this.exit = this.grid[this.grid.length - 1][c];
        //remove bottom wall 
        this.exit.walls[2] = false;
    }
}

Maze.prototype.explore = function (r, c) {
    this.grid[r][c].visited = true;
    // make array of available places to move to next 
    let goTo = this.checkNeighbors(r, c);
    // if there are cells to continue exploring 
    if (goTo.length > 0) {
        // add current cell to the path
        this.path.push(this.grid[r][c]);
        // choose one to go to 
        let go = Math.floor(Math.random() * goTo.length);
        let newCell = goTo[go];
        // remove walls between the cells 
        this.removeWalls(r, c, newCell.row, newCell.col);
        // explore to new cell 
        this.explore(newCell.row, newCell.col);
    }
    else if (this.path.length > 0) {
        // remove last cell visited from path because you're starting backtracking 
        let nextCell = this.path.pop();
        this.explore(nextCell.row, nextCell.col);
    }
    else {
        return;
    }
}

Maze.prototype.removeWalls = function (currentRow, currentCol, newRow, newCol) {
    //if top neighbor, remove top wall of current and bottom wall of new 
    if (currentRow > newRow && currentCol === newCol) {
        this.grid[currentRow][currentCol].walls[0] = false;
        this.grid[newRow][newCol].walls[2] = false;
    }
    // if right neighbor, remove right wall of current and left wall of new 
    if (currentRow === newRow && currentCol < newCol) {
        this.grid[currentRow][currentCol].walls[1] = false;
        this.grid[newRow][newCol].walls[3] = false;
    }
    // if bottom neighbor, remove bottom wall of current and top wall of new 
    if (currentRow < newRow && currentCol === newCol) {
        this.grid[currentRow][currentCol].walls[2] = false;
        this.grid[newRow][newCol].walls[0] = false;
    }
    // if left neighbor, remove left wall of current and right wall of new 
    if (currentRow === newRow && currentCol > newCol) {
        this.grid[currentRow][currentCol].walls[3] = false;
        this.grid[newRow][newCol].walls[1] = false;
    }
}

Maze.prototype.checkNeighbors = function (r, c) {
    let goTo = [];
    // if the cell is a wall, don't add those neighbors to the next place to go 
    if (r !== 0) {// if cell is at the top row 
        let topNeighbor = this.grid[r - 1][c];
        if (!topNeighbor.visited && topNeighbor.walls[0]) {
            goTo.push(topNeighbor);
        }
    }// if cell is on the right-most column 
    if (c !== this.grid[0].length - 1) {
        let rightNeighbor = this.grid[r][c + 1];
        if (!rightNeighbor.visited && rightNeighbor.walls[1]) {
            goTo.push(rightNeighbor);
        }
    }// if cell is at the bottom row 
    if (r !== this.grid.length - 1) {
        let bottomNeighbor = this.grid[r + 1][c];
        if (!bottomNeighbor.visited && bottomNeighbor.walls[2]) {
            goTo.push(bottomNeighbor);
        }
    }// if cell is on the left-most column 
    if (c !== 0) {
        let leftNeighbor = this.grid[r][c - 1];
        if (!leftNeighbor.visited && leftNeighbor.walls[3]) {
            goTo.push(leftNeighbor);
        }
    }
    return goTo;
}

Maze.prototype.loadImages = function () {
    // BACKGROUND (TEMP)
    this.images["coral"] = { image: new Image(), loaded: false };
    this.images["coral"].image.addEventListener("load", () => {
        this.images["coral"].loaded = true;
    });
    const n = 1 + Math.floor(Math.random() * 5);
    this.images["coral"].image.src = `./resources/teal_pattern${n}.jpg`;

    this.images["bubble"] = { image: new Image(), loaded: false };
    this.images["bubble"].image.addEventListener("load", () => {
        this.images["bubble"].loaded = true;
    });
    this.images["bubble"].image.src = "./resources/bubble.png";
}

// Set the proper luminance for each cell with a breadth-first search
Maze.prototype.setCellLuminances = function () {
    const Point = class Point {
        constructor(x, y, parent = null) {
            this.x = x;
            this.y = y;
            this.parent = parent;
        }

        pathLength() {
            let length = 0;
            let point = this;
            while (point) {
                ++length;
                point = point.parent;
            }
            return length;
        }

        equals(point) {
            return this.x === point.x &&
                this.y === point.y;
        }
    }
    
    const maxDistance = 8; // Up to two neighbors can be iluminated
    const queue = new Queue();
    const maze = this.grid;
    let visited = Array.from(new Array(maze.length), () => {
        return Array.from(new Array(maze[0].length), () => {
            return false;
        });
    });
    const centerCell = this.getCenter();
    centerCell.floor();

    queue.enqueue(new Point(centerCell.x, centerCell.y));
    visited[centerCell.y][centerCell.x] = true;

    while (!queue.empty()) {
        const cell = queue.dequeue();

        const distance = cell.pathLength();
        if (distance <= maxDistance) {
            maze[cell.y][cell.x].luminance = 1 - (distance - 1) / (maxDistance);
            // console.log(cell.y, cell.x, maze[cell.y][cell.x].luminance);
        } else {
            continue;
        }

        // Top
        if (
            cell.y > 0
            && !visited[cell.y - 1][cell.x]
            && !maze[cell.y][cell.x].topWall()
        ) {
            visited[cell.y - 1][cell.x] = true;
            let neighbor = new Point(cell.x, cell.y - 1, cell);
            queue.enqueue(neighbor);
        }

        // Bottom
        if (
            cell.y < visited.length - 1
            && !visited[cell.y + 1][cell.x]
            && !maze[cell.y][cell.x].bottomWall()
        ) {
            visited[cell.y + 1][cell.x] = true;
            let neighbor = new Point(cell.x, cell.y + 1, cell);
            queue.enqueue(neighbor);
        }

        // Left
        if (
            cell.x > 0
            && !visited[cell.y][cell.x - 1]
            && !maze[cell.y][cell.x].leftWall()
        ) {
            visited[cell.y][cell.x - 1] = true;
            let neighbor = new Point(cell.x - 1, cell.y, cell);
            queue.enqueue(neighbor);
        }

        // Right
        if (
            cell.x < visited[0].length - 1
            && !visited[cell.y][cell.x + 1]
            && !maze[cell.y][cell.x].rightWall()
        ) {
            visited[cell.y][cell.x + 1] = true;
            let neighbor = new Point(cell.x + 1, cell.y, cell);
            queue.enqueue(neighbor);
        }
    }

    Maze.prototype.entryExit = function () {
        this.entry = this.grid[0][0];
        this.exit;
        //always start at top left, remove left and top wall to signify entrance 
        this.entry.walls[0] = false;
        this.entry.walls[3] = false;
        //make a random exit on the right or bottom of the maze 
        if (Math.random() * 2 > 1) {//right exit 
            let r = Math.floor(Math.random() * this.grid.length);
            this.exit = this.grid[r][this.grid[0].length - 1];
            //remove right wall 
            this.exit.walls[1] = false;
        }
        else {//bottom exit 
            let c = Math.floor(Math.random() * this.grid[0].length);
            this.exit = this.grid[this.grid.length - 1][c];
            //remove bottom wall 
            this.exit.walls[2] = false;
        }

    }
}

Maze.prototype.getCell = function (r, c) {
    return this.grid[r][c];
}

Maze.prototype.getCenter = function() {
    const hero = world.levels[world.currentLevel].hero;
    const center = hero.position.copy();
    center.x += hero.width / 2;
    center.y += hero.width / 2;
    return center;
}

Maze.prototype.render = function (center) {

    this.oxygenBubbles();
    this.setCellLuminances();
    //render cells 
    for (let r = 0; r < this.row; r++) {
        for (let c = 0; c < this.col; c++) {
            this.grid[r][c].render(center);
        }
    }
    if (!this.renderCenter) {
        this.entryExitRender();
    }    
}

Maze.prototype.resetLuminances = function() {
    for (let r = 0; r < this.row; r++) {
        for (let c = 0; c < this.col; c++) {
            this.grid[r][c].luminance = 0;
        }
    }
}

Maze.prototype.oxygenBubbles = function () {
    //count how many oxygen bubbles there are 
    let count = 0;
    for (let r = 0; r < this.grid.length; r++) {
        for (let c = 0; c < this.grid[0].length; c++) {
            if (this.grid[r][c].oxygen != null && this.grid[r][c].oxygen.air > 0) {
                count++;
            }
        }
    }
    //oxygen bubbles on random tiles if 
    if (count < 10) {
        let ranR = Math.floor(Math.random() * this.grid.length);
        let ranC = Math.floor(Math.random() * this.grid[0].length);
        if (ranR === 0 && ranC === 0) {
            ranR = 1;
            ranC = 0;
        }
        else if (ranR === this.exit.row && ranC === this.exit.col) {
            ranR = 4;
            ranC = 4;
        }
        this.grid[ranR][ranC].oxygen = new Oxygen(this.grid[ranR][ranC], this.context);
    }
}

Maze.prototype.entryExitRender = function () {
    //color entry 
    this.context.rect(this.entry.topLx, this.entry.topLy, this.cellWidth, this.cellWidth);
    this.context.fillStyle = "rgba(255, 0, 0, 0.2)";
    this.context.fill();
    //color exit 
    this.context.rect(this.exit.topLx, this.exit.topLy, this.cellWidth, this.cellWidth);
    this.context.fillStyle = "rgba(255, 0, 255, 0.2)";
    this.context.fill();
}

