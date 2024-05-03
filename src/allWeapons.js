//Little Stat Blocks for all weapons here
//in the super the syntax order is: damage, delay time (number of frames between attacks), range (in cells), holder, weapon name, and image 
//we may have to adjust damage numbers on things, especially for enemies

// Weapon constructor
// constructor(damage, delay, length, range, holder, name, imagePath,) {}

class Dagger extends Weapon{
    constructor(holder){
        let damage = 2.5;
        let delay = 40;
        let length = 0.15;
        let range = 0.25;
        let name = "Dagger";
        let imagePath = "./resources/dagger1.png";
        super(damage, delay, range, length, holder, name, imagePath);
    }
}
class Sword extends Weapon{
    constructor(holder){
        let damage = 3;
        let delay = 90;
        let length = 0.33;
        let range = 0.33;
        let name = "Sword";
        let imagePath = "./resources/sword1.png";
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
        let imagePath = "./resources/spear1.png";
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
        let imagePath = "./resources/trident1.png";
        super(damage, delay, range, length, holder, name, imagePath);
    }
}
class SuperDagger extends Weapon{
    constructor(holder){
        let damage = 4.5;
        let delay = 30;
        let length = 0.15;
        let range = 0.3;
        let name = "Magic Dagger";
        let imagePath = "./resources/dagger2.png";
        super(damage, delay, range, length, holder, name, imagePath);
    }
}
class SuperSword extends Weapon{
    constructor(holder){
        let damage = 6;
        let delay = 70;
        let length = 0.33;
        let range = 0.6;
        let name = "Magic Sword";
        let imagePath = "./resources/sword2.png";
        super(damage, delay, range, length, holder, name, imagePath);
    }
}
class SuperSpear extends Weapon{
    constructor(holder){
        let damage = 5;
        let delay = 90;
        let length = 0.75;
        let range = 1.2;
        let name = "Spear";
        let imagePath = "./resources/spear2.png";
        super(damage, delay, range, length, holder, name, imagePath);
    }
}
class SuperTrident extends Weapon{
    constructor(holder){
        let damage = 8;
        let delay = 60;
        let length = 0.6;
        let range = 0.9;
        let name = "Magic Trident";
        let imagePath = "./resources/trident2.png";
        super(damage, delay, range, length, holder, name, imagePath);
    }
}