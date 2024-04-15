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
    this.weapon = null;
    this.cellWidth = cellWidth;
    this.wallWidth = wallWidth;
    this.color = "rgba(0, 0, 255, 1)";
    this.topLx = this.col * this.cellWidth + this.maze.mazeLoc.x;
    this.topLy = this.row * this.cellWidth + this.maze.mazeLoc.y;
    this.topRx = this.topLx + this.cellWidth;
    this.topRy = this.topLy;
    this.bottomRx = this.topRx;
    this.bottomRy = this.topRy + this.cellWidth;
    this.bottomLx = this.topLx;
    this.bottomLy = this.topLy + this.cellWidth;

    this.walls = [true, true, true, true];//top, right, bottom, left (like a clock)

    this.safeZone = false;

    /* @type {float} (0 <= luminance <= 1) */
    this.luminance = 0;
    // this.type = "coral"; // Types for images
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

    const image = maze.images["background"];
    if (image && image.loaded && this.luminance > 0) {
        let sourceWidth = image.image.width / maze.width;
        let sourceHeight = image.image.height / maze.height;
        let sourceX = this.col * sourceWidth;
        let sourceY = this.row * sourceHeight;
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
        this.context.moveTo(this.topLx, this.topLy);
        this.context.lineTo(this.topRx, this.topRy);
    }
    // right wall 
    if (this.walls[1]) {
        this.context.moveTo(this.topRx, this.topRy);
        this.context.lineTo(this.bottomRx, this.bottomRy);
    }
    // bottom wall 
    if (this.walls[2]) {
        this.context.moveTo(this.bottomRx, this.bottomRy);
        this.context.lineTo(this.bottomLx, this.bottomLy);
    }
    // left wall 
    if (this.walls[3]) {
        this.context.moveTo(this.bottomLx, this.bottomLy);
        this.context.lineTo(this.topLx, this.topLy);
    }

    this.context.stroke();
    this.context.closePath();
    this.context.restore();

    if (this.oxygen != null) {
        this.oxygen.render();
    }
    if (this.safeZone) {
        this.context.save();
        this.context.rect(this.topLx, this.topLy, this.cellWidth, this.cellWidth);
        this.context.fillStyle = "rgba(255, 116, 0, 0.2)";
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
