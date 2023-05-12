class Piece {
  constructor(coordinates, color, rotations = 0, isGhost = false) {
    this.pos = coordinates[0];
    this.color = color;
    this.isGhost = isGhost;
    this.blocks = coordinates.map(
      (coord) => new Block(coord.x, coord.y, color, isGhost)
    );

    for (let _ = 0; _ < rotations % 4; _++) {
      this.rotate();
    }

    this.rotations = rotations % 4;
  }

  static generatePiece(board) {
    const pieceClass = randChoose([
      Square,
      Line,
      T,
      LeftL,
      RightL,
      LeftZ,
      RightZ,
    ]);
    const color = randChoose(ALL_COLORS);
    const pieceWidth = new pieceClass(0, 0, color).getWidth();
    const x = Math.floor(Math.random() * (board.getWidth() - pieceWidth + 1));
    const y = -2;

    const piece = new pieceClass(x, y, color)

    // // Make sure piece is in bounds
    // while (!piece.canMoveRight(board)) piece.moveLeft();
    // if (x !== 0) piece.moveRight();

    return piece;
  }

  getBlocks = () => this.blocks;

  getWidth() {
    const xs = this.blocks.map((block) => block.getPos().x);
    return Math.max(...xs) - Math.min(...xs) + 1;
  }

  moveDownOne() {
    this.pos.y++;
    this.blocks.forEach((block) => block.moveDownOne());
  }

  moveLeft() {
    this.pos.x--;
    this.blocks.forEach((block) => block.moveLeft());
  }

  moveRight() {
    this.pos.x++;
    this.blocks.forEach((block) => block.moveRight());
  }

  getProjectedPiece(board) {
    const { x, y } = this.getPos();
    const projectedPiece = new this.constructor(
      x,
      y,
      this.color,
      this.rotations,
      true
    );

    while (projectedPiece.canMoveDownOne(board)) {
      projectedPiece.moveDownOne();
    }

    return projectedPiece;
  }

  rotate() {
    throw new Error("Piece must implement rotate()");
  }

  canMoveDownOne(board) {
    const grid = board.getGrid();

    for (const block of this.blocks) {
      const pos = block.getPos();
      if (
        pos.y + 1 >= board.getHeight() ||
        (grid[pos.y + 1] && grid[pos.y + 1][pos.x] == TYPES.BLOCKED)
      ) {
        return false;
      }
    }
    return true;
  }

  canMoveLeft(board) {
    const grid = board.getGrid();

    for (const block of this.blocks) {
      const pos = block.getPos();
      if (
        pos.x - 1 < 0 ||
        (grid[pos.y] && grid[pos.y][pos.x - 1] == TYPES.BLOCKED)
      ) {
        return false;
      }
    }
    return true;
  }

  canMoveRight(board) {
    const grid = board.getGrid();

    for (const block of this.blocks) {
      const pos = block.getPos();
      if (
        pos.x + 1 >= board.getWidth() ||
        (grid[pos.y] && grid[pos.y][pos.x + 1] == TYPES.BLOCKED)
      ) {
        return false;
      }
    }
    return true;
  }

  canRotate(board) {
    throw new Error("Piece must implement canRotate()");
  }

  copy() {
    throw new Error("Piece must implement copy()");
  }

  getPos = () => this.pos;

  render = () => this.blocks.forEach((block) => block.render());
}

class Square extends Piece {
  constructor(x, y, color, rotations = 0, isGhost = false) {
    super(
      [
        { x, y },
        { x: x + 1, y },
        { x, y: y + 1 },
        { x: x + 1, y: y + 1 },
      ],
      color,
      rotations,
      isGhost
    );
  }

  canRotate = () => false;

  rotate = () => this.rotations = (this.rotations + 1) % 4;
}

class Line extends Piece {
  constructor(x, y, color, rotations = 0, isGhost = false) {
    super(
      [
        { x, y },
        { x: x + 1, y },
        { x: x + 2, y },
        { x: x + 3, y },
      ],
      color,
      rotations,
      isGhost
    );
  }

  canRotate(board) {
    const grid = board.getGrid();

    const center = this.blocks[1].getPos();
    for (const block of this.blocks) {
      const pos = block.getPos();
      const x = pos.x - center.x;
      const y = pos.y - center.y;
      const newX = center.x - y;
      const newY = center.y + x;
      if (
        newX < 0 ||
        newX >= board.getWidth() ||
        newY < 0 ||
        newY >= board.getHeight() ||
        (grid[newY] && grid[newY][newX] == TYPES.BLOCKED)
      ) {
        return false;
      }
    }
    return true;
  }

  rotate() {
    const center = this.blocks[1].getPos();
    for (const block of this.blocks) {
      const pos = block.getPos();
      const x = pos.x - center.x;
      const y = pos.y - center.y;
      block.pos.x = center.x - y;
      block.pos.y = center.y + x;
    }
    this.rotations = (this.rotations + 1) % 4;
  }
}

class T extends Piece {
  constructor(x, y, color, rotations = 0, isGhost = false) {
    super(
      [
        { x, y },
        { x: x + 1, y },
        { x: x + 2, y },
        { x: x + 1, y: y + 1 },
      ],
      color,
      rotations,
      isGhost
    );
  }

  canRotate(board) {
    const grid = board.getGrid();

    const center = this.blocks[1].getPos();
    for (const block of this.blocks) {
      const pos = block.getPos();
      const x = pos.x - center.x;
      const y = pos.y - center.y;
      const newX = center.x - y;
      const newY = center.y + x;
      if (
        newX < 0 ||
        newX >= board.getWidth() ||
        newY < 0 ||
        newY >= board.getHeight() ||
        (grid[newY] && grid[newY][newX] == TYPES.BLOCKED)
      ) {
        return false;
      }
    }
    return true;
  }

