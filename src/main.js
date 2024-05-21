"use strict";
/* @type {World} */
let world;

window.addEventListener("load", init);

function init() {
    let style = "background: blue; color: black; font-family: monospace; font-weight: bold;";
    console.log("%c  ___        ___  ___                   _____            _ \n"
		+ " / _ \\       |  \\/  |                  |_   _|          | |\n"
		+ "/ /_\\ \\______| .  . | __ _ _______ ______| | _ __   __ _| |\n"
		+ "|  _  |______| |\\/| |/ _` |_  / _ \\______| || '_ \\ / _` | |\n"
		+ "| | | |      | |  | | (_| |/ /  __/     _| || | | | (_| |_|\n"
		+ "\\_| |_/      \\_|  |_/\\__,_/___\\___|     \\___/_| |_|\\__, (_)\n"
		+ "                                                    __/ |  \n"
		+ "                                                   |___/   ", style);
    
    world = new World();

    var urlParams = new URLSearchParams(window.location.search);
    var data = urlParams.get('data');
    console.log("THIS IS DATAAA " + data)

    data = "2medium+3hard+1easy.300"
    
    let justLevels = data.split(".")

    console.log("JSUT LEVELS")
    console.log(justLevels[0])
    console.log(justLevels[0].slice(1))

    let j = justLevels[0].slice(1)

    let wDiff=localStorage.getItem("gameDiff");
    //localStorage.clear();
    wDiff=Number(wDiff);
    if(wDiff!=1 && wDiff!=2&&wDiff!=3&&wDiff!=4&&wDiff!=10){
        wDiff=2;
    }
    world.difficulty=wDiff;

    console.log("WDIFF " + wDiff)

    let splitLevels = j.split("+")

    let diffString

    if(wDiff == 1){
        diffString = "easy"
    } else if(wDiff == 2){
        diffString = "medium"
    } else if(wDiff == 3){
        diffString = "hard"
    } else if(wDiff == 4){
        diffString = "veryHard"
    } else if(wDiff == 10){
        diffString = "impossible"
    }

    for(let i = 0; i < splitLevels.length; i++){
        let firstChar = splitLevels[i].charAt(0);

        let restOfString = splitLevels[i].slice(1);

        console.log(restOfString)
        console.log(firstChar)

        if(diffString == restOfString){
            console.log("AHHHHHHHHHHHHHHHHH LEVEL CHANGEEE" + firstChar + restOfString)
            world.currentLevel = firstChar - 1
        }
        
    }



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
        world.currentLevel = 0;
        world.levels = [new Level(1, true)]
        world.levels[0].genLevel();
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
