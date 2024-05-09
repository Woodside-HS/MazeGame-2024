"use strict";
/* A maze */
function Maze(world, level, loc, row, col, mL, renderCenter) {
    this.world = world;
    this.level = level;
    this.rows = row;//num of rows in the maze 
    this.cols = col;//num of cols in the maze 
    this.mazeLength = mL;//size of maze sections 
    this.context = world.context;
    //width of the square cells 
    //width of the walls
    this.renderCenter = renderCenter;
    if (renderCenter) {
        this.cellWidth = this.world.canvas.width / 10; // For center rendering
        this.wallWidth = this.cellWidth * 8 / 100;
    } else {
        this.cellWidth = 20;
        this.wallWidth = 4;
    }
    //array for all the cells 
    this.grid = [];
    for (let i = 0; i < this.rows; i++) {
        this.grid[i] = [];
    }
    //top left of maze
    this.mazeLoc = loc;
    //keep track of cells visited 
    this.path = [];
    //begin mazeGen before rendering 
    this.entry;
    this.exit;
    //the distance of illuminated cells
    this.cellMaxDist=5;
    //safe zone locs (top left cells)
    this.sloc = [];

    // Load images
    this.images = {};
    //this.loadImages();
}

Object.defineProperty(Maze.prototype, "width", {
    get: function () {
        return this.cols;
    }
});

Object.defineProperty(Maze.prototype, "height", {
    get: function () {
        return this.rows;
    }
});

Maze.prototype.regenerate = function (startRow, startCol, endRow, endCol) {
    /* reset everything starting with maze */
    //reset grid 
    for (let r = startRow; r < endRow; r++) {
        for (let c = startCol; c < endCol; c++) {
            this.grid[r][c] = new Cell(this.world, this, r, c, this.cellWidth, this.wallWidth);
        }
    }
    // begin mazeGen before rendering 
    this.path = [];
    this.explore(startRow, startCol, endRow, endCol, startRow, startCol);
    //creates center safe zone for each group of four mazes 
    let mL = this.world.levels[this.world.currentLevel].mazeLength;
    this.safeZone(startRow / mL, startCol / mL);
    // Load images
    this.images = {};
    this.loadImages();
}

Maze.prototype.safeZone = function (r, c) {
    let mL = this.world.levels[this.world.currentLevel].mazeLength;
    if (r + 1 < this.rows / mL && c + 1 < this.cols / mL) {
        let ar = {
            row: r * mL + mL - 1,
            col: c * mL + mL - 1
        }
        this.sloc.push(ar);
    }
    return this.sloc;
}

Maze.prototype.exit = function () {
    this.exit;
    //pick a random exit in the maze 
    let rr, rc;
    let side = Math.random() * 4;
    if (side > 3) {//left wall 
        rc = 0;
        rr = Math.floor(Math.random() * this.rows);
        // while (rr < this.mazeLength) {
        //     rr = Math.floor(Math.random() * this.rows);
        // }
    }
    else if (side > 2) {//bottom wall
        rr = this.rows - 1;
        rc = Math.floor(Math.random() * this.cols);
    }
    else if (side > 1) {//right wall 
        rc = this.cols - 1;
        rr = Math.floor(Math.random() * this.rows);
    }
    else {//top wall 
        rr = 0;
        rc = Math.floor(Math.random() * this.cols);
        // while (rc < this.mazeLength) {
        //     rc = Math.floor(Math.random() * this.cols);
        // }
    }
    this.exit = this.grid[rr][rc];
    //make cell by exit & remove wall by exit 
    if (rr === 0) {//top wall 
        this.exit.walls[0] = false;
    }
    if (rr === this.rows - 1) {//bottom wall 
        this.exit.walls[2] = false;
    }
    if (rc === 0) {//left wall 
        this.exit.walls[3] = false;
    }
    if (rc === this.cols - 1) {//right wall 
        this.exit.walls[1] = false;
    }

}

