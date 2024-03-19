"use strict";
class Oxygen {
    constructor(cell, context) {
        this.cell = cell;
        this.context = context;
        this.air = 20;
    }

    render() {
        if(this.air>0){
        this.context.save();
        this.context.beginPath();
        this.context.arc(this.cell.topLx + this.cell.cellWidth / 2, this.cell.topLy + this.cell.cellWidth / 2, this.air, 0, 2 * Math.PI);
        this.context.strokeStyle = "rgba(65, 140, 173, 1)";
        this.context.stroke();
        this.context.fillStyle = "rgba(117, 179, 206, 0.5)";
        this.context.fill();
        this.context.closePath();
        this.context.restore();
        }
        
    }
}