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
        this.maxSpeed = 0.039;
        this.currentLevel = 0;
        this.levels = [];
        /*
        1 = easy 
        2 = medium 
        3 = hard 
        */
        this.difficulty = 2;
        this.maxDifficulty = 4;

	this.images = {};
	this.loadImages();
    }


    run() {
        if(this.levels.length < 1){
            this.levels = [new Level(1, true)];
            this.levels[0].genLevel();
        }
        this.framecount++

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.levels[this.currentLevel].run();

        this.updateStatusBar();
    }
    updateStatusBar() {
        this.updateTimer();
        this.updateLevel();
        this.runScore();
        this.updateDifficultyDisplay();
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
        let hero = this.levels[this.currentLevel].hero;
        let sanjan = hero.getCenterMazeLocation().oxygen;
        if (sanjan != null && sanjan.air > 0) {
            if (hero.oxygen < 99.9) {
                hero.oxygen += 0.1;
                sanjan.air -= 0.1;
            }
        }
        let justin = hero.getCenterMazeLocation().safeZone;
        if (justin && hero.oxygen < 100) {
            hero.oxygen += 1;
        }
        let diego = hero.getCenterMazeLocation().vision;
        if (diego != null && hero.superVision === 0) {
            hero.superVision += 600;
            this.score += 20;
            diego.used = true;
        }
        let calvin = hero.getCenterMazeLocation().healthHeart;
        if (calvin != null && hero.health != 100) {
            hero.health += 30;
            hero.oxygen += 10;
            calvin.used = true;
            this.score += 40;
        }
        if (this.levels[world.currentLevel].hero.getCenterMazeLocation() === this.levels[world.currentLevel].maze.exit) {
            this.score += 100;
        }
        s.innerHTML = this.score;
    }
    updateDifficultyDisplay() {
        let d = document.getElementById("diffText");
        if (this.difficulty === 1) {
            d.innerHTML = "Easy";
        } else if (this.difficulty === 2) {
            d.innerHTML = "Medium";
        } else if (this.difficulty === 3) {
            d.innerHTML = "Hard";
        } else if(this.difficulty===4){
            d.innerHTML="Very Hard";
        } else if(this.difficulty===10){
            d.innerHTML="Impossible";
        }
    }
    nextLevel() {
        let w=this.levels[this.currentLevel].hero.weapon;
        let k = this.levels[this.currentLevel].hero.killCount;
        this.currentLevel++;
        this.levels.push(new Level(this.currentLevel + 1, true));
        this.levels[this.currentLevel].genLevel();
        this.levels[this.currentLevel].hero.weapon=w;
        this.levels[this.currentLevel].hero.killCount=k;
        this.levels[this.currentLevel].hero.weapon.holder=this.levels[this.currentLevel].hero;
        this.nextLevelScreen();
    }

    updateLevel() {
        let l = document.getElementById("level");
        l.innerHTML = this.currentLevel + 1;
    }
    nextLevelScreen(){
        let ctx = this.context;
        let cnv = this.canvas;
        ctx.rect(0, 0, cnv.width, cnv.height);
        ctx.fillStyle = "rgba(56,54,54,0.7)";
        ctx.fill();
        ctx.font = "bold 80px copperplate";
        ctx.fillStyle = "rgba(35,204,16)";
        ctx.textAlign="center";
        ctx.fillText("Congratulations!",(cnv.width/2),cnv.height/2-200);
        ctx.fillText("You have advanced to the next level!",(cnv.width/2),cnv.height/2-100);
        ctx.strokeStyle="rgb(46,41,40)"
        ctx.strokeText("Congratulations!",(cnv.width/2),cnv.height/2-200);
        ctx.strokeText("You have advanced to the next level!",(cnv.width/2),cnv.height/2-100);
        this.paused=true;
        let rp=document.getElementsByClassName("rPB");
        rp.item(0).innerHTML="Start Next";
     }
    deathScreen() {
        let ctx = this.context;
        let cnv = this.canvas;
        ctx.rect(0, 0, cnv.width, cnv.height);
        ctx.fillStyle = "rgba(56,54,54,0.7)";
        ctx.fill();
        ctx.font = "bold 80px copperplate";
        ctx.fillStyle = "rgba(204,35,16)";
        ctx.textAlign="center";
        ctx.fillText("you died lol",(cnv.width/2),cnv.height/2-200);
        ctx.strokeStyle="rgb(46,41,40)"
        ctx.strokeText("you died lol",(cnv.width/2),cnv.height/2-200);
        this.paused=true;
        let iT=document.getElementsByClassName("infoTile");
        iT.item(2).style.boxShadow="0 0 6px 6px #f50521";
        iT.item(2).style.backgroundImage="linear-gradient(#e00d26,#d4152b,#bf192c)";
        let rp=document.getElementsByClassName("rPB");
        rp.item(0).style.boxShadow="none";
        rp.item(0).style.backgroundImage = "linear-gradient(#35353b,#262629, #161617)";
        rp.item(1).style.boxShadow = "0 0 6px 6px #89a2f5";
        rp.item(1).style.backgroundImage = "linear-gradient(#80a2ec,#4871f8, #0162f3)";
    }
    
    loadImages() {
	const loadImage = (path, name) => {
            this.images[name] = { image: new Image(), loaded: false };
            this.images[name].image.addEventListener("load", () => {
		this.images[name].loaded = true;
            });
            this.images[name].image.src = path;
	}

	loadImage("./resources/background0.webp", "section0");
	loadImage("./resources/background1.webp", "section1");
	loadImage("./resources/background2.webp", "section2");
	loadImage("./resources/background3.webp", "section3");

	// loadImage("./resources/background.jpg", "background");
	loadImage("./resources/bubble.png", "bubble");
	loadImage("./resources/heart.png", "heart");
	loadImage("./resources/eye.png", "vision");
	loadImage("./resources/shell.png","shell");
	loadImage("./resources/blueBottle.png","enemy0");
	loadImage("./resources/redBottle.png","enemy1");
	loadImage("./resources/greyBag.png","enemy2");
	loadImage("./resources/redCup.png","enemy3");
	loadImage("./resources/ringPack.png","enemy4");
	loadImage("./resources/whiteBag.png","enemy5");
	loadImage("./resources/turtle.png","hero");

	for (let i = 1; i <= 18; ++i) {
	    loadImage(`./resources/turtle/turtle3/turtle00${i}.png`,`turtle${i-1}`);
	}
    }
    loadAudio() {
	const loadAudio = (path, name, map) => {
	    map[name] = {audio: new Audio(path), loaded: false};
	    map[name].audio.addEventListener("canplaythrough", () => {
		map[name].loaded = true;
	    });
	}

	const loadSound = (path, name) => loadAudio(path, name, this.sounds);
	const loadMusic = (path, name) => loadAudio(path, name, this.music);
    }
}
