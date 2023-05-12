class Block {
  constructor(x, y, color, isGhost = false) {
    this.color = color;
    this.pos = createVector(x, y);
    this.isGhost = isGhost;
  }

  render() {
    if (this.isGhost) {
      strokeWeight(2);
      stroke(this.color)
      fill(TRANSPARENT);
    } else {
      strokeWeight(1);
      stroke(0);
      fill(this.color);
    }
    rect(
      this.pos.x * BOARD.blockWidth,
      this.pos.y * BOARD.blockHeight,
      BOARD.blockWidth,
      BOARD.blockHeight
    );
  }

  /**
   * Moves the block down by one
   */
  moveDownOne() {
    this.pos.y += 1;
  }

  moveLeft() {
    this.pos.x -= 1;
  }

  moveRight() {
    this.pos.x += 1;
  }

  /**
   *
   * @returns current position of the block
   */
  getPos() {
    return this.pos.copy();
  }

  copy() {
    return new Block(this.pos.x, this.pos.y, this.color);
  }
}
