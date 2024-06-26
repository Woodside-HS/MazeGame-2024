/**
 * The enemy in the maze game
 */
class Enemy {
    /**
     * Create an enemy
     * @param {JSVector} initialPosition - the enemy's intial position in the maze
     */
    constructor(initialPosition, speed, distanceToRecognizeHero, health, name, imageName) {
        /* @type {World} */
        this.world = world;

        /* @type {number} */
        this.width = 0.5;
        this.speed = speed;
        this.distanceToRecognizeHero = distanceToRecognizeHero;

        /* @type {JSVector} */
        this.position = initialPosition.copy();
        this.position.add(new JSVector(0.5 - this.width / 2, 0.5 - this.width / 2));
        this.velocity = new JSVector(0, 0);
        this.acceleration = new JSVector(0, 0);
        
        /* @type {Queue<JSVector>} */
        this.path = new Queue();

        /* @type {PathType} */
        this.pathType = PathType.WANDER;
        
        /* @type {JSVector} */
        this.target = new JSVector();
	this.setNewRandonTarget();
        this.health = health
	this.maxHealth = health;
        this.weapon = new Sword(this);
        if(this.world.difficulty === 10){
            this.weapon = new SuperTrident(this);
        }
	this.imageName = imageName
        this.name = name;
    }    

    /* Run the enemy (once per frame) */
    run(center) {
        this.update();
        if (center) {
            this.renderCenter();
        } else {
            this.renderClassic();
        }
    }

    /* Update the enemy's position */
    update() {
	if (this.getCenterMazeLocation().safeZone) {
	    const maze = world.levels[world.currentLevel].maze;
	    if (this.position.x < maze.width / 2) {
		this.position.x = Math.floor(maze.width * 0.25);
	    } else {
		this.position.x = Math.floor(maze.width * 0.75);
	    }
	    if (this.position.y < maze.height / 2) {
		this.position.y = Math.floor(maze.height * 0.25);
	    } else {
		this.position.y = Math.floor(maze.height * 0.75);
	    }
	    this.target.floor();
	    this.pathType = PathType.WANDER;
	    this.setNewRandonTarget();
	    this.updatePath();
	    this.velocity = new JSVector(0, 0);
	    this.acceleration = new JSVector(0, 0);
	    this.wander();
	} else if (this.pathType == PathType.WANDER) {
            this.wander();
        } else if (this.pathType == PathType.SEEK) {
            this.seekPlayer();
            if(this.weapon!==null){
                if(this.weapon.attack(world.levels[world.currentLevel].hero)){
                    this.world.score-=10;
                }
                this.weapon.delayTime++;
            }
        } else {
            throw new Error(`pathType has an invalid value: ${this.pathType}`);
        }


        // Update the enemy's position
        this.velocity.add(this.acceleration);
	if (this.pathType == PathType.SEEK) {
            this.velocity.limit(this.speed * 1.25);
	} else {
	    this.velocity.limit(this.speed);
	}
	this.velocity.limit(world.maxSpeed);
        this.position.add(this.velocity);
        this.checkWalls();
    }

    wander() {
        // Check if the player is within a certain distance
        const target = this.target ? this.target.copy() : null;
        this.target = world.levels[world.currentLevel].hero.position.copy();
        this.target.floor();
        this.updatePath();
        if (this.path.length < this.distanceToRecognizeHero
	    && !world.levels[world.currentLevel].hero.getCenterMazeLocation().safeZone)
        {
            this.pathType = PathType.SEEK;
	    this.velocity = new JSVector(0, 0);
            this.seekPlayer();
            return;
        }
        
        // Seek the random position
        this.target = target;
	this.updatePath();
        this.seekTarget(() => {
            if (!this.target) {
		this.setNewRandonTarget();
                this.target.floor();
		this.updatePath();
		return true;
            }
            if (this.path.empty()) {
		if (this.position.distance(this.target) <= 2) {
		    this.setNewRandonTarget();
		    this.updatePath();
		}
                this.updatePath();
                return true;
            }
            return false;
        });
    }

