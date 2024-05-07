function createRandomEnemy() {
    let position = JSVector.random(world.levels[world.currentLevel].maze.width,
				   world.levels[world.currentLevel].maze.height);
    let n = Math.random();
    if (n < 1 / 6) {
	return new Powerade(position);
    } else if (n < 2 / 6) {
	return new KoolAid(position);
    } else if (n < 3 / 6) {
	return new SoloCup(position);
    } else if (n < 4 / 6) {
	return new AngryBag(position);
    } else if (n < 5 / 6) {
	return new AngrierBag(position);
    } 
    return new RingPack(position);

}

class Powerade extends Enemy {
    constructor(initialPosition) {
	let speed = world.maxSpeed * 0.95;
	let distanceToRecognizeHero = 3;
	let name = "Angry Powerade";
	let imageName = "enemy0";
	super(initialPosition, speed, distanceToRecognizeHero, name, imageName);
    }
}

class KoolAid extends Enemy {
    constructor(initialPosition) {
	let speed = world.maxSpeed * 0.95;
	let distanceToRecognizeHero = 3;
	let name = "Angry Kool Aid";
	let imageName = "enemy1";
	super(initialPosition, speed, distanceToRecognizeHero, name, imageName);
    }
}

class SoloCup extends Enemy {
    constructor(initialPosition) {
	let speed = world.maxSpeed * 0.85;
	let distanceToRecognizeHero = 5;
	let name = "Angry Solo Cup";
	let imageName = "enemy3";
	super(initialPosition, speed, distanceToRecognizeHero, name, imageName);
    }
}

class AngryBag extends Enemy {
    constructor(initialPosition) {
	let speed = world.maxSpeed * 0.70;
	let distanceToRecognizeHero = 6;
	let name = "Angry Plastic Bag";
	let imageName = "enemy5";
	super(initialPosition, speed, distanceToRecognizeHero, name, imageName);
    }
}

class AngrierBag extends Enemy {
    constructor(initialPosition) {
	let speed = world.maxSpeed * 0.70;
	let distanceToRecognizeHero = 6;
	let name = "Angrier Plastic Bag";
	let imageName = "enemy2";
	super(initialPosition, speed, distanceToRecognizeHero, name, imageName);
    }
}

class RingPack extends Enemy {
    constructor(initialPosition) {
	let speed = world.maxSpeed * 0.60;
	let distanceToRecognizeHero = 8;
	let name = "Angry Ring Pack";
	let imageName = "enemy4";
	super(initialPosition, speed, distanceToRecognizeHero, name, imageName);
    }
}