Maze.prototype.explore = function (startRow, startCol, endRow, endCol, r, c) {
    this.grid[r][c].visited = true;
    // make array of available places to move to next 
    let goTo = this.checkNeighbors(startRow, startCol, endRow, endCol, r, c);
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
        this.explore(startRow, startCol, endRow, endCol, newCell.row, newCell.col);
    }
    else if (this.path.length > 0) {
        // remove last cell visited from path because you're starting backtracking 
        let nextCell = this.path.pop();
        this.explore(startRow, startCol, endRow, endCol, nextCell.row, nextCell.col);
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

Maze.prototype.checkNeighbors = function (startRow, startCol, endRow, endCol, r, c) {
    let goTo = [];
    // if the cell is a wall, don't add those neighbors to the next place to go 
    if (r !== startRow) {// if cell is at the top row 
        let topNeighbor = this.grid[r - 1][c];
        if (!topNeighbor.visited && topNeighbor.walls[0]) {
            goTo.push(topNeighbor);
        }
    }// if cell is on the right-most column 
    if (c !== endCol - 1) {
        let rightNeighbor = this.grid[r][c + 1];
        if (!rightNeighbor.visited && rightNeighbor.walls[1]) {
            goTo.push(rightNeighbor);
        }
    }// if cell is at the bottom row 
    if (r !== endRow - 1) {
        let bottomNeighbor = this.grid[r + 1][c];
        if (!bottomNeighbor.visited && bottomNeighbor.walls[2]) {
            goTo.push(bottomNeighbor);
        }
    }// if cell is on the left-most column 
    if (c !== startCol) {
        let leftNeighbor = this.grid[r][c - 1];
        if (!leftNeighbor.visited && leftNeighbor.walls[3]) {
            goTo.push(leftNeighbor);
        }
    }
    return goTo;
}

Maze.prototype.addPaths = function (walls) {
    for (let i = 0; i < walls; ++i) {
        let x, y, wall;
        do {
            x = 1 + Math.floor(Math.random() * (this.cols - 2));
            y = 1 + Math.floor(Math.random() * (this.rows - 2));
            wall = Math.floor(Math.random() * 4);
        } while (!this.grid[y][x].walls[wall]);
        this.grid[y][x].walls[wall] = false;
        switch (wall) {
            case 0: --y; break;
            case 1: ++x; break;
            case 2: ++y; break;
            case 3: --x; break;
        }
        this.grid[y][x].walls[(wall + 2) % 4] = false;
    }
}

Maze.prototype.loadImages = function () {
    const loadImage = (path, name) => {
        this.images[name] = { image: new Image(), loaded: false };
        this.images[name].image.addEventListener("load", () => {
            this.images[name].loaded = true;
        });
        this.images[name].image.src = path;
    }

    loadImage("./resources/background0.webp", "section0");
    loadImage("./resources/background1.webp", "section1");
    loadImage("./resources/background2.webp", "section2");
    loadImage("./resources/background3.webp", "section3");

    // loadImage("./resources/background.jpg", "background");
    loadImage("./resources/bubble.png", "bubble");
    loadImage("./resources/heart.png", "heart");
    loadImage("./resources/eye.png", "vision");
    loadImage("./resources/blueBottle.png","enemy0");
    loadImage("./resources/redBottle.png","enemy1");
    loadImage("./resources/greyBag.png","enemy2");
    loadImage("./resources/redCup.png","enemy3");
    loadImage("./resources/ringPack.png","enemy4");
    loadImage("./resources/whiteBag.png","enemy5");
    loadImage("./resources/turtle.png","hero");

}

Maze.prototype.setCellLuminances = function () {
    if (world.levels[world.currentLevel].hero.superVision > 0) {
	this.setCellLuminancesRadial();
    } else {
	this.setCellLuminancesBFS();
    }
}

// Set the proper luminance for each cell with a breadth-first search
Maze.prototype.setCellLuminancesBFS = function () {
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

    const maxDistance = this.cellMaxDist; // Up to N neighbors can be iluminated
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
}

Maze.prototype.setCellLuminancesRadial = function () {
    let heroPosition = world.levels[world.currentLevel].hero.position.copy();
    for (let y = 0; y < this.height; ++y) {
	for (let x = 0; x < this.width; ++x) {
	    let cell = new JSVector(x, y);
	    let distance = cell.distance(heroPosition);
	    let maxDistance = 3;
	    if (distance < maxDistance) {
		this.grid[y][x].luminance = 1;
	    } else {
		this.grid[y][x].luminance = 0;
	    }
	}
    }
}

Maze.prototype.getCell = function (r, c) {
    return this.grid[r][c];
}

Maze.prototype.getCenter = function () {
    const hero = world.levels[world.currentLevel].hero;
    const center = hero.position.copy();
    center.x += hero.width / 2;
    center.y += hero.width / 2;
    return center;
}

Maze.prototype.render = function (center) {

    this.oxygenBubbles();
    this.healthHearts();
    this.createVision();
    this.weaponCreation();
    if (center)
        this.setCellLuminances();
    //render cells 
    for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
            this.grid[r][c].render(center);
        }
    }
}

