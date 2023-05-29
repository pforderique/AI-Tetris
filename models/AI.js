class AI {
  constructor(game) {
    this.game = game;
  }

  generateMove(board) {
    throw new Error("generateMove() not implemented");
  }
}

class RandomBot extends AI {
  constructor(game) {
    super(game);
  }

  generateMove(board) {
    const randomMove = randChoose(Object.values(ACTIONS));
    return randomMove;
  }
}

class GeneticBot extends AI {
  constructor(game) {
    super(game);
  }

  generateMove(board) {
    const randomMove = randChoose(Object.values(ACTIONS));
    return randomMove;
  }

  _getFitness(board) {
    let fitness = 0

    const aggregateHeight = 0;
    const numHoles = 0;
    const completeLines = 0;
    const bumpiness = 0;
    const rowTransitions = 0;
    const columnTransitions = 0;
    const numPits = 0;
    const deepestWell = 0; // Might not need
    const numLinesCleared = 0;

    return fitness;
  }
}