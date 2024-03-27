/**
 * A hero, bearing a lot of resemblance to the enemy
 */
class BetterHero {
    /**
     * Create a character
     * @param {World} world - the world that the character belongs to
     * @param {JSVector} initialPosition - the character's intial position in the maze
     */
    constructor(world, initialPosition) {
        /* @type {World} */
        this.world = world;

        /* @type {number} */
        this.width = 0.25;
        this.speed = 0.03;
        this.health = 100;
        this.oxygen = 100;

        /* @type {JSVector} */
        this.position = initialPosition.copy();
        this.position.add(new JSVector(this.width*0.5, this.width*0.5));
        this.velocity = new JSVector(0.03, 0.03);
        this.acceleration = new JSVector(0, 0);

        /* @type {Map<String, {pressed: boolean}>} */
        this.keys = {
            "s": {pressed: false},
            "w": {pressed: false},
            "a": {pressed: false},
            "d": {pressed: false}
        };

        window.addEventListener("keydown", (event) => {
            if (this.keys[event.key])
            {
                this.keys[event.key].pressed = true;
            }
        });

        window.addEventListener("keyup", (event) => {
            if (this.keys[event.key])
            {
                this.keys[event.key].pressed = false;
            }
        });
    }    

    /** 
     * Get the cell the hero is currently on
     * @return {Cell} - the cell the hero is currently on
     */
    getMazeLocation() {
        const cell = this.position.copy();
        cell.floor();
        return world.levels[world.currentLevel].maze.grid[cell.y][cell.x];
    }

    /* Run the character (once per frame) */
    run(center) {
        this.update();
        if (center) {
            this.renderCenter();
        } else {
            this.renderClassic();
        }
    }

    /* Update the characters's position */
    update() {
        const vel = new JSVector(0, 0);
        if (this.keys["s"].pressed) {
            vel.y += this.velocity.y;
        }
        if (this.keys["w"].pressed) {
            vel.y -= this.velocity.y;
        }
        if (this.keys["a"].pressed) {
            vel.x -= this.velocity.x;
        }
        if (this.keys["d"].pressed) {
            vel.x += this.velocity.x;
        }
        vel.limit(this.speed)
        this.position.add(vel);

        this.checkWalls();
        this.updateStatusBar();
    }

    /* Check the walls of the maze for collisions */
    // checkWalls() {
        
    //     const y = this.position.y;
    //     const x = this.position.x;
    //     const w = this.width;
    //     const topLeft     = new JSVector(x, y);
    //     const topRight    = new JSVector(x + w, y);
    //     const bottomLeft  = new JSVector(x, y + w);
    //     const bottomRight = new JSVector(x + w, y + w);
    //     bottomRight.floor();
    //     bottomLeft.floor();
    //     topRight.floor();
    //     topLeft.floor();

    //     const maze = this.world.levels[this.world.currentLevel].maze;
    //     const bottomRightCell = maze.grid[bottomRight.y][bottomRight.x];
    //     const bottomLeftCell  = maze.grid[bottomLeft.y][bottomLeft.x];
    //     const topRightCell    = maze.grid[topRight.y][topRight.x];
    //     const topLeftCell     = maze.grid[topLeft.y][topLeft.x];

    //     const spearTop = new JSVector(x, y - 1);
    //     const spearBottom = new JSVector(x, y + 1);
    //     const spearLeft = new JSVector(x - 1, y);
    //     const spearRight = new JSVector(x + 1, y);
    //     spearTop.floor();
    //     spearBottom.floor();
    //     spearLeft.floor();
    //     spearRight.floor();

    //     let spearTopCell = null;
    //     if (spearTop.y >= 0) {
    //         spearTopCell = maze.grid[spearTop.y][spearTop.x];
    //     }
    //     let topSpear = spearTopCell && (topLeftCell != topRightCell);
        
    //     let spearBottomCell = null;
    //     if (spearBottom.y < maze.row) {
    //         spearBottomCell = maze.grid[spearBottom.y][spearBottom.x];
    //     }
    //     let bottomSpear = spearBottomCell && (topLeftCell != topRightCell);
        
    //     let spearLeftCell = null;
    //     if (spearLeft.x >= 0) {
    //         spearLeftCell = maze.grid[spearLeft.y][spearLeft.x];
    //     }
    //     let leftSpear = spearLeftCell && (topLeftCell != bottomLeftCell);
        
