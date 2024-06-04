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

    world.levelData = data

    // data = "2medium+3hard+1easy.300"
    
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

    console.log("DIFICULTUY " + justLevels[3])
    world.cultyString = justLevels[3]
    // wDiff = justLevels[4]

    world.difficulty= Number(justLevels[3]);

    console.log("WDIFF " + wDiff)

    console.log("USERNAME = " + justLevels[2].replace(/["]/g, ''))

    this.username = justLevels[2].replace(/["]/g, '')

    console.log("I DID IT")

    let splitLevels = j.split("+")


    world.username = this.username
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
    // world.cultyString = diffString


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

    let music = document.querySelector("#music");
    music.addEventListener("click", toggleMusic)
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

function toggleMusic() {
    let music = document.querySelector("#music");
    let audio = document.querySelector("#audio");
    document.querySelector("#audioIcon").remove();
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    svg.setAttribute("viewBox", "0 0 640 512");
    svg.setAttribute("id", "audioIcon");
    // svg.setAttribute("style", "width: 50px; height: 50px;");
    let path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    	path.setAttribute("fill", "white");
    if (audio.paused) {
	path.setAttribute("d", "M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z");
	audio.play();
    } else {
	path.setAttribute("d", "M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z");
	audio.pause();
    }
    svg.append(path);
    music.append(svg);
}
