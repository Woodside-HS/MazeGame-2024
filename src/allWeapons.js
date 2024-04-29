//Little Stat Blocks for all weapons here
//in the super the syntax order is: damage, delay time (number of frames between attacks), range (in pixels), holder, weapon name, and image 
//we may have to adjust damage numbers on things, especially for enemies

// Weapon constructor
// constructor(damage, delay, length, range, holder, name, imagePath,) {}

class Sword extends Weapon{
    constructor(holder){
        let damage = 3;
        let delay = 90;
        let length = 0.33;
        let range = 0.33;
        let name = "Sword";
        let imagePath = "./resources/sword.png";
        super(damage, delay, range, length, holder, name, imagePath);
    }
}

class Spear extends Weapon{
    constructor(holder){
        let damage = 2;
        let delay = 110;
        let length = 0.75;
        let range = 1;
        let name = "Spear";
        let imagePath = "./resources/spear.png";
        super(damage, delay, range, length, holder, name, imagePath);
    }
}

class Trident extends Weapon{
    constructor(holder){
        let damage = 4;
        let delay = 100;
        let length = 0.6;
        let range = 0.75;
        let name = "Trident";
        let imagePath = "./resources/trident.png";
        super(damage, delay, range, length, holder, name, imagePath);
    }
}

class Dagger extends Weapon{
    constructor(holder){
        let damage = 2.5;
        let delay = 50;
        let length = 0.15;
        let range = 0.2;
        let name = "Dagger";
        let imagePath = "./resources/dagger.png";
        super(damage, delay, range, length, holder, name, imagePath);
    }
}
