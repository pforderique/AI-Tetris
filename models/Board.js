class Board {
  constructor() {
    this.width = BOARD.boardWidth;
    this.height = BOARD.boardHeight;

    this.grid = [...Array(this.height + 2).keys()].map((_) =>
      Array(this.width).fill(TYPES.EMPTY)
    );

    this.currentPiece = this.generatePiece()
    this.landedPieces = []; 
  }

  getGrid = () => this.grid;
  getWidth = () => this.width;
  getHeight = () => this.height;

  generatePiece() {
    const color = randChoose(ALL_COLORS);
    const x = Math.floor(Math.random() * (this.width - 1));
    const y = -2;

    return new Square(x, y, color);
    // return new Block(x, y, color);
  }

  step(move) {

    switch (move) {
      case ACTIONS.ROTATE:
        if (this.currentPiece.canRotate(this))
          this.currentPiece.rotate();
        break;
      case ACTIONS.LEFT:
        if (this.currentPiece.canMoveLeft(this))
          this.currentPiece.moveLeft();
        break;
      case ACTIONS.RIGHT:
        if (this.currentPiece.canMoveRight(this))
          this.currentPiece.moveRight();
        break;
      case ACTIONS.DOWN:
        while (this.currentPiece.canMoveDownOne(this))
          this.currentPiece.moveDownOne();
        break;
    }

    if (this.currentPiece.canMoveDownOne(this)) {
      this.currentPiece.moveDownOne();
    } else {
      // Add the current piece to landed and update grid
      this.currentPiece.getBlocks().forEach(block => {
        const pos = block.getPos();
        this.grid[pos.x][pos.y] = TYPES.BLOCKED;

        this.landedPieces.push(block);
      });

      // Move on to next piece
      this.currentPiece = this.generatePiece();
    }

    // Check for full rows and remove them
  }

  render(showGridlines = false) {
    // Render the gridlines
    if (showGridlines) {
      stroke(255);
      for (let row = 0; row < this.height; row++) {
        line(0, row * BOARD.blockHeight, width, row * BOARD.blockHeight);
      }
      for (let col = 0; col < this.width; col++) {
        line(col * BOARD.blockWidth, 0, col * BOARD.blockWidth, height);
      }
    }

    // Render the current piece
    this.currentPiece.render();

    // Render the landed pieces
    for(const piece of this.landedPieces) {
      piece.render();
    }
  }
}
