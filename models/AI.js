class AI {
  constructor() {
    this.stats = {
      gamesPlayed: 0,
      bestScore: 0,
      avgScore: 0,
      avgTime: 0,
    };
  }

  generateMove() {
    throw new Error("generateMove() not implemented");
  }

  updateStats(score, time) {
    this.stats.gamesPlayed++;
    this.stats.avgScore =
      (this.stats.avgScore * (this.stats.gamesPlayed - 1) + score) / this.stats.gamesPlayed;
    this.stats.avgTime =
      (this.stats.avgTime * (this.stats.gamesPlayed - 1) + time) / this.stats.gamesPlayed;
    this.stats.bestScore = max(this.stats.bestScore, score);
  }

  getStats = () => this.stats;
}

class RandomBot extends AI {
  constructor() {
    super();
  }

  generateMove() {
    const randomMove = randChoose(Object.values(ACTIONS));
    return randomMove;
  }
}
