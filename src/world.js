"use strict";
class World {
    constructor() {
        this.canvas = document.getElementById("cnv1");
        this.context = this.canvas.getContext("2d");

        // from Diego 
        // Scales canvas correctly
        const devicePixelRatio = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.clientWidth * devicePixelRatio;
        this.canvas.height = this.canvas.clientHeight * devicePixelRatio;
        if (!window.devicePixelRatio)
            this.context.scale(devicePixelRatio, devicePixelRatio);
        // performance (from Ecosystem)
        this.framerate = 60;
        this.framecount = 0;
        // every second (250 ms), see how many times that world.run()
        // has executed.
        setInterval(function () {
            world.framerate = world.framecount;
            world.framecount = 0;
        }, 1000);
        this.paused = false;
        this.time = 0;
        this.msTime = 0;
        this.score = 0;
this.l=1;
        this.currentLevel = 0;
        this.levels = [new Level(15, 15, 1, true)];//rows, cols, level number, renderCenter 
        this.genLevel(this.levels[0]);
    }


    run() {
        this.framecount++

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.levels[this.currentLevel].run();

        this.updateStatusBar();
    }
    updateStatusBar() {
        this.updateTimer();
        this.updateLevel();
        this.runScore();
    }
    updateTimer() {
        this.time++;
        let t = document.getElementById("time");
        this.msTime = Math.round(this.time * 1000 / 60) / 1000;
        t.innerHTML = Math.round(this.time / 60);
    }
    runScore() {
        let s = document.getElementById("score");
        if (((this.time % 60) === 0) && this.levels[world.currentLevel].hero.health > 0) {
            this.score += 100;
        }
        //detects contact with oxygen
        let sanjan = this.levels[world.currentLevel].hero.getMazeLocation().oxygen;
        if (sanjan != null && sanjan.air > 0) {
            if (this.levels[world.currentLevel].hero.oxygen < 99.9) {
                this.levels[world.currentLevel].hero.oxygen += 0.1;
                sanjan.air -= 0.1;
            }
            this.score += 1;
        }
        if (this.levels[world.currentLevel].hero.getMazeLocation() === this.levels[world.currentLevel].maze.exit) {
            this.score += 1000;
        }
        s.innerHTML = this.score;
    }


    genLevel(level) {
        level.maze = new Maze(this, level.rows, level.cols, level.renderCenter);
        level.maze.regenerate();
        level.hero = new BetterHero(this, new JSVector(0, 0));
        for (let i = 0; i < 4+2*this.currentLevel; i++) {
            let x=Math.floor(Math.random()*this.canvas.width/level.maze.cellWidth);
            let y=Math.floor(Math.random()*this.canvas.height/level.maze.cellWidth);
            console.log(x+"   "+y);
            level.enemies[i] = new Enemy(this, new JSVector(x, y));
        }
    }

    nextLevel(row, col, renderCenter){
        let ln = this.levels.length;
        this.currentLevel = ln;
        this.levels.push(new Level(row, col, ln, renderCenter));
        this.genLevel(this.levels[ln]);
    }

    updateLevel(){
        let l=document.getElementById("level");
        l.innerHTML=this.currentLevel+1;
    }
    deathScreen(){
        let ctx=this.context;
        let cnv=this.canvas;
        ctx.rect(0,0,cnv.width,cnv.height);
        ctx.fillStyle="rgba(56,54,54,0.7)";
        ctx.fill();
        ctx.font="bold 80px copperplate";
        ctx.fillStyle="rgba(204,35,16)";
        //will be off center but I'm working on fixing it
        ctx.fillText("you died lol",(cnv.width/2)-280,cnv.height/2);
        ctx.strokeStyle="rgb(46,41,40)"
        ctx.strokeText("you died lol",(cnv.width/2)-280,cnv.height/2);
        this.paused=true;
        let iT=document.getElementsByClassName("infoTile");
        iT.item(2).style.boxShadow="0 0 6px 6px #f50521";
        iT.item(2).style.backgroundImage="linear-gradient(#e00d26,#d4152b,#bf192c)";
        let rp=document.getElementsByClassName("rPB");
        rp.item(0).style.boxShadow="none";
        rp.item(0).style.backgroundImage = "linear-gradient(#35353b,#262629, #161617)";
        rp.item(1).style.boxShadow="0 0 6px 6px #89a2f5";
        rp.item(1).style.backgroundImage = "linear-gradient(#80a2ec,#4871f8, #0162f3)";
    }
}
