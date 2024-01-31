class Hero {
    constructor(x, y) {
      this.position = new JSVector(x, y);
      this.health = 100;
      this.strengthBoost = false;
      this.swordBoost = false;
      this.speed = 5; // idk put random speed
  
      //event listener for keyboard events
      this.handleKeyDown = this.handleKeyDown.bind(this);
      document.addEventListener("keydown", this.handleKeyDown);
    }
  
    handleKeyDown(event) {
      //(W, A, S, D)
      switch (event.key) {
        case "W":
          this.move(0, -this.speed); // Move up
          break;
        case "A":
          this.move(-this.speed, 0); // Move left
          break;
        case "S":
          this.move(0, this.speed); // Move down
          break;
        case "D":
          this.move(this.speed, 0); // Move right
          break;
      }
    }
  
    move(dx, dy) {
      // Move the hero by the specified amount
      this.position.x += dx;
      this.position.y += dy;
    }
  
    update() {
      // Check for boosts and apply them
      if (this.strengthBoost) {
        this.strengthBoost = false; // Reset the boost after applying
      }
  
      if (this.swordBoost) {
        this.swordBoost = false; // Reset the boost after applying
      }
    }
  
    render(ctx) {
      //Render hero
      ctx.fillStyle = "blue";
      ctx.fillRect(this.position.x - 15, this.position.y - 15, 30, 30);
  
      //Render health bar, p sure someone else is doing this
      ctx.fillStyle = "red";
      ctx.fillRect(this.position.x - 15, this.position.y - 25, (this.health / 100) * 30, 5);
    }
  }
  