  rotate() {
    const center = this.blocks[1].getPos();
    for (const block of this.blocks) {
      const pos = block.getPos();
      const x = pos.x - center.x;
      const y = pos.y - center.y;
      block.pos.x = center.x - y;
      block.pos.y = center.y + x;
    }
    this.rotations = (this.rotations + 1) % 4;
  }
}

class LeftL extends Piece {
  constructor(x, y, color, rotations = 0, isGhost = false) {
    super(
      [
        { x, y },
        { x, y: y + 1 },
        { x, y: y + 2 },
        { x: x + 1, y: y + 2 },
      ],
      color,
      rotations,
      isGhost
    );
  }

  canRotate(board) {
    const grid = board.getGrid();

    const center = this.blocks[1].getPos();
    for (const block of this.blocks) {
      const pos = block.getPos();
      const x = pos.x - center.x;
      const y = pos.y - center.y;
      const newX = center.x - y;
      const newY = center.y + x;
      if (
        newX < 0 ||
        newX >= board.getWidth() ||
        newY < 0 ||
        newY >= board.getHeight() ||
        (grid[newY] && grid[newY][newX] == TYPES.BLOCKED)
      ) {
        return false;
      }
    }
    return true;
  }

  rotate() {
    const center = this.blocks[1].getPos();
    for (const block of this.blocks) {
      const pos = block.getPos();
      const x = pos.x - center.x;
      const y = pos.y - center.y;
      block.pos.x = center.x - y;
      block.pos.y = center.y + x;
    }
    this.rotations = (this.rotations + 1) % 4;
  }
}

class RightL extends Piece {
  constructor(x, y, color, rotations = 0, isGhost = false) {
    super(
      [
        { x, y: y + 2 },
        { x: x + 1, y },
        { x: x + 1, y: y + 1 },
        { x: x + 1, y: y + 2 },
      ],
      color,
      rotations,
      isGhost
    );
  }

  canRotate(board) {
    const grid = board.getGrid();

    const center = this.blocks[1].getPos();
    for (const block of this.blocks) {
      const pos = block.getPos();
      const x = pos.x - center.x;
      const y = pos.y - center.y;
      const newX = center.x - y;
      const newY = center.y + x;
      if (
        newX < 0 ||
        newX >= board.getWidth() ||
        newY < 0 ||
        newY >= board.getHeight() ||
        (grid[newY] && grid[newY][newX] == TYPES.BLOCKED)
      ) {
        return false;
      }
    }
    return true;
  }

  rotate() {
    const center = this.blocks[1].getPos();
    for (const block of this.blocks) {
      const pos = block.getPos();
      const x = pos.x - center.x;
      const y = pos.y - center.y;
      block.pos.x = center.x - y;
      block.pos.y = center.y + x;
    }
    this.rotations = (this.rotations + 1) % 4;
  }
}

class LeftZ extends Piece {
  constructor(x, y, color, rotations = 0, isGhost = false) {
    super(
      [
        { x, y },
        { x: x + 1, y },
        { x: x + 1, y: y + 1 },
        { x: x + 2, y: y + 1 },
      ],
      color,
      rotations,
      isGhost
    );
  }

  canRotate(board) {
    const grid = board.getGrid();

    const center = this.blocks[1].getPos();
    for (const block of this.blocks) {
      const pos = block.getPos();
      const x = pos.x - center.x;
      const y = pos.y - center.y;
      const newX = center.x - y;
      const newY = center.y + x;
      if (
        newX < 0 ||
        newX >= board.getWidth() ||
        newY < 0 ||
        newY >= board.getHeight() ||
        (grid[newY] && grid[newY][newX] == TYPES.BLOCKED)
      ) {
        return false;
      }
    }
    return true;
  }

  rotate() {
    const center = this.blocks[1].getPos();
    for (const block of this.blocks) {
      const pos = block.getPos();
      const x = pos.x - center.x;
      const y = pos.y - center.y;
      block.pos.x = center.x - y;
      block.pos.y = center.y + x;
    }
    this.rotations = (this.rotations + 1) % 4;
  }
}

class RightZ extends Piece {
  constructor(x, y, color, rotations = 0, isGhost = false) {
    super(
      [
        { x, y: y + 1 },
        { x: x + 1, y: y + 1 },
        { x: x + 1, y },
        { x: x + 2, y },
      ],
      color,
      rotations,
      isGhost
    );
  }

  canRotate(board) {
    const grid = board.getGrid();

    const center = this.blocks[1].getPos();
    for (const block of this.blocks) {
      const pos = block.getPos();
      const x = pos.x - center.x;
      const y = pos.y - center.y;
      const newX = center.x - y;
      const newY = center.y + x;
      if (
        newX < 0 ||
        newX >= board.getWidth() ||
        newY < 0 ||
        newY >= board.getHeight() ||
        (grid[newY] && grid[newY][newX] == TYPES.BLOCKED)
      ) {
        return false;
      }
    }
    return true;
  }

  rotate() {
    const center = this.blocks[1].getPos();
    for (const block of this.blocks) {
      const pos = block.getPos();
      const x = pos.x - center.x;
      const y = pos.y - center.y;
      block.pos.x = center.x - y;
      block.pos.y = center.y + x;
    }
    this.rotations = (this.rotations + 1) % 4;
  }
}
