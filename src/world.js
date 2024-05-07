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
        this.currentLevel = 0;
        this.levels = [new Level(30, 30, 15, 1, true)];//rows, cols, level number, renderCenter 
        /*
        1 = easy 
        2 = medium 
        3 = hard 
        */
        this.difficulty=1;
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
        if (((this.time % 120) === 0) && this.levels[world.currentLevel].hero.health > 0) {
            this.score += 1;
        }
        //detects contact with oxygen
        let hero=this.levels[this.currentLevel].hero;
        let sanjan = hero.getMazeLocation().oxygen;
        if (sanjan != null && sanjan.air > 0) {
            if (hero.oxygen < 99.9) {
               hero.oxygen += 0.1;
                sanjan.air -= 0.1;
                //this.score += 1;
            }
            //this.score += 1;
        }
        let justin = hero.getMazeLocation().safeZone;
        if(justin && hero.oxygen < 100){
            hero.oxygen += 1;
        }
        let diego=hero.getMazeLocation().vision;
        if(diego!=null&&hero.superVision===0){
            hero.superVision+=600;
            this.score+=20;
            diego.used=true;
        }
        let calvin=hero.getMazeLocation().healthHeart;
        if (calvin != null&&hero.health!=100) {
            hero.health+=30;
            hero.oxygen+=10;
            calvin.used=true;
            this.score += 40;
        }
        if (this.levels[world.currentLevel].hero.getMazeLocation() === this.levels[world.currentLevel].maze.exit) {
            this.score += 100;
        }
        s.innerHTML = this.score;
    }

    nextLevel() {
        this.currentLevel++;
        let row = this.currentLevel * 10;
        let col = row;
        let mL = row/2
        this.levels.push(new Level(row, col, mL, this.currentLevel+1, true));
        this.levels[this.currentLevel].genLevel();
    }

    updateLevel() {
        let l = document.getElementById("level");
        l.innerHTML = this.currentLevel + 1;
    }
    deathScreen() {
        let ctx = this.context;
        let cnv = this.canvas;
        ctx.rect(0, 0, cnv.width, cnv.height);
        ctx.fillStyle = "rgba(56,54,54,0.7)";
        ctx.fill();
        ctx.font = "bold 80px copperplate";
        ctx.fillStyle = "rgba(204,35,16)";
        //will be off center but I'm working on fixing it - should be fixed 5/5
        ctx.textAlign="center";
        ctx.fillText("you died lol",(cnv.width/2),cnv.height/2);
        ctx.strokeStyle="rgb(46,41,40)"
        ctx.strokeText("you died lol",(cnv.width/2),cnv.height/2);
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
