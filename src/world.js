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
        this.renderCenter = false;
        this.maze = new Maze(this, 15, 15, this.renderCenter);
        this.maze.regenerate();
        this.hero = new Hero(this.maze);
        this.enemies = [];
        this.enemies[0] = new Enemy(this, new JSVector(10, 10));

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
    }


    run() {
        this.framecount++
      
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.maze.render(this.renderCenter);
        for (const enemy of this.enemies) {
            enemy.run(this.renderCenter);
        }

        this.hero.run(this.context, this.canvas, this.maze);
        this.updateStatusBar();
    }
    updateStatusBar(){
        this.updateTimer();
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
        if (((this.time % 60) === 0) && this.hero.health > 0) {
            this.score += 100;
        }
        //detects contact with oxygen
        let sanjan = this.hero.getMazeLocation().oxygen;
        if (sanjan != null && sanjan.air > 0) {
            if (this.hero.oxygen < 99.9) {
                this.hero.oxygen += 0.1;
                sanjan.air -= 0.1;
            }
            this.score += 1;
        }
        if (this.hero.getMazeLocation() === this.maze.exit) {
            this.score += 1000;
        }
        s.innerHTML = this.score;
    }
}


