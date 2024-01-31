class strengthPotion extends Boost {
    constructor(x, y) {
      super(x, y, "purple");
      this.strengthDuration = 20; // Duration of the strength boost in seconds
      this.strengthTimer = 0; // Timer to track the remaining duration
    }
  
    applyBoost(hero) {
      super.applyBoost(hero);
      hero.applyStrengthBoost(this.strengthDuration);
    }
  
    update() {
      super.update();
  
      // Check if the strength boost duration has expired
      if (this.strengthTimer <= 0) {
        this.active = false;
        this.strengthTimer = 0;
      } else {
        this.strengthTimer -= 1 / 60; // Assuming a frame rate of 60 frames per second
      }
    }
  }
  