/* @type {World} */
this.world;
this.levels = [];

window.addEventListener("load", init);

function init() {
    world = new World();
    levels.push(new Level(world, 0));
    levels[0].baseLevel();
    //levels[0].nextLevel();
    addAllListeners();
    run();
}

function run() {
    window.requestAnimationFrame(run);
    if(!world.paused){
        world.run();
    }
}

function addAllListeners(){
    let p=document.getElementById("pauseB");
    p.addEventListener("click",swapPause);
}
function swapPause(){
    if(world.paused){
        world.paused=false;
    } else{
        world.paused=true;
    }
}
