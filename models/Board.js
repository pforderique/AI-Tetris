class Board {
  constructor(width, height) {
    this.width = width;
    this.height = height; // Add two rows for the top

    this.grid = []; // TODO: fil this in and add current Piece
  }

  moveDown() {
  }

  render(showGridlines = false) {
    const blockWidth = width / this.width;
    const blockHeight = height / this.height;

    // Render the gridlines
    if (showGridlines) {
      stroke(255);
      for (let row = 0; row < this.height; row++) {
        line(0, row*blockHeight, 1000, row*blockHeight);
      }
      for (let col = 0; col < this.width; col++) {
        line(col*blockWidth, 0, col*blockWidth, height);
      }
    }

    // Render the current piece
  }
}
