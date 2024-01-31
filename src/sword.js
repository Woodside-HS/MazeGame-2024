class Sword extends Boost {
    constructor(x, y) {
      super(x, y, "gray");
    }
  
    applyBoost(hero) {
      hero.swordBoost = true; // indicate sword boost
    }
  }
  