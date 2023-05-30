const MAX_RUNS = 5;

class Simulation {
  constructor() {
    const popCount = GAME_UI.cols * GAME_UI.rows;
    this.runSimulation = false;

    this.sims = [];
    for (let row = 0; row < GAME_UI.rows; row++) {
      for (let col = 0; col < GAME_UI.cols; col++) {
        const x = col * GAME_UI.width;
        const y = row * GAME_UI.height;

        const game = new Game(x, y, GAME_UI.speed);
        const bot = new GeneticBot(game);

        this.sims.push({ game, bot });
      }
    }

    // Stats for the current generation
    this.generationStats = {
      bestScore: 0,
      avgScore: 0,
      simTime: 0,
    };

    // Stats for the overall simulation
    this.overallStats = {
      simsRan: 0,
      gamesPlayed: 0,
      bestScore: 0,
      avgScore: 0,
      avgLifetime: 0,
    };

    this._createStatsHTML();
  }

  start() {
    this.sims.forEach((sim) => sim.game.start());
    this.runSimulation = true;
  }

  pause = () => this.sims.map((sim) => sim.game.pause());

  step() {
    // Stop simulation if requested
    if (!this.runSimulation) return this;

    // Only once every game is over, display stats and start again
    if (this.sims.every((sim) => sim.game.getState() === GAME_STATE.GAMEOVER)) {
      this._updateStats();
      this._displayStats();

      if (this.overallStats.simsRan < MAX_RUNS) {
        // Calculate how good each bot was and update fitness
        this.sims.forEach((sim) => {
          const { game, bot } = sim;
          const score = game.getScore();

          const [_, __, maxPeak, maxWell, holeCount, bumpiness, numPits] = game
            .getBoard()
            .getBoardInput();
            
          const fitness =
            score +
            -0.1 * maxPeak +
            -0.1 * holeCount +
            -0.5 * maxWell +
            -0.5 * bumpiness +
            -0.5 * numPits;
          bot.fitness = fitness;
        });

        // Evolve the bots
        const newBots = GeneticBot.evolve(this.sims.map((sim) => sim.bot));
        this.sims.forEach((sim, idx) => {
          sim.bot = newBots[idx];
        });

        this.start();
      } else {
        this.runSimulation = false;
        print(
          `Random Bot Stats:\n\tGames Played: ${
            this.overallStats.gamesPlayed
          }\n\tBest Score: ${
            this.overallStats.bestScore
          }\n\tAvg Score: ${this.overallStats.avgScore.toFixed(
            2
          )}\n\tAvg Time Alive: ${this.overallStats.avgLifetime.toFixed(
            2
          )}\n\t(speed: ${this.sims[0].game.getSpeed()})`
        );
      }
    }

    // Generate move for AI after every successful step
    for (const sim of this.sims) {
      if (sim.game.step()) {
        // Make the next move
        const aiMove = sim.bot.generateMove(sim.game.getBoard());
        sim.game.sendMoveInput(aiMove);
      }
    }

    return this;
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
    else if (
      this.sims.every((sim) => sim.game.getState() === GAME_STATE.WELCOME)
    )
      return GAME_STATE.WELCOME;
    else return GAME_STATE.PLAYING;
  }

  _updateStats() {
    const sims = this.sims;
    this.generationStats = {
      bestScore: sims.reduce((pt, sim) => max(pt, sim.game.getScore()), 0),
      avgScore:
        sims.reduce((pt, sim) => pt + sim.game.getScore(), 0) / sims.length,
      simTime: sims.reduce((pt, sim) => max(pt, sim.game.getGameTime()), 0),
    };

    this.overallStats = {
      simsRan: this.overallStats.simsRan + 1,
      gamesPlayed: this.overallStats.gamesPlayed + sims.length,
      bestScore: max(
        this.overallStats.bestScore,
        this.generationStats.bestScore
      ),
      avgScore:
        this.overallStats.avgScore === 0
          ? this.generationStats.avgScore
          : (this.overallStats.avgScore *
              (this.overallStats.gamesPlayed - sims.length) +
              this.generationStats.avgScore * sims.length) /
            this.overallStats.gamesPlayed,
      avgLifetime:
        this.overallStats.avgLifetime === 0
          ? this.generationStats.simTime
          : (this.overallStats.avgLifetime *
              (this.overallStats.gamesPlayed - sims.length) +
              this.generationStats.simTime * sims.length) /
            this.overallStats.gamesPlayed,
    };
  }

  _displayStats() {
    this.genStatsHTML.html(`Best Score: ${this.generationStats.bestScore} | 
      Average Score: ${this.generationStats.avgScore.toFixed(2)} | 
      Simulation Time: ${this.generationStats.simTime.toFixed(2)}`);

    this.overallStatsHTML.html(`Sims Ran: ${this.overallStats.simsRan} |
      Games Played: ${this.overallStats.gamesPlayed} |
      Best Score: ${this.overallStats.bestScore} |
      Average Score: ${this.overallStats.avgScore.toFixed(2)} |
      Average Lifetime: ${this.overallStats.avgLifetime.toFixed(2)}`);
  }

  _createStatsHTML() {
    const genHTML = createSpan("Generation Stats")
      .style("width", `${UI.width}px`)
      .style("font-size", "1.6rem")
      .style("display", "flex");

    const overallHTML = createSpan("Overall Stats")
      .style("width", `${UI.width}px`)
      .style("font-size", "1.6rem")
      .style("display", "flex");

    this.genStatsHTML = createP(`Best Score: ${
      this.generationStats.bestScore
    } | 
    Average Score: ${this.generationStats.avgScore.toFixed(2)} | 
    Simulation Time: ${this.generationStats.simTime.toFixed(2)}`).parent(
      genHTML
    );

    this.overallStatsHTML = createP(`Games Played: ${
      this.overallStats.gamesPlayed
    } |
    Best Score: ${this.overallStats.bestScore} |
    Average Score: ${this.overallStats.avgScore.toFixed(2)} |
    Average Lifetime: ${this.overallStats.avgLifetime.toFixed(2)}`).parent(
      overallHTML
    );
  }
}