    seekPlayer() {
        this.seekTarget(() => {
            const heroPosition = this.world.levels[this.world.currentLevel].hero.position.copy();
            heroPosition.floor();
            if (!this.target || !this.target.equals(heroPosition))
            {
                this.target = heroPosition.copy();
                this.target.floor();
            }
            
            if (this.path.length > this.distanceToRecognizeHero) {
                this.pathType = PathType.WANDER;
		this.setNewRandonTarget();
		this.updatePath();
                this.wander();
                return;
            }
            if (this.path.empty()) {
                this.updatePath();
                return true;
            }
            return false;
        });
    }

    // A hook that is called twice. It should contain logic for an
    // empty target and empty path. If the path was updated
    seekTarget(hook) {
        hook();
        let currentCell = this.position.copy();
        currentCell.floor();
        let nextCell = this.path.peek();
        // If the enemy has reached the next cell in the path, update
        // the path by removing the cell from the top of the path
        if (currentCell.equals(nextCell)) {
            this.path.pop();
            nextCell = this.path.peek();
        }
        
        const pathWasUpdated = hook();
        if (pathWasUpdated) {
            nextCell = this.path.peek();
            // if (currentCell.equals(nextCell)) {
                // this.path.pop();
                // nextCell = this.path.peek();
            // }
        }
        
        // Vector pointing to where the upper left corner of the enemy
        // would be if the enemy was positioned in the center of the cell
        const targetPosition = nextCell.copy();
        targetPosition.add(new JSVector(0.5 * (1 - this.width), 0.5 * (1 - this.width)));
        // Accelerate towards that next cell
        this.seek(targetPosition);
    }

    /**
     * Seek a position
     * @param {JSVector} position - this position to seek
     */
    seek(position) {
        this.acceleration = position.copy();
        this.acceleration.sub(this.position);
        this.acceleration.setMagnitude(this.speed ** 1.75);
    }

    /* Check the walls of the maze for collisions */
    checkWalls() {
        const y = this.position.y;
        const x = this.position.x;
        const w = this.width;
        const topLeft     = new JSVector(x, y);
        const topRight    = new JSVector(x + w, y);
        const bottomLeft  = new JSVector(x, y + w);
        const bottomRight = new JSVector(x + w, y + w);
        bottomRight.floor();
        bottomLeft.floor();
        topRight.floor();
        topLeft.floor();

        const maze = this.world.levels[this.world.currentLevel].maze;
        const bottomRightCell = maze.grid[bottomRight.y][bottomRight.x];
        const bottomLeftCell  = maze.grid[bottomLeft.y][bottomLeft.x];
        const topRightCell    = maze.grid[topRight.y][topRight.x];
        const topLeftCell     = maze.grid[topLeft.y][topLeft.x];

        const spearTop = new JSVector(x, y - 1);
        const spearBottom = new JSVector(x, y + 1);
        const spearLeft = new JSVector(x - 1, y);
        const spearRight = new JSVector(x + 1, y);
        spearTop.floor();
        spearBottom.floor();
        spearLeft.floor();
        spearRight.floor();

        let spearTopCell = null;
        if (spearTop.y >= 0) {
            spearTopCell = maze.grid[spearTop.y][spearTop.x];
        }
        let topSpear = spearTopCell && (topLeftCell != topRightCell) && spearTopCell.rightWall();
        
        let spearBottomCell = null;
        if (spearBottom.y < maze.rows) {
            spearBottomCell = maze.grid[spearBottom.y][spearBottom.x];
        }
        let bottomSpear = spearBottomCell && (topLeftCell != topRightCell) && spearBottomCell.rightWall();
        
        let spearLeftCell = null;
        if (spearLeft.x >= 0) {
            spearLeftCell = maze.grid[spearLeft.y][spearLeft.x];
        }
        let leftSpear = spearLeftCell && (topLeftCell != bottomLeftCell) && spearLeftCell.bottomWall();
        
        let spearRightCell = null;
        if (spearRight.x < maze.cols) {
            spearRightCell = maze.grid[spearRight.y][spearRight.x];
        }
        let rightSpear = spearRightCell && (topRightCell != bottomRightCell) && spearRightCell.bottomWall();

        // These are in pixels for rendering, but converted to sizes
        // relative to the virtual cell width
        const wallWidth = 0.5 * maze.wallWidth / maze.cellWidth;
        const cellWidth = 1;
        const collisionCoefficient = 0;

        // Top
        if (
            (topLeftCell.topWall() || topRightCell.topWall() || topSpear) && (y < topLeft.y + wallWidth) 
        ) {
            this.position.y = topLeft.y + wallWidth;
            this.velocity.y *= collisionCoefficient;
        }
        // Bottom
        else if (
            (bottomLeftCell.bottomWall() || bottomRightCell.bottomWall() || bottomSpear) && (y + this.width > bottomLeft.y + cellWidth - wallWidth)
        ) {
            this.position.y = bottomLeft.y + cellWidth - wallWidth - this.width;
            this.velocity.y *= collisionCoefficient;
        }
        // Left
        if (
            (topLeftCell.leftWall() || bottomLeftCell.leftWall() || leftSpear) && (x < topLeft.x + wallWidth)
        ) {
            this.position.x = topLeft.x + wallWidth;
            this.velocity.x *= collisionCoefficient;
        }
        // Right
        else if (
            (topRightCell.rightWall() || bottomRightCell.rightWall() || rightSpear) && (x + this.width > topRight.x + cellWidth - wallWidth)
        ) {
            this.position.x = topRight.x + cellWidth - wallWidth - this.width;
            this.velocity.x *= collisionCoefficient;
        }
    }

    updatePath() {
        this.path = new Stack();
        let solution = this.breadthFirstSearch();

        let point = solution;
        while (point) {
            this.path.push(new JSVector(point.x, point.y));
            point = point.parent;
        }
    }
v    
    // https://en.wikipedia.org/wiki/Breadth-first_search#Pseudocode
    breadthFirstSearch() {
        let queue = new Queue();
        const maze = this.world.levels[this.world.currentLevel].maze.grid;
        let visited = Array.from(new Array(maze.length), () => {
            return Array.from(new Array(maze[0].length), () => {
                return false;
            });
        });
        let position = this.position.copy();
        position.floor();
        visited[position.y][position.x] = true;

        const target = this.target.copy();
        target.floor();
        const goal = new Point(target.x, target.y);
        queue.enqueue(new Point(position.x, position.y));
        
        while (!queue.empty()) {
            let point = queue.dequeue();

            if (point.equals(goal)) {
                return point;
            }

            // Top
            if (
                point.y > 0 
                    && !visited[point.y - 1][point.x] 
                    && !maze[point.y][point.x].topWall()
            ) {
                visited[point.y - 1][point.x] = true;
                let neighbor = new Point(point.x, point.y - 1, point);
                queue.enqueue(neighbor);
            }

            // Bottom
            if (
                point.y < visited.length - 1 
                    && !visited[point.y + 1][point.x]
                    && !maze[point.y][point.x].bottomWall()
            ) {
                visited[point.y + 1][point.x] = true;
                let neighbor = new Point(point.x, point.y + 1, point);
                queue.enqueue(neighbor);
            }

            // Left
            if (
                point.x > 0 
                    && !visited[point.y][point.x - 1] 
                    && !maze[point.y][point.x].leftWall()
            ) {
                visited[point.y][point.x - 1] = true;
                let neighbor = new Point(point.x - 1, point.y, point);
                queue.enqueue(neighbor);
            }

            // Right
            if (
                point.x < visited[0].length - 1 
                    && !visited[point.y][point.x + 1] 
                    && !maze[point.y][point.x].rightWall()
            ) {
                visited[point.y][point.x + 1] = true;
                let neighbor = new Point(point.x + 1, point.y, point);
                queue.enqueue(neighbor);
            }
        }
    }

