class Game {
  constructor() {
    this.board = new Board();

    this.speed = 10; // blocks per second
    this.move = ACTIONS.NONE;

    this.state = GAME_STATE.WELCOME;
    this.paused = false;
    [this.timeHTML, this.scoreHTML] = this._createHTML();

    this.gameTime = 0;
  }

  start() {
    this.board.setup();
    this.cycle = millis(); // How much time has passed since last step
    this.gameTimer = millis(); // How much time has passed since game started

    this.score = 0;
    this.scoreHTML.html(`Score: ${this.score}`);

    this.gameTime = 0;
    this.timeHTML.html(`Time: ${this.gameTime.toFixed(2)}`);

    // start game immediately
    this.state = GAME_STATE.PLAYING;
  }
  pause = () => (this.paused = !this.paused);
  getState = () => this.state;
  getScore = () => this.score;
  getGameTime = () => this.gameTime;

  sendMoveInput = (move) => (this.move = move);

  step() {
    this.gameTime = (millis() - this.gameTimer) / 1000;
    this.timeHTML.html(`Time: ${this.gameTime.toFixed(2)}`); // update time

    if (this.state != GAME_STATE.PLAYING || this.paused) return false;
    if (millis() - this.cycle < 1000 / this.speed) return false;

    this.board.step(this.move);
    this.move = ACTIONS.NONE; // reset move for next step

    this.cycle = millis();

    if (this._checkGameOver()) {
      this.state = GAME_STATE.GAMEOVER;
      this.gameTime = (millis() - this.gameTimer) / 1000;
    }

    this.score = this.board.getRowsCleared();
    this.scoreHTML.html(`Score: ${this.score}`);

    return true;
  }

  render() {
    switch (this.state) {
      case GAME_STATE.WELCOME:
        this._showWelcomeScreen();
        break;
      case GAME_STATE.PLAYING:
        this._showGameScreen();
        break;
      case GAME_STATE.GAMEOVER:
        this._showGameOverScreen();
        break;
    }
  }

  _checkGameOver = () => this.board.checkGameOver();

  _showWelcomeScreen() {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("TETRIS\nPress Space to Start", UI.width / 2, UI.height / 2);
  }

  _showGameScreen() {
    this.board.render(false);
  }

  _showGameOverScreen() {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("GAME OVER\nPress Space to Restart", UI.width / 2, UI.height / 2);
  }

  _createHTML() {
    const scoreDiv = createDiv("")
      .style("width", `${UI.width}px`)
      .style("text-align", "center");

    const timeHTML = createP("")
      .style("font-size", "32px")
      .style("font-weight", "bold")
      .html(`Time: 0`)
      .parent(scoreDiv);

    const scoreHTML = createP("")
      .style("font-size", "32px")
      .style("font-weight", "bold")
      .html(`Score: 0`)
      .parent(scoreDiv);

    return [timeHTML, scoreHTML]
  }
}
