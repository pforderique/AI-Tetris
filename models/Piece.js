class Piece {
  constructor(coordinates, color) {
    this.pos = coordinates[0];
    this.blocks = coordinates.map(
      (coord) => new Block(coord.x, coord.y, color)
    );
  }

  getBlocks = () => this.blocks;

  moveDownOne = () => this.blocks.forEach((block) => block.moveDownOne());

  moveLeft = () => this.blocks.forEach((block) => block.moveLeft());

  moveRight = () => this.blocks.forEach((block) => block.moveRight());

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

  canRotate(grid) {
    throw new Error("Piece must implement canRotate()");
  }

  copy() {
    throw new Error("Piece must implement copy()");
  }

  getPos = () => this.pos;

  render = () => this.blocks.forEach((block) => block.render());
}

class Square extends Piece {
  constructor(x, y, color) {
    super(
      [
        { x, y },
        { x: x + 1, y },
        { x, y: y + 1 },
        { x: x + 1, y: y + 1 },
      ],
      color
    );
  }

  canRotate = () => false;

  rotate() {}
}

class Line extends Piece {
  constructor(x, y, color) {
    super(
      [
        { x, y },
        { x: x + 1, y },
        { x: x + 2, y },
        { x: x + 3, y },
      ],
      color
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
  }
}

class T extends Piece {
  constructor(x, y, color) {
    super(
      [
        { x, y },
        { x: x + 1, y },
        { x: x + 2, y },
        { x: x + 1, y: y + 1 },
      ],
      color
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
  }
}

class LeftL extends Piece {
  constructor(x, y, color) {
    super(
      [
        { x, y },
        { x, y: y + 1 },
        { x, y: y + 2 },
        { x: x + 1, y: y + 2 },
      ],
      color
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
  }
}

class RightL extends Piece {
  constructor(x, y, color) {
    super(
      [
        { x, y: y + 2 },
        { x: x + 1, y },
        { x: x + 1, y: y + 1 },
        { x: x + 1, y: y + 2 },
      ],
      color
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
  }
}

class LeftZ extends Piece {
  constructor(x, y, color) {
    super(
      [
        { x, y },
        { x: x + 1, y },
        { x: x + 1, y: y + 1 },
        { x: x + 2, y: y + 1 },
      ],
      color
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
  }
}

class RightZ extends Piece {
  constructor(x, y, color) {
    super(
      [
        { x, y: y + 1 },
        { x: x + 1, y: y + 1 },
        { x: x + 1, y },
        { x: x + 2, y },
      ],
      color
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
  }
}
