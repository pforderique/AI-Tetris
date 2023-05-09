class Block {
  constructor(x, y, color, size) {
    this.color = color("#f3f");
    this.speed = 7;
    this.pos = createVector(x, y);
  }

  render() {
    fill(this.color);
    square(this.pos.x, this.pos.y, size);
  }

  /**
   * Moves the block down by one
   */
  moveDown() {
    this.pos.y += 1;
  }

  /**
   *
   * @returns current position of the block
   */
  getPos() {
    return this.pos.copy()
  }
}
