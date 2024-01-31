class StrengthPotion extends Boost {
    constructor(x, y) {
      super(x, y, "purple");
      this.strengthDuration = 20; // Duration of the strength boost in seconds
      this.strengthTimer = 0; // remaining time
    }
  
    applyBoost(hero) {
      super.applyBoost(hero);
      hero.applyStrengthBoost(this.strengthDuration);
    }
  
    update() {
      super.update();
  
      // Check if boost ran out
      if (this.strengthTimer <= 0) {
        this.active = false;
        this.strengthTimer = 0;
      } else {
        this.strengthTimer -= 1 / 60; // Assuming 60 fps
      }
    }
  }
  