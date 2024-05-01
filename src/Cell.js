function Cell(world, maze, r, c, cellWidth, wallWidth) {
    this.world = world;
    this.maze = maze;
    this.context = world.context;
    this.row = r;
    this.col = c;
    //visited during explore 
    this.visited = false;
    this.oxygen = null;
    this.oxygenDiameter = 0.8;
    this.healthHeart=null;
    this.vision=null;
    this.weapon = null;
    this.cellWidth = cellWidth;
    this.wallWidth = wallWidth;
    this.color = "rgba(0, 0, 255, 1)";
    this.topL = new JSVector(this.col * this.cellWidth + this.maze.mazeLoc.x, this.row * this.cellWidth + this.maze.mazeLoc.y);
    this.topR = new JSVector(this.topL.x + this.cellWidth,  this.topL.y);
    this.bottomR = new JSVector(this.topR.x, this.topR.y + this.cellWidth);
    this.bottomL = new JSVector(this.topL.x, this.topL.y + this.cellWidth);
    this.walls = [true, true, true, true];//top, right, bottom, left (like a clock)

    this.safeZone = false;

    /* @type {float} (0 <= luminance <= 1) */
    this.luminance = 0;
    // this.type = "coral"; // Types for images
}

Cell.prototype.getSection = function() {
    let horizontalSections = this.maze.width / this.maze.mazeLength;
    // console.log(horizontalSections);
    let section = new JSVector(this.col, this.row);
    section.divide(this.maze.mazeLength);
    section.floor();
    return horizontalSections * section.y + section.x;
}

Cell.prototype.render = function (center) {
    if (this.safeZone) {//if its a safe zone, remove all walls 
        this.walls[0] = false;
        this.walls[1] = false;
        this.walls[2] = false;
        this.walls[3] = false;
    }
    if (center) {
        this.renderCenter();
    }
    else {
        this.renderClassic();
    }
}

Cell.prototype.renderCenter = function () {
    const cellWidth = this.cellWidth;
    const wallWidth = this.wallWidth;
    const maze = this.world.levels[world.currentLevel].maze
    const center = maze.getCenter();
    const x = (this.col - center.x) * cellWidth;
    const y = (this.row - center.y) * cellWidth;
    const xEnd = x + cellWidth;
    const yEnd = y + cellWidth;

    const context = this.world.context;
    context.save();
    context.translate(this.world.canvas.width / 2, this.world.canvas.height / 2);

    context.beginPath();
    context.strokeStyle = "white";
    context.lineWidth = this.wallWidth;

    const image = maze.images[`section${this.getSection()}`];
    // console.log(image, `section${this.getSection()}`);
    if (image && image.loaded && this.luminance > 0) {
        let sourceWidth = image.image.width / maze.mazeLength;
        let sourceHeight = image.image.height / maze.mazeLength;
        let sourceX = (this.col % maze.mazeLength) * sourceWidth;
        let sourceY = (this.row % maze.mazeLength) * sourceHeight;
        let destinationX = x;
        let destinationY = y;
        let destinationWidth = cellWidth;
        let destinationHeight = cellWidth;
        context.save();
        // context.beginPath();
        const brightness = 100 * this.luminance;
        context.filter = `brightness(${brightness}%)`;
        context.drawImage(image.image, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight);

        const bubble = maze.images["bubble"];
        if (this.oxygen && bubble && bubble.loaded) {
            destinationHeight = cellWidth * this.oxygenDiameter * this.oxygen.air / 20;
            destinationWidth = cellWidth * this.oxygenDiameter * this.oxygen.air / 20;
            destinationY = y + 0.5 * (cellWidth - destinationHeight);
            destinationX = x + 0.5 * (cellWidth - destinationWidth);
            sourceHeight = bubble.image.height;
            sourceWidth = bubble.image.width;
            sourceY = 0;
            sourceX = 0;

            context.drawImage(bubble.image, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight);
        }
        const heart=maze.images["heart"];
        if(this.healthHeart && heart && heart.loaded) {
            destinationHeight = cellWidth * 0.75;
            destinationWidth = cellWidth * 0.75;
            destinationY = y + 0.5 * (cellWidth - destinationHeight);
            destinationX = x + 0.5 * (cellWidth - destinationWidth);
            sourceHeight = heart.image.height;
            sourceWidth = heart.image.width;
            sourceY = 0;
            sourceX = 0;
            context.drawImage(heart.image, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight);
        }
        const vision =maze.images["vision"];
        if(this.vision && vision && vision.loaded){
            destinationHeight = cellWidth * 0.75;
            destinationWidth = cellWidth * 0.75;
            destinationY = y + 0.5 * (cellWidth - destinationHeight);
            destinationX = x + 0.5 * (cellWidth - destinationWidth);
            sourceHeight = vision.image.height;
            sourceWidth = vision.image.width;
            sourceY = 0;
            sourceX = 0;
            context.drawImage(vision.image, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight);
        }
        if(this.weapon && this.weapon.image && this.weapon.image.loaded) {
            const weapon = this.weapon.image;
            destinationHeight = cellWidth * 0.75;
            destinationWidth = cellWidth * 0.75;
            destinationY = y + 0.5 * (cellWidth - destinationHeight);
            destinationX = x + 0.5 * (cellWidth - destinationWidth);
            sourceHeight = weapon.image.height;
            sourceWidth = weapon.image.width;
            sourceY = 0;
            sourceX = 0;
            context.drawImage(weapon.image, sourceX, sourceY, sourceWidth, sourceHeight, destinationX, destinationY, destinationWidth, destinationHeight);
        }
        
        context.restore();
    } else if (this.luminance <= 0) {
        context.stroke();
        context.closePath();
        context.restore();
        return;
    }

    // // reset the luminance
    // this.luminance = 0;	

    // top wall 
    if (this.walls[0]) {
        context.moveTo(x, y);
        context.lineTo(xEnd, y);
    }
    // right wall 
    if (this.walls[1]) {
        context.moveTo(xEnd, y);
        context.lineTo(xEnd, yEnd);
    }
    // bottom wall 
    if (this.walls[2]) {
        context.moveTo(x, yEnd);
        context.lineTo(xEnd, yEnd);
    }
    // left wall 
    if (this.walls[3]) {
        context.moveTo(x, y);
        context.lineTo(x, yEnd);
    }

   

    context.stroke();
    context.closePath();
    context.restore();

    
}

Cell.prototype.renderClassic = function () {
    this.context.save()
    this.context.beginPath();
    this.context.strokeStyle = this.color;
    this.context.lineWidth = this.wallWidth;
    // top wall 
    if (this.walls[0]) {
        this.context.moveTo(this.topL.x, this.topL.y);
        this.context.lineTo(this.topR.x, this.topR.y);
    }
    // right wall 
    if (this.walls[1]) {
        this.context.moveTo(this.topR.x, this.topR.y);
        this.context.lineTo(this.bottomR.x, this.bottomR.y);
    }
    // bottom wall 
    if (this.walls[2]) {
        this.context.moveTo(this.bottomR.x, this.bottomR.y);
        this.context.lineTo(this.bottomL.x, this.bottomL.y);
    }
    // left wall 
    if (this.walls[3]) {
        this.context.moveTo(this.bottomL.x, this.bottomL.y);
        this.context.lineTo(this.topL.x, this.topL.y);
    }

    this.context.stroke();
    this.context.closePath();
    this.context.restore();

    if (this.oxygen != null) {
        this.oxygen.render();
    }

    if (this.safeZone) {
        this.context.save();
        this.context.rect(this.topL.x, this.topL.y, this.cellWidth, this.cellWidth);
        this.context.fillStyle = "rgba(255, 116, 0, 0.2)";
        this.context.fill();
        this.context.restore();
    }
    if(this === this.maze.exit){
        this.context.save();
        this.context.roundRect(this.topL.x, this.topL.y, this.cellWidth, this.cellWidth, 2);
        this.context.fillStyle = "rgba(72, 239, 255, 0.6)";
        this.context.fill();
        this.context.restore();
    }
}


Cell.prototype.topWall = function () {
    return this.walls[0];
}
Cell.prototype.rightWall = function () {
    return this.walls[1];
}
Cell.prototype.bottomWall = function () {
    return this.walls[2];
}
Cell.prototype.leftWall = function () {
    return this.walls[3];
}
