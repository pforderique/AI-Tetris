class Board {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = BOARD.boardWidth;
    this.height = BOARD.boardHeight;
  }

  getGrid = () => this.grid;
  getWidth = () => this.width;
  getHeight = () => this.height;

  // Returns the x and y offsets of the board in # of blocks
  getXOffset = () => Math.floor(this.x / BOARD.blockWidth);
  getYOffset = () => Math.floor(this.y / BOARD.blockHeight);

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

  /**
   * 
   * @param {ACTIONS} move action to perform
   * @returns number of rows cleared
   */
  step(move) {
    if (!this.currentPiece) this.currentPiece = Piece.generatePiece(this);
    this._handleMove(move);

    if (this.currentPiece.canMoveDownOne(this)) {
      this.currentPiece.moveDownOne();
    } else {
      // Add the current piece to landed and update grid
      this.currentPiece.getBlocks().forEach((block) => {
        const worldPos = block.getPos();
        const localPos = this.blockWorld2Local(worldPos);

        if (this.grid[localPos.y]) this.grid[localPos.y][localPos.x] = TYPES.BLOCKED;

        this.landedBlocks.push(block);
      });

      // Check for full rows and remove them
      const filledRows = this._getFilledRows()
      this._removeRows(filledRows);

      // Move on to next piece
      this.currentPiece = Piece.generatePiece(this);
      this.projectedPiece = this.currentPiece.getProjectedPiece(this);

      return filledRows.length;
    }

    return 0;
  }

  checkGameOver() {
    return this.landedBlocks.some((block) => block.getPos().y < this.getYOffset());
  }

  blockWorld2Local(pos) {
    return createVector(
      pos.x - this.getXOffset(),
      pos.y - this.getYOffset()
    );
  }

  getBoardInput() {
    const peaks = this._get_peaks();
    const maxPeak = Math.max(...peaks);

    const holes = this._get_holes(peaks);
    const holeCount = holes.reduce((acc, hole) => acc + hole, 0);

    const wells = this._get_wells(peaks);
    const maxWell = Math.max(...wells);

    const pits = peaks.map((peak) => peak == 0 ? 1 : 0);
    const numPits = pits.reduce((acc, pit) => acc + pit, 0);
    const bumpiness = this._get_bumpiness(peaks);

    const pieceNumber = getPieceType(this.currentPiece);
    const pieceLoc = this.currentPiece.getPos().x;

    return [
      pieceNumber / 7,
      pieceLoc / this.width,
      maxPeak / this.height,
      maxWell / this.height,
      holeCount / this.height * this.width,
      bumpiness / this.height,
      numPits / this.width,
      ...pits,
      ...peaks.map((peak) => peak / this.height),
      ...wells.map((well) => well / this.height),
    ];
  }

  _handleMove(move) {
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

  _get_peaks() {
    const peaks = [];
    for (let col = 0; col < this.width; col++) {
      let peak = 0;
      for (let row = 0; row < this.height; row++) {
        if (this.grid[row][col] === TYPES.BLOCKED) {
          peak = row;
          break;
        }
      }
      peaks.push(peak);
    }
    return peaks;
  }

  _get_holes(peaks) {
    const holes = [];
    for (let col = 0; col < this.width; col++) {
      let hole = 0;
      for (let row = peaks[col]; row < this.height; row++) {
        if (this.grid[row][col] === TYPES.EMPTY) hole++;
      }
      holes.push(hole);
    }
    return holes;
  }

  _get_bumpiness(peaks) {
    let bumpiness = 0;
    for (let col = 0; col < this.width - 1; col++) {
      bumpiness += abs(peaks[col] - peaks[col + 1]);
    }
    return bumpiness;
  }

  _get_wells(peaks) {
    const wells = [];
    for (let col = 0; col < this.width; col++) {
      let well = 0;
      if (col === 0) {
        well = max(peaks[col + 1] - peaks[col], 0);
      } else if (col === this.width - 1) {
        well = max(peaks[col - 1] - peaks[col], 0);
      } else {
        well = max(min(peaks[col - 1], peaks[col + 1]) - peaks[col], 0);
      }
      wells.push(well);
    }
    return wells;
  }
}