    //     let spearRightCell = null;
    //     if (spearRight.x < maze.col) {
    //         spearRightCell = maze.grid[spearRight.y][spearRight.x];
    //     }
    //     let rightSpear = spearRightCell && (topRightCell != bottomRightCell);

    //     // These are in pixels for rendering, but converted to sizes
    //     // relative to the virtual cell width
    //     const wallWidth = 0.5 * maze.wallWidth / maze.cellWidth;
    //     const cellWidth = 1;
    //     const collisionCoefficient = 0;

    //     // Top
    //     if (
    //         (topLeftCell.topWall() || topRightCell.topWall() || topSpear) && (y < topLeft.y + wallWidth) 
    //     ) {
    //         this.position.y = topLeft.y + wallWidth;
    //         this.velocity.y *= collisionCoefficient;
    //     }
    //     // Bottom
    //     else if (
    //         (bottomLeftCell.bottomWall() || bottomRightCell.bottomWall() || bottomSpear) && (y + this.width > bottomLeft.y + cellWidth - wallWidth)
    //     ) {
    //         this.position.y = bottomLeft.y + cellWidth - wallWidth - this.width;
    //         this.velocity.y *= collisionCoefficient;
    //     }
    //     // Left
    //     if (
    //         (topLeftCell.leftWall() || bottomLeftCell.leftWall() || leftSpear) && (x < topLeft.x + wallWidth)
    //     ) {
    //         this.position.x = topLeft.x + wallWidth;
    //         this.velocity.x *= collisionCoefficient;
    //     }
    //     // Right
    //     else if (
    //         (topRightCell.rightWall() || bottomRightCell.rightWall() || rightSpear) && (x + this.width > topRight.x + cellWidth - wallWidth)
    //     ) {
    //         this.position.x = topRight.x + cellWidth - wallWidth - this.width;
    //         this.velocity.x *= collisionCoefficient;
    //     }
    // }

    checkWalls() {
        
        let maze = this.world.levels[this.world.currentLevel].maze;

        let cellX = parseInt(this.position.x.toString()[0]);
        let cellY = parseInt(this.position.y.toString()[0]);


        let cell = maze.getCell(cellY, cellX)
        // console.log(cell)
        // console.log(cell.topWall())
        
        if (cell.topWall()) {
            let position = { x: this.position.x, y: this.position.y, size: 5 };
            let wall = { x: cell.topLx, y: cell.topLy, width: cell.cellWidth, height: cell.wallWidth };
            
            // if(Math.abs(position.y - wall.y) < 0.01){
            //     console.log("troo")
            // }
            // console.log(Math.abs(position.y - wall.y))
            // console.log(cell.topLy)
            console.log(this.position.x)
    
        }
        // console.log(vel.y)
        // console.log(vel.y <= 0)
        // this.velocity.y *= 0
        
    }

    updateStatusBar() {
        this.updateHealth();
        this.updateOxygen();
    }
    
    updateHealth() {//assume max health will always be 100
        let h = document.getElementById("health");
        let hB = document.getElementsByClassName("infoTile");
        let hP = Math.round(this.health) / 100;
        hP=(hP*100).toFixed(0);
        h.innerHTML = hP + "%";
        //color change not working rn
        hB.item(0).style.color = "rgb(23," + 115 * hP + ",41)";
    }

    updateOxygen() {
        if(this.health<0){
            world.deathScreen();
        }
        this.oxygen -= 0.04;
        if (this.oxygen <= 0 && this.health > 0) {
            this.health -= 0.1;
        } else if (this.oxygen < 10 && this.health > 0) {
            this.health -= 0.01;
        } else if (this.oxygen < 30 && this.health > 0) {
            this.health -= 0.001;
        }
        let o = document.getElementById("oxygen");
        let oP = 0;
        if (this.oxygen > 0) {
            oP = Math.round(this.oxygen) / 100;
        }
        oP=(oP*100).toFixed(0);
        o.innerHTML = oP + "%";
        //need to add color change still
    }


    /* Render the enemy */
    renderCenter() {
        const cellWidth = world.levels[world.currentLevel].maze.cellWidth;
        const center = world.levels[world.currentLevel].maze.getCenter();
        const x = (this.position.x - center.x) * cellWidth;
        const y = (this.position.y - center.y) * cellWidth;
        const w = this.width * cellWidth;

        const context = this.world.context;
        context.save();
        context.translate(this.world.canvas.width / 2, this.world.canvas.height / 2);
        context.beginPath();
        context.fillStyle = "red";
        context.fillRect(x, y, w, w);
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
}