    /* Render the enemy */
    renderCenter() {
        const maze = world.levels[world.currentLevel].maze;
        const cellWidth = maze.cellWidth;
        const center = world.levels[world.currentLevel].maze.getCenter();
        const x = (this.position.x - center.x) * cellWidth;
        const y = (this.position.y - center.y) * cellWidth;
        const w = this.width * cellWidth;
        const cell = this.position.copy();
        cell.add(new JSVector(this.width*0.5, this.width*0.5));
        cell.floor();
        const luminance = maze.getCell(cell.y, cell.x).luminance;
	if (luminance <= 0) {
	    return;
	}
        const context = this.world.context;
        context.save();
        context.translate(this.world.canvas.width / 2, this.world.canvas.height / 2);
        context.beginPath();
        context.filter = `brightness(${100 * luminance}%)`;
        const enemy=world.images[this.imageName];
        if(enemy && enemy.loaded) {
            let destinationHeight = cellWidth * 0.75;
            let destinationWidth = cellWidth * 0.75;
            let destinationY = y + 0.5 * (cellWidth - destinationHeight)-w/2;
            let destinationX = x+ 0.5 * (cellWidth - destinationWidth)-w/2;
            let sourceHeight = enemy.image.height;
            let sourceWidth = enemy.image.width;
            let sourceY = 0;
            let sourceX = 0;
            context.drawImage(enemy.image, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight);
            if(this.health!=this.maxHealth){
                context.beginPath();
                context.fillStyle="rgb(85,75,74)";
                context.rect(x,y+cellWidth/5*3,cellWidth/2,20);
                context.fill();
                context.closePath();
            }    
            context.beginPath();
            if((this.health/this.maxHealth)<0.25){
                context.fillStyle="rgb(255,0,0)";
            } else {
                context.fillStyle="rgb(0,255,0)";
            }
            context.rect(x,y+cellWidth/5*3,cellWidth/2*this.health/this.maxHealth,20);
            context.fill();
            context.closePath();
        }
        context.restore();
    }

    renderClassic() {
	const cellWidth = this.world.levels[this.world.currentLevel].maze.cellWidth;
        const x = cellWidth * this.position.x;
        const y = cellWidth * this.position.y;
        const w = this.width * cellWidth;

        const context = this.world.context;
        context.save();
        // context.translate(this.world.canvas.width / 2, this.world.canvas.height / 2);
        context.beginPath();
        context.fillStyle = "red";
        context.fillRect(x, y, w, w);
        context.restore();
    }
    getMazeLocation() {
        const cell = this.position.copy();
        cell.floor();
        return world.levels[world.currentLevel].maze.grid[cell.y][cell.x];
    }
    getCenterMazeLocation() {
        const cell = this.position.copy();
	cell.x += this.width / 2;
	cell.y += this.width / 2;
        cell.floor();
        return world.levels[world.currentLevel].maze.grid[cell.y][cell.x];
    }
    setNewRandonTarget() {
	const maze = world.levels[world.currentLevel].maze;
	if (this.position.x < maze.width / 2) {
	    this.target.x = Math.random() * maze.width / 2;
	} else {
	    this.target.x = (1 + Math.random()) * maze.width / 2;
	}
	if (this.position.y < maze.height / 2) {
	    this.target.y = Math.random() * maze.height / 2;
	} else {
	    this.target.y = (1 + Math.random()) * maze.height / 2;
	}
	this.target.floor();
    }
}

class Point {
    constructor(x, y, parent=null) {
        this.x = x;
        this.y = y;
        this.parent = parent;
    }

    equals(point) {
        return this.x === point.x &&
               this.y === point.y;
p    }
}


// Enum(ish) of how the enemy moves
const PathType = Object.freeze({
    WANDER: Symbol("wander"),
    SEEK: Symbol("seek")
});
