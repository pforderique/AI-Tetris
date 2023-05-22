class AI {
  constructor(game) {
    this.game = game;
    this.stats = {
      gamesPlayed: 0,
      bestScore: 0,
      avgScore: 0,
      avgTime: 0,
    };
  }

  generateMove(board) {
    throw new Error("generateMove() not implemented");
  }

  updateStats(score, time) {
    this.stats.gamesPlayed++;
    this.stats.avgScore =
      (this.stats.avgScore * (this.stats.gamesPlayed - 1) + score) /
      this.stats.gamesPlayed;
    this.stats.avgTime =
      (this.stats.avgTime * (this.stats.gamesPlayed - 1) + time) /
      this.stats.gamesPlayed;
    this.stats.bestScore = max(this.stats.bestScore, score);
  }

  getStats = () => this.stats;
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