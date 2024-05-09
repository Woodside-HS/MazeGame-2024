"use strict";
/* @type {World} */
let world;

window.addEventListener("load", init);

function init() {
    world = new World();
    world.levels[world.currentLevel].genLevel();
    let wDiff=localStorage.getItem("gameDiff");
    localStorage.clear();
    wDiff=Number(wDiff);
    if(wDiff!=1 && wDiff!=2&&wDiff!=3){
        wDiff=2;
    }
    world.difficulty=wDiff;
    addAllListeners();
    run();
}

function run() {
    window.requestAnimationFrame(run);
    if(!world.paused){
        world.run();
    }
}

function addAllListeners () {
    let p = document.getElementById("pauseB");
    p.addEventListener("click", swapPause);
    let r=document.getElementById("restartB");
    r.addEventListener("click",restart);
}
function swapPause () {
    world.paused = !world.paused;
    let p=document.getElementById("pauseB");
    let r=document.getElementById("restartB")
    let d=document.getElementById("diff");
    if(p.innerHTML==="Pause"){
        p.innerHTML="Resume";
        r.style.boxShadow="0 0 6px 6px #89a2f5";
        r.style.backgroundImage = "linear-gradient(#80a2ec,#4871f8, #0162f3)";
        d.style.boxShadow="0 0 6px 6px #89a2f5";
        d.style.backgroundImage = "linear-gradient(#80a2ec,#4871f8, #0162f3)";
    } else {
        p.innerHTML="Pause";
        r.style.boxShadow="none";
        r.style.backgroundImage = "linear-gradient(#35353b,#262629, #161617)";
    }
}
function restart(){
    let p=document.getElementById("pauseB");
    let r=document.getElementById("restartB");
    if(world.paused){
        world.levels[world.currentLevel].genLevel();
        world.currentLevel=0;
        world.paused = false;
        world.time=0;
        world.score=0;
        p.innerHTML="Pause";
        r.style.boxShadow="none";
        r.style.backgroundImage = "linear-gradient(#35353b,#262629, #161617)";
        p.style.boxShadow="0 0 6px 6px #89a2f5";
        p.style.backgroundImage = "linear-gradient(#80a2ec,#4871f8, #0162f3)";
    }
}