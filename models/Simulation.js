const MAX_GAMES = 100;

class Simulation {
  /**
   *
   * @param {Game} game
   */
  constructor(game) {
    this.game = game;
    this.bot = new RandomBot(game);

    this._createStatsHTML();
  }

  start() {
    this.game.start();
    this.gamesPlayed = 0;
    this.runSimulation = true;
  }

  step() {
    if (!this.runSimulation) return;

    // Automatically start game if on welcome screen
    if (this.game.getState() === GAME_STATE.WELCOME) this.game.start();

    if (this.game.getState() === GAME_STATE.GAMEOVER) {
      // Update and display stats after game over
      this.bot.updateStats(this.game.getScore(), this.game.getGameTime());
      this._displayStats(this.bot.getStats());

      // Start again if game over and still have games left
      if (++this.gamesPlayed < MAX_GAMES) {
        this.game.start();
      } else {
        this.runSimulation = false;
        print(
          `Random Bot Stats:\n\tGames Played: ${
            this.bot.getStats().gamesPlayed
          }\n\tBest Score: ${
            this.bot.getStats().bestScore
          }\n\tAvg Score: ${this.bot
            .getStats()
            .avgScore.toFixed(2)}\n\tAvg Time Alive: ${this.bot
            .getStats()
            .avgTime.toFixed(2)}\n\t(speed: ${this.game.getSpeed()})`
        );
      }
    }

    // Generate move for AI after every successful step
    if (this.game.step()) {
      const aiMove = this.bot.generateMove(this.game.getBoard());
      this.game.sendMoveInput(aiMove);
    }
  }

  _displayStats(stats) {
    this.gamesPlayedHtml.html(`Games Played: ${stats.gamesPlayed}`);
    this.bestScoreHtml.html(`Best Score: ${stats.bestScore}`);
    this.avgScoreHtml.html(`Avg Score: ${stats.avgScore.toFixed(2)}`);
    this.avgTimeHtml.html(`Avg Time Alive: ${stats.avgTime.toFixed(2)}`);
  }

  _createStatsHTML() {
    const statsHTML = createSpan("")
      .style("width", `${UI.width}px`)
      .style("font-size", "1.6rem");

    this.gamesPlayedHtml = createP("Games Played: 0").parent(statsHTML);
    this.bestScoreHtml = createP("Best Score: 0").parent(statsHTML);
    this.avgScoreHtml = createP("Avg Score: 0.00").parent(statsHTML);
    this.avgTimeHtml = createP("Avg Time Alive: 0.00").parent(statsHTML);
  }
}
