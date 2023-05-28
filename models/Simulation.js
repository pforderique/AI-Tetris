const MAX_GAMES = 100;

class Simulation {
  constructor() {
    const popCount = GAME_UI.cols * GAME_UI.rows;
    this.sims = [];
    
    for (let row = 0; row < GAME_UI.rows; row++) {
      for (let col = 0; col < GAME_UI.cols; col++) {
        const idx = row * GAME_UI.cols + col;
        const x = col * GAME_UI.width;
        const y = row * GAME_UI.height;

        print(`Game ${idx} created at (${x}, ${y}).`);
        const game = new Game(x, y, GAME_UI.speed);
        const bot = new RandomBot(game);

        this.sims.push({ game, bot, runSimulation: false });
      }
    }

    this._createStatsHTML();
  }

  start() {
    this.sims.forEach((sim) => {
      sim.game.start();
      sim.runSimulation = true;
    });
    // this.sims.map((sim) => sim.runSimulation = true);
    // this.gamesPlayed = 0;
  }

  pause() {
    this.sims.map((sim) => sim.game.pause());
  }

  step() {
    // Automatically start game if on welcome screen
    for (const sim of this.sims){
      if (sim.runSimulation && sim.game.getState() === GAME_STATE.WELCOME)
        sim.game.start();
    }

    // if (this.game.getState() === GAME_STATE.GAMEOVER) {
    //   // Update and display stats after game over
    //   this.bot.updateStats(this.game.getScore(), this.game.getGameTime());
    //   this._displayStats(this.bot.getStats());

    //   // Start again if game over and still have games left
    //   if (++this.gamesPlayed < MAX_GAMES) {
    //     this.game.start();
    //   } else {
    //     this.runSimulation = false;
    //     print(
    //       `Random Bot Stats:\n\tGames Played: ${
    //         this.bot.getStats().gamesPlayed
    //       }\n\tBest Score: ${
    //         this.bot.getStats().bestScore
    //       }\n\tAvg Score: ${this.bot
    //         .getStats()
    //         .avgScore.toFixed(2)}\n\tAvg Time Alive: ${this.bot
    //         .getStats()
    //         .avgTime.toFixed(2)}\n\t(speed: ${this.game.getSpeed()})`
    //     );
    //   }
    // }

    // Generate move for AI after every successful step
    for (const sim of this.sims) {
      if (sim.game.step()) {
        const aiMove = sim.bot.generateMove(sim.game.getBoard());
        sim.game.sendMoveInput(aiMove);
      }
    }

    return this
  }

  render() {
    for (let idx = this.sims.length - 1; idx >= 0; idx--) {
      const sim = this.sims[idx];
      sim.game.render();
    }
  }

  getState() {
    if (this.sims.every((sim) => sim.game.getState() === GAME_STATE.GAMEOVER))
      return GAME_STATE.GAMEOVER;
    else if (this.sims.every((sim) => sim.game.getState() === GAME_STATE.WELCOME))
      return GAME_STATE.WELCOME;
    else return GAME_STATE.PLAYING;
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