Maze.prototype.resetLuminances = function () {
    for (let r = 0; r < this.rows; r++) {
        for (let c = 0; c < this.cols; c++) {
            this.grid[r][c].luminance = 0;
        }
    }
}

Maze.prototype.oxygenBubbles = function () {
    let mL = this.world.levels[this.world.currentLevel].mazeLength;
    for (let row = 0; row < this.rows / mL; row++) {
        for (let col = 0; col < this.cols / mL; col++) {
            let done = false;
            while (!done) {
                //count how many oxygen bubbles there are 
                let count = 0;
                for (let r = row * mL; r < row * mL + mL; r++) {
                    for (let c = col * mL; c < col * mL + mL; c++) {
                        if (this.grid[r][c].oxygen != null && this.grid[r][c].oxygen.air > 0) {
                            count++;
                        }
                    }
                }
                //oxygen bubbles on random tiles if 
                if (count < this.mazeLegnth) {
                    let Rmax = row * mL + mL - 1;
                    let Rmin = row * mL;
                    let Cmax = col * mL + mL - 1;
                    let Cmin = col * mL;
                    let ranR = Math.floor(Math.random() * ((Rmax) - (Rmin) + 1) + (Rmin));
                    let ranC = Math.floor(Math.random() * ((Cmax) - (Cmin) + 1) + (Cmin));
                    while (this.grid[ranR][ranC].safeZone) {
                        ranR = Math.floor(Math.random() * ((Rmax) - (Rmin) + 1) + (Rmin));
                        ranC = Math.floor(Math.random() * ((Cmax) - (Cmin) + 1) + (Cmin));
                    }
                    this.grid[ranR][ranC].oxygen = new Oxygen(this.grid[ranR][ranC], this.context);
                }
                else { done = true; }
            }
        }
    }
}
Maze.prototype.healthHearts=function(){
    let mL = this.world.levels[this.world.currentLevel].mazeLength;
    for (let row = 0; row < this.rows/mL; row++) {
        for (let col = 0; col < this.cols/mL; col++) {
            let done = false;
            while (!done) {
                //count how many hearts there are 
                let count = 0;
                for (let r = row * mL; r < row * mL + mL; r++) {
                    for (let c = col * mL; c < col * mL + mL; c++) {
                        if (this.grid[r][c].healthHeart != null) {
                            if(this.grid[r][c].healthHeart.used===true){
                                this.grid[r][c].healthHeart=null;
                            } else {
                                count++;
                            }
                        }
                    }
                }
                //hearts on random tiles if 
                if (count < Math.floor(this.mazeLength/3)) {
                    let ranR = Math.floor(Math.random() * ((row * mL + mL-1) - (row*mL) + 1) + (row*mL));
                    let ranC = Math.floor(Math.random() * ((col * mL + mL-1) - (col*mL) + 1) + (col*mL));
                    while (this.grid[ranR][ranC].safeZone) {
                        ranR = Math.floor(Math.random() * (row * mL + mL - row + 1) + row);
                        ranC = Math.floor(Math.random() * (col * mL + mL - col + 1) + col);
                    }
                    if(this.grid[ranR][ranC].oxygen === null&&this.grid[ranR][ranC].healthHeart===null){
                        this.grid[ranR][ranC].healthHeart= new healthHeart(this.grid[ranR][ranC], this.context);
                    }
                }
                else { done = true; }
            }
        }
    }
}
Maze.prototype.createVision=function(){
    let mL = this.world.levels[this.world.currentLevel].mazeLength;
    for (let row = 0; row < this.rows/mL; row++) {
        for (let col = 0; col < this.cols/mL; col++) {
            let done = false;
            while (!done) {
                //count how many eyes there are 
                let count = 0;
                for (let r = row * mL; r < row * mL + mL; r++) {
                    for (let c = col * mL; c < col * mL + mL; c++) {
                        if (this.grid[r][c].vision != null) {
                            if(this.grid[r][c].vision.used===true){
                                this.grid[r][c].vision=null;
                            } else {
                                count++;
                            }
                        }
                    }
                }
                //vision power up on random tiles if 
                if (count < Math.floor(this.mazeLength/4)) {
                    let ranR = Math.floor(Math.random() * ((row * mL + mL-1) - (row*mL) + 1) + (row*mL));
                    let ranC = Math.floor(Math.random() * ((col * mL + mL-1) - (col*mL) + 1) + (col*mL));
                    while (this.grid[ranR][ranC].safeZone) {
                        ranR = Math.floor(Math.random() * (row * mL + mL - row + 1) + row);
                        ranC = Math.floor(Math.random() * (col * mL + mL - col + 1) + col);
                    }
                    if(this.grid[ranR][ranC].oxygen === null&&this.grid[ranR][ranC].healthHeart===null&&this.grid[ranR][ranC].vision===null){
                        this.grid[ranR][ranC].vision= new Vision(this.grid[ranR][ranC], this.context);
                    }
                }
                else { done = true; }
            }
        }
    }
}
Maze.prototype.weaponCreation = function () {
    let mL = this.world.levels[this.world.currentLevel].mazeLength;
    for (let row = 0; row < this.rows/mL; row++) {
        for (let col = 0; col < this.cols/mL; col++) {
            let done = false;
            while (!done) {
                //count how many weapons there are 
                let count = 0;
                for (let r = row * mL; r < row * mL + mL; r++) {
                    for (let c = col * mL; c < col * mL + mL; c++) {
                        if (this.grid[r][c].weapon != null) {
                            count++;
                        }
                    }
                }
                //weapons on random tiles if 
                if (count < Math.floor(this.mazeLength/4)) {//4 weapons per maze section
                    let ranR = Math.floor(Math.random() * ((row * mL + mL-1) - (row*mL) + 1) + (row*mL));
                    let ranC = Math.floor(Math.random() * ((col * mL + mL-1) - (col*mL) + 1) + (col*mL));
                    while (this.grid[ranR][ranC].safeZone) {
                        ranR = Math.floor(Math.random() * (row * mL + mL - row + 1) + row);
                        ranC = Math.floor(Math.random() * (col * mL + mL - col + 1) + col);
                    }
                    if (this.grid[ranR][ranC].oxygen === null&&this.grid[ranR][ranC].healthHeart===null&&this.grid[ranR][ranC].vision===null&&this.grid[ranR][ranC].weapon===null ){
                        let ran = Math.random() * 6;
                        if (ran < 1.5) {
                            this.grid[ranR][ranC].weapon = new Dagger(this.grid[ranR][ranC]);
                        } else if (ran < 2.5) {
                            this.grid[ranR][ranC].weapon = new Sword(this.grid[ranR][ranC]);
                        } else if (ran < 3.5) {
                            this.grid[ranR][ranC].weapon = new Spear(this.grid[ranR][ranC]);
                        } else if (ran < 4) {
                            this.grid[ranR][ranC].weapon = new Trident(this.grid[ranR][ranC]);
                        } else if (ran < 4.75) {
                            this.grid[ranR][ranC].weapon = new SuperDagger(this.grid[ranR][ranC]);
                        } else if (ran < 5.33) {
                            this.grid[ranR][ranC].weapon = new SuperSword(this.grid[ranR][ranC]);
                        } else if (ran < 5.67) {
                            this.grid[ranR][ranC].weapon = new SuperSpear(this.grid[ranR][ranC]);
                        } else if (ran < 6) {
                            this.grid[ranR][ranC].weapon = new SuperTrident(this.grid[ranR][ranC]);
                        } 
                    }
                } else {
                    done=true;
                }   
            }
        }
    }
}

