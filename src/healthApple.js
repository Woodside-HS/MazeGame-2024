healthApple extends Boost(x, y) {
      super(x, y, "gold");
    }
  
    applyBoost(hero) {
      hero.health = 100; // Set hero's health to full
    }
  }