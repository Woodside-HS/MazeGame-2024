function createRandomEnemy(section) {
    // TODO: random in section
    let position = JSVector.random(world.levels[world.currentLevel].maze.width,
				   world.levels[world.currentLevel].maze.height);
    position.floor();
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
	let diffCoef = 0.5 * (1 + world.difficulty / world.maxDifficulty);
	let speed = world.maxSpeed * 0.95 * diffCoef;
	let distanceToRecognizeHero = 3 * diffCoef;
	let name = "Angry Powerade";
	let imageName = "enemy0";
	let health = 10 * diffCoef;
	super(initialPosition, speed, distanceToRecognizeHero, health, name, imageName);
    }
}

class KoolAid extends Enemy {
    constructor(initialPosition) {
	let diffCoef = 0.5 * (1 + world.difficulty / world.maxDifficulty);
	let speed = world.maxSpeed * 0.95 * diffCoef;
	let distanceToRecognizeHero = 3 * diffCoef;
	let name = "Angry Kool Aid";
	let imageName = "enemy1";
	let health = 10 * diffCoef;
	super(initialPosition, speed, distanceToRecognizeHero, health, name, imageName);
    }
}

class SoloCup extends Enemy {
    constructor(initialPosition) {
	let diffCoef = 0.5 * (1 + world.difficulty / world.maxDifficulty);
	let speed = world.maxSpeed * 0.85 * diffCoef;
	let distanceToRecognizeHero = 5 * diffCoef;
	let name = "Angry Solo Cup";
	let imageName = "enemy3";
	let health = 15 * diffCoef;
	super(initialPosition, speed, distanceToRecognizeHero, health, name, imageName);
    }
}

class AngryBag extends Enemy {
    constructor(initialPosition) {
	let diffCoef = 0.5 * (1 + world.difficulty / world.maxDifficulty);
	let speed = world.maxSpeed * 0.70 * diffCoef;
	let distanceToRecognizeHero = 6 * diffCoef;
	let name = "Angry Plastic Bag";
	let imageName = "enemy5";
	let health = 20 * diffCoef;
	super(initialPosition, speed, distanceToRecognizeHero, health, name, imageName);
    }
}

class AngrierBag extends Enemy {
    constructor(initialPosition) {
	let diffCoef = 0.5 * (1 + world.difficulty / world.maxDifficulty);
	let speed = world.maxSpeed * 0.70 * diffCoef;
	let distanceToRecognizeHero = 6 * diffCoef;
	let name = "Angrier Plastic Bag";
	let imageName = "enemy2";
	let health = 20 * diffCoef;
	super(initialPosition, speed, distanceToRecognizeHero, health, name, imageName);
    }
}

class RingPack extends Enemy {
    constructor(initialPosition) {
	let diffCoef = 0.5 * (1 + world.difficulty / world.maxDifficulty);
	let speed = world.maxSpeed * 0.60 * diffCoef;
	let distanceToRecognizeHero = 8 * diffCoef;
	let name = "Angry Ring Pack";
	let imageName = "enemy4";
	let health = 25 * diffCoef;
	super(initialPosition, speed, distanceToRecognizeHero, health, name, imageName);
    }
}
