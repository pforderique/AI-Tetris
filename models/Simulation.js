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
      // Record stats after game over
      this.bot.recordStats(this.game.getScore(), this.game.getGameTime());

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

}