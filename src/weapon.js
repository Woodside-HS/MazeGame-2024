class Weapon {
    /**
     * Create a weapon
     * @param {number} damage - the amount of damage the weapon does per hit
     * @param {number} delay - the delay (in seconds) between strikes of the weapons
     * @param {number} range - the wepons range (relative to a cell)
     * @param {string} imagePath - the path of the image of the enemy
     */
    constructor(damage, delay, range, holder, name, imagePath) {
        // Stats
        this.damage = damage;
        this.delay = delay;
        this.range = range;
        this.holder=holder;
        if(holder.distanceToRecognizeHero!==undefined){//damage boost for enemy
            this.damage*=1.25;
            this.delay*=2;
            this.range*=0.25;
        }
        this.name=name;
        this.delayTime=delay;
        // Load the image
        this.image = {image: new Image(), loaded: false};
        this.image.image.addEventListener("load", () => {
            this.image.loaded = true;
        });
        this.image.image.src = imagePath;
    }
    attack(target){//still need to check for walls
        // let hp=this.holder.getMazeLocation();
        // let tp=this.target.getMazeLocation();
        
        if(((this.delayTime>=this.delay))&&(target.position.distance(this.holder.position)<this.range)){
            

            this.delayTime=0;
            target.health-=this.damage;
            if(target.health<0){
                target.health=0;
            }
            return true;
        } else {
            return false;
        }
    }
    render(){
        let ctx=world.context;
        ctx.drawImage(this.image.image, this.holder.position.x-30, this.holder.position.y-15,25,25);
    }
}
