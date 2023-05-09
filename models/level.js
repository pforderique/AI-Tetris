class Level {
  // arrangement is something like [[0, 1, 1, 0], [0, 1, 1, 0]]
  // to create a level with bricks in the middle
  constructor(arrangement) {
    // create the rep with brick objects
    this.bricks = new Set();
    this.rows = arrangement.length;
    this.cols = arrangement[0].length;
  
    const renderWidth = width/this.cols;
    const thickness = 20;
  
    const currentPos = {
      x: renderWidth / 2,
      y: thickness / 2,
    };
    arrangement.forEach((row) => {
      row.forEach((indicator) => {
        if (indicator === 1) {
          this.bricks.add(new Brick(currentPos.x, currentPos.y, renderWidth, thickness));
        }
        // update x pos for next brick
        currentPos.x += renderWidth;
      })
      // update x and y for next row
      currentPos.x = renderWidth / 2;
      currentPos.y += thickness;
    })
  }

  update() {
    // check ball collision for each brick
  }

  show() {
    // render the level to the screen
    this.bricks.forEach((brick) => brick.show());
  }

  checkCollision() {
    // returns brick and location of collision (0 for top/bottom or 1 for sides)
        // and removes brick from rep
    // returns undefined if no collision
  }

}
