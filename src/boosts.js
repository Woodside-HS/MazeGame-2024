"use strict";
function boosts(){


}

boosts.prototype.render = function (ctx, canvas) {
    // ctx.clearRect(canvas.width, canvas.height, canvas.width * 2, canvas.height * 2);
    let maze = this.world.levels[this.world.currentLevel].maze;
    let cell = maze.get(0, 0)

    ctx.strokeStyle = "rgba(255, 0, 0, 55)";
    ctx.fillStyle = "rgba(255, 0, 0, 55)";
    ctx.beginPath();
    ctx.arc(cell.topLx, cell.topLy, 29, Math.PI * 2, 0, false);
    ctx.stroke();
    ctx.fill();
}