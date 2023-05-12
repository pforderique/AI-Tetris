class Board {
  constructor() {
    this.width = BOARD.boardWidth;
    this.height = BOARD.boardHeight;
  }

  getGrid = () => this.grid;
  getWidth = () => this.width;
  getHeight = () => this.height;

  setup() {
    this.grid = [...Array(this.height).keys()].map((_) =>
      Array(this.width).fill(TYPES.EMPTY)
    );
    this.landedBlocks = [];
    this.currentPiece = Piece.generatePiece(this);
    this.projectedPiece = this.currentPiece.getProjectedPiece(this);
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

    // Render the landed pieces
    this.landedBlocks.forEach((piece) => piece.render());

    // Render the projected piece
    this.projectedPiece.render();

    // Render the current piece
    this.currentPiece.render();
  }

  step(move) {
    if (!this.currentPiece) this.currentPiece = Piece.generatePiece(this);

    switch (move) {
      case ACTIONS.ROTATE:
        if (this.currentPiece.canRotate(this)) {
          this.currentPiece.rotate();
          this.projectedPiece = this.currentPiece.getProjectedPiece(this);
        }
        break;
      case ACTIONS.LEFT:
        if (this.currentPiece.canMoveLeft(this)) {
          this.currentPiece.moveLeft();
          this.projectedPiece = this.currentPiece.getProjectedPiece(this);
        }
        break;
      case ACTIONS.RIGHT:
        if (this.currentPiece.canMoveRight(this)) {
          this.currentPiece.moveRight();
          this.projectedPiece = this.currentPiece.getProjectedPiece(this);
        }
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
      this.currentPiece.getBlocks().forEach((block) => {
        const pos = block.getPos();

        if (this.grid[pos.y]) this.grid[pos.y][pos.x] = TYPES.BLOCKED;

        this.landedBlocks.push(block);
      });

      // Check for full rows and remove them
      this._removeRows(this._getFilledRows());

      // Move on to next piece
      this.currentPiece = Piece.generatePiece(this);
      this.projectedPiece = this.currentPiece.getProjectedPiece(this);
    }
  }

  checkGameOver() {
    return this.landedBlocks.some((block) => block.getPos().y < 0);
  }

  _getFilledRows() {
    const filledRows = [];
    for (let row = 0; row < this.height; row++) {
      if (this.grid[row].every((cell) => cell === TYPES.BLOCKED)) {
        filledRows.push(row);
      }
    }
    return filledRows;
  }

  _removeRows(rows) {
    // Remove the rows from the grid
    for (const row of rows) {
      print("removing row", row);
      this.grid.splice(row, 1);
      this.grid.unshift(Array(this.width).fill(TYPES.EMPTY));

      // Remove landed pieces on this row
      this.landedBlocks = this.landedBlocks.filter(
        (piece) => piece.getPos().y != row
      );

      // Move down all landed pieces above this row
      this.landedBlocks
        .filter((piece) => piece.getPos().y < row)
        .forEach((piece) => piece.moveDownOne());
    }
  }
}
