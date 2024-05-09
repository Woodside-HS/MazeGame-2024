/*
a level object contains all of the properties in the level:
- maze 
- hero 
- enemies 

the level object should have generate maze, 
generate hero, and generate enemies methods 

*/

class Level {
    constructor(rows, cols, mL, levelNum, renderCenter) {
        this.levelNum = levelNum;//starts at 1 
        this.rows = rows;
        this.cols = cols;
        this.mazeLength = mL
        this.renderCenter = renderCenter;
        this.maze;
        this.hero;
        this.enemies = [];
    }

    run() {
        this.maze.render(this.renderCenter);

        this.hero.run(this.renderCenter);

        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].run(this.renderCenter);
            if (this.enemies[i].health <= 0) {
                this.enemies.splice(i, 1);
                //console.log(`Enemy killed at ${Date.now()}`);
            }
        }

        if (this.renderCenter)
            this.maze.resetLuminances();

        this.arrowToExit();
    }

    genLevel() {
        //maze 
        this.maze = new Maze(world, this, new JSVector(0, 0), this.rows, this.cols, this.mazeLength, this.renderCenter);
        let mL = this.mazeLength;
        for (let r = 0; r < this.rows / mL; r++) {
            for (let c = 0; c < this.cols / mL; c++) {
                this.maze.regenerate(mL * r, mL * c, r * mL + mL, c * mL + mL);
            }
        }
        this.maze.addPaths(15);
        this.maze.exit();
        this.safeZones();
	let hx = this.rows/2;
        let hy = this.cols/2
        this.hero = new BetterHero(world, new JSVector(hx, hy));
	let sections = (this.maze.width / this.maze.mazeLength) ** 2;
	let enemiesPerSection = world.difficulty + world.currentLevel;
        for (let s = 0; s < sections; ++s) {
	    for (let i = 0; i < enemiesPerSection; ++i) {
		this.enemies[i] = createRandomEnemy(s);
	    }
        }
    }

    arrowToExit() {

        let center = this.maze.getCenter();//in terms of rows and cols 
        let exit = new JSVector(this.maze.exit.col + 0.5, this.maze.exit.row + 0.5);//in terms of rows and cols 
        let arrow = new JSVector.subGetNew(exit, center);
        if (world.difficulty === 1) {
            this.renderArrow(arrow);
        }
        else if (world.difficulty === 2) {
            if (arrow.x * arrow.x + arrow.y * arrow.y < 81) {
                this.renderArrow(arrow);
            }
        }
        else if(world.difficulty === 3){
            //no arrow 
        }
    }

    renderArrow(arrow) {
        let ctx = world.context;
        ctx.save();
        ctx.translate(world.canvas.width - 80, world.canvas.height - 80);
        ctx.rotate(arrow.getDirection());
        ctx.beginPath();
        ctx.moveTo(50, 0);
        ctx.lineTo(0, 0);
        ctx.moveTo(50, 0);
        ctx.lineTo(30, 30);
        ctx.moveTo(50, 0);
        ctx.lineTo(30, -30);
        ctx.strokeStyle = "rgba(255, 255, 255)";
        ctx.lineWidth = 6;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    safeZones() {
        let sloc = this.maze.sloc;
        for (let i = 0; i < sloc.length; i++) {
            let r = sloc[i].row;
            let c = sloc[i].col;
            let grid = this.maze.grid;
            grid[r][c].safeZone = true;//box 1
            grid[r - 1][c].walls[2] = false;//top cell removes bottom wall 
            grid[r][c - 1].walls[1] = false;//left cell removes right wall
            grid[r][c + 1].safeZone = true;//box 2
            grid[r - 1][c + 1].walls[2] = false;//top cell removes bottom wall 
            grid[r][c + 2].walls[3] = false;//left cell removes right wall 
            grid[r + 1][c].safeZone = true;//box 3
            grid[r + 2][c].walls[0] = false;//bottom cell removes top wall 
            grid[r + 1][c - 1].walls[1] = false;//left cell removes right wall 
            grid[r + 1][c + 1].safeZone = true;//box 4 
            grid[r + 2][c + 1].walls[0] = false;//bottom cell removes top wall 
            grid[r + 1][c + 2].walls[3] = false;//right cell removes left wall 
            /*
            r and c are the row and column (respectively) 
            of box 1 in the safe zone 
            
            safe zone: 
            [box 1] [box 2]
            [box 3] [box 4]

            all boxes are parts of different sections of the maze, 
            the safe zones are always at the corner that four mazes share 

            all walls are removed in the safe zone cells 
            */
        }
    }
}
