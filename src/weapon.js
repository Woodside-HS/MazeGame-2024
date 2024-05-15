class Weapon {
    /**
     * Create a weapon
     * @param {number} damage - the amount of damage the weapon does per hit
     * @param {number} delay - the delay (in seconds) between strikes of the weapons
     * @param {number} length - the wepons length (relative to a cell)
     * @param {number} range - the wepons range (relative to a cell)
     * @param {BetterHero|Enemy} holder - the character that is holding the weapon
     * @param {string} name - the name of the weapon
     * @param {string} imagePath - the path of the image of the enemy
     */
    constructor(damage, delay, range, length, holder, name, imagePath) {
        // Stats
        this.damage = damage;
        this.delay = delay;
        //needed for range
        this.range = range;
        this.length=length;
        this.holder=holder;
        if(holder.distanceToRecognizeHero!==undefined){//damage boost for enemy
            this.damage*=2;
            this.delay*=2;
            this.range*=1.2;
        }
        this.name=name;
        this.delayTime=delay;

        // Animation
        // Time to animate (for all weapons, in seconds)
        this.animationDuration = 0.75;
        // Current time spent animating
        this.animationTime = 0;
        
        // Load the image
        this.image = {image: new Image(), loaded: false};
        this.image.image.addEventListener("load", () => {
            this.image.loaded = true;
        });
        this.image.image.src = imagePath;
    }

    attack(target){//still need to check for walls
        // let hp=this.holder.getCenterMazeLocation();
        // let tp=target.getCenterMazeLocation();
	let canAttack = ((this.delayTime>=this.delay))&&(target.position.distanceSquared(this.holder.position)<this.range*this.range);
	if (!canAttack) {
	    return false;
        } else {
	        this.delayTime=0;
            target.health-=this.damage;
            if(target.health<0){
                target.health=0;
            }
            //console.log(`${this.holder.constructor.name} hit ${target.constructor.name} at ${Date.now()}`);
            return true;
        }
    }
}
