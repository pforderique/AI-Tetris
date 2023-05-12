class AI {
  constructor() {
    this._createStatsHTML();
    this.gamesPlayed = 0;
    this.bestScore = 0;
    this.avgScore = 0;
    this.avgTime = 0;
  }

  generateMove() {
    throw new Error("generateMove() not implemented");
  }

  recordStats(score, time) {
    this.gamesPlayed++;
    this.avgScore = (this.avgScore * (this.gamesPlayed - 1) + score) / this.gamesPlayed;
    this.avgTime = (this.avgTime * (this.gamesPlayed - 1) + time) / this.gamesPlayed;
    this.bestScore = max(this.bestScore, score);

    this.gamesPlayedHtml.html(`Games Played: ${this.gamesPlayed}`);
    this.bestScoreHtml.html(`Best Score: ${this.bestScore}`);
    this.avgScoreHtml.html(`Avg Score: ${this.avgScore.toFixed(2)}`);
    this.avgTimeHtml.html(`Avg Time Alive: ${this.avgTime.toFixed(2)}`);
  }

  _createStatsHTML() {
    const stats = createSpan("")
      .style("width", `${UI.width}px`)
      .style("display", "inline")
      .style("font-size", "2rem");

    this.gamesPlayedHtml = createP("Games Played: 0").parent(stats);
    this.bestScoreHtml = createP("Best Score: 0").parent(stats);
    this.avgScoreHtml = createP("Avg Score: 0").parent(stats);
    this.avgTimeHtml = createP("Avg Time Alive: 0").parent(stats);
  }
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
