class Boost {
    constructor(x, y, color) {
      this.position = new JSVector(x, y);
      this.radius = 20;
      this.color = color;
    }
  
    applyBoost(hero) {
      // Default behavior (can be overridden by subclasses)
    }
  
    update() {
      // Common update logic for all boosts (if needed)
    }
  
    render(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  