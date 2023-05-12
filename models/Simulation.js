const MAX_GAMES = 3;

class Simulation {
  /**
   * 
   * @param {Game} game 
   * @param {AI} bot 
   */
  constructor(game, bot) {
    this.game = game;
    this.bot = bot;

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
      }
    }

    // Generate move for AI after every successful step
    if (this.game.step()) this.game.sendMoveInput(this.bot.generateMove());
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
      .style("display", "inline")
      .style("font-size", "2rem");

    this.gamesPlayedHtml = createP("Games Played: 0").parent(statsHTML);
    this.bestScoreHtml = createP("Best Score: 0").parent(statsHTML);
    this.avgScoreHtml = createP("Avg Score: 0.00").parent(statsHTML);
    this.avgTimeHtml = createP("Avg Time Alive: 0.00").parent(statsHTML);
  }
}