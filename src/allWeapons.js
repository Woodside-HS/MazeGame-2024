//Little Stat Blocks for all weapons here
//in the super the syntax order is: damage, delay time (number of frames between attacks), range (in pixels), holder, weapon name, and image 
//we may have to adjust damage numbers on things, especially for enemies
class Sword extends Weapon{
    constructor(holder){
        super(3,90,10,holder,"Sword","./resources/sword.png");
    }
}
class Spear extends Weapon{
    constructor(holder){
        super(2,110,20,holder,"Spear","./resources/spear.png");
    }
}
class Trident extends Weapon{
    constructor(holder){
        super(4,100,15, holder,"Trident","./reosources/trident.png");
    }
}
class Dagger extends Weapon{
    constructor(holder){
        super(1.5,50,5, holder,"Dagger","./resources/dagger.png");
    }
}