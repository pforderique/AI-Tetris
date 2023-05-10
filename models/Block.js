class Block {
  constructor(x, y, color, width, height) {
    this.color = color;
    this.width = width;
    this.height = height;
    this.pos = createVector(x, y);
  }

  render() {
    fill(this.color);
    rect(this.pos.x*this.width, this.pos.y*this.height, this.width, this.height);
  }

  /**
   * Moves the block down by one
   */
  moveDownOne() { this.pos.y += 1; }

  moveLeft() { this.pos.x -= 1; }
  moveRight() { this.pos.x += 1; }

  rotate = () => {
    print('block rotate');
  } // TODO: remove this once Piece is implemented. Blocks should not rotate

  /**
   *
   * @returns current position of the block
   */
  getPos() {
    return this.pos.copy()
  }
}
