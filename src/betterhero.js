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
        this.weapon = new Sword(this);
        this.target = null;
        this.killCount = 0;

        /* @type {JSVector} */
        this.position = initialPosition.copy();
        this.position.add(new JSVector(0.5 - this.width / 2, 0.5 - this.width / 2));
        this.velocity = new JSVector(0, 0);
        this.acceleration = new JSVector(0, 0);

        /* @type {Map<String, {pressed: boolean}>} */
        this.keys = {
            "s": {pressed: false},
            "w": {pressed: false},
            "a": {pressed: false},
            "d": {pressed: false},
            "e": {pressed: false}
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
            vel.y += this.speed;
            this.oxygen-=0.02;
        }
        if (this.keys["w"].pressed) {
            vel.y -= this.speed;
            this.oxygen-=0.02;
        }
        if (this.keys["a"].pressed) {
            vel.x -= this.speed;
            this.oxygen-=0.02;
        }
        if (this.keys["d"].pressed) {
            vel.x += this.speed;
            this.oxygen-=0.02;
        }
        vel.limit(this.speed)
        this.position.add(vel);

        this.checkWalls();
        this.updateStatusBar();
        this.pickUpWeapon();
        this.updateWeapon();
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
        let topSpear = spearTopCell && (topLeftCell != topRightCell);
        
        let spearBottomCell = null;
        if (spearBottom.y < maze.rows) {
            spearBottomCell = maze.grid[spearBottom.y][spearBottom.x];
        }
        let bottomSpear = spearBottomCell && (topLeftCell != topRightCell);
        
        let spearLeftCell = null;
        if (spearLeft.x >= 0) {
            spearLeftCell = maze.grid[spearLeft.y][spearLeft.x];
        }
        let leftSpear = spearLeftCell && (topLeftCell != bottomLeftCell);
        
        let spearRightCell = null;
        if (spearRight.x < maze.cols) {
            spearRightCell = maze.grid[spearRight.y][spearRight.x];
        }
        let rightSpear = spearRightCell && (topRightCell != bottomRightCell);

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

    updateStatusBar() {
        this.updateOxygen();
        this.updateHealth();
        this.updateWeaponStatus();
    }
    
    updateHealth() {//assume max health will always be 100
        let h = document.getElementById("health");
        let iT = document.getElementsByClassName("infoTile");
        let hP = Math.round(this.health) / 100;
        hP=(hP*100).toFixed(0);
        h.innerHTML = hP + "%";
        iT.item(1).style.boxShadow="0 0 6px 6px #1df505";
        iT.item(1).style.backgroundImage="linear-gradient(#30db58,#3cc75c,#1e8a37)"
        if(this.health<=0){
            iT.item(2).style.boxShadow="0 0 6px 6px #f50521";
            iT.item(2).style.backgroundImage="linear-gradient(#e00d26,#d4152b,#bf192c)";
            iT.item(1).style.boxShadow="0 0 6px 6px #f50521";
            iT.item(1).style.backgroundImage="linear-gradient(#e00d26,#d4152b,#bf192c)";
            this.health=0;
            world.deathScreen();
        } else if(this.health<20){
            iT.item(1).style.boxShadow="0 0 6px 6px #f50521";
            iT.item(1).style.backgroundImage="linear-gradient(#e00d26,#d4152b,#bf192c)";
        }else if(this.health<50){
            iT.item(1).style.boxShadow="0 0 6px 6px #c7f705";
            iT.item(1).style.backgroundImage="linear-gradient(#c8f70a,#bbe809,#b1d911)";
        }
    }
    updateWeaponStatus(){
        let w=document.getElementById("weapon");
        w.innerHTML=this.weapon.name;
        let k=document.getElementById("kills");
        k.innerHTML=this.killCount;
    }
    updateOxygen() {
        let o = document.getElementById("oxygen");
        let iT=document.getElementsByClassName("infoTile");
        let oP = 0;
        if(this.oxygen<0){
            this.oxygen=0;
        }
        this.oxygen -= 0.005;
        iT.item(2).style.boxShadow="0 0 6px 6px #1df505";
        iT.item(2).style.backgroundImage="linear-gradient(#30db58,#3cc75c,#1e8a37)"
        if (this.oxygen <= 0 && this.health > 0) {
            this.health -= 0.1;
            iT.item(2).style.boxShadow="0 0 6px 6px #f50521";
            iT.item(2).style.backgroundImage="linear-gradient(#e00d26,#d4152b,#bf192c)";
        } else if (this.oxygen < 10 && this.health > 0) {
            this.health -= 0.01;
            iT.item(2).style.boxShadow="0 0 6px 6px #f50521";
            iT.item(2).style.backgroundImage="linear-gradient(#e00d26,#d4152b,#bf192c)";
        } else if (this.oxygen < 40 && this.health > 0) {
            this.health -= 0.001;
            iT.item(2).style.boxShadow="0 0 6px 6px #c7f705";
            iT.item(2).style.backgroundImage="linear-gradient(#c8f70a,#bbe809,#b1d911)";
        } 
        if (this.oxygen > 0) {
            oP = Math.round(this.oxygen) / 100;
        }
        oP=(oP*100).toFixed(0);
        o.innerHTML = oP + "%";
    }
    pickUpWeapon(){
        let calvin = world.levels[world.currentLevel].hero.getMazeLocation().weapon;
        //need to add a delay still
        if (calvin!==null&&this.keys["e"].pressed) {
            let diego=world.levels[world.currentLevel].hero.weapon;
            calvin.holder=this;
            diego.holder=this.getMazeLocation();
            world.levels[world.currentLevel].hero.weapon=calvin;
            world.levels[world.currentLevel].hero.getMazeLocation().weapon=diego;
        }
    }
    updateWeapon() { 
        let enemies=world.levels[world.currentLevel].enemies;
        let closeEnemy=enemies[0];
        if(enemies.length>0){
            for(let i=0;i<enemies.length;i++){
                if(enemies[i].path.length<closeEnemy.path.length){
                    closeEnemy=enemies[i];
                }
            }
            this.target=closeEnemy;
            if(this.weapon.attack(this.target)){
                world.score+=150;
                if(closeEnemy.health<=0){
                    world.score+=100;
                    this.health+=10;
                    this.killCount++;
                }
            }
            this.weapon.delayTime++;
        }
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
        if(this.weapon!==null){//render weapon if there is one
            this.weapon.render();
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
}
