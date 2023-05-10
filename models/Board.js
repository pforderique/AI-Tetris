const TYPES = {
  O: 0, // empty
  B: 1, // block
  C: 2, // current block
};

class Board {
  constructor(w, h) {
    this.width = w;
    this.height = h; // Add two rows for the top

    this.blockWidth = UI.width / w;
    this.blockHeight = UI.height / h;

    this.grid = [...Array(this.height + 2).keys()].map((_) =>
      Array(this.width).fill(null)
    );

    this.currentPiece = this.generatePiece()
    this.landedPieces = []; 
  }

  generatePiece() {
    const color = randChoose(ALL_COLORS);
    const x = Math.floor(Math.random() * this.width);
    const y = -2;
    return new Block(x, y, color, this.blockWidth, this.blockHeight);
  }

  _canMoveDownOne() {
    const pos = this.currentPiece.getPos();
    return (
      this.currentPiece.getPos().y + 1 < this.height &&
      this.grid[pos.x][pos.y + 1] == null
    );
  }

  _canMoveLeft() {
    const pos = this.currentPiece.getPos();
    return (pos.x - 1 >= 0 && this.grid[pos.x - 1][pos.y] != TYPES.B);
  }

  _canMoveRight() {
    const pos = this.currentPiece.getPos();
    return (pos.x + 1 < this.width && this.grid[pos.x + 1][pos.y] != TYPES.B);
  }

  _canRotate() {
    const pos = this.currentPiece.getPos();
    // TODO: implement
    return true;
  }

  step(move) {

    switch (move) {
      case ACTIONS.ROTATE:
        this._canRotate() && this.currentPiece.rotate();
        break;
      case ACTIONS.LEFT:
        this._canMoveLeft() && this.currentPiece.moveLeft();
        break;
      case ACTIONS.RIGHT:
        this._canMoveRight() && this.currentPiece.moveRight();
        break;
      case ACTIONS.DOWN:
        while (this._canMoveDownOne()) {
          this.currentPiece.moveDownOne();
        }
        break;
    }

    if (this._canMoveDownOne()) {
      this.currentPiece.moveDownOne();
    } else {
      // Add the current piece to landed and update grid
      this.landedPieces.push(this.currentPiece);
      const pos = this.currentPiece.getPos();
      this.grid[pos.x][pos.y] = TYPES.B;

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
        line(0, row * this.blockHeight, width, row * this.blockHeight);
      }
      for (let col = 0; col < this.width; col++) {
        line(col * this.blockWidth, 0, col * this.blockWidth, height);
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
