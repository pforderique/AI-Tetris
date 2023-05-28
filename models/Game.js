class Game {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.board = new Board(x, y);
    this.move = ACTIONS.NONE;

    this.state = GAME_STATE.WELCOME;
    this.paused = false;
    this.gameTime = 0;

    if (player === PLAYER.HUMAN)
      [this.timeHTML, this.scoreHTML] = this._createHTML();
  }

  start() {
    this.board.setup();
    this.cycle = millis(); // How much time has passed since last step
    this.gameTimer = millis(); // How much time has passed since game started

    this.score = 0;
    this.gameTime = 0;

    if (player === PLAYER.HUMAN) {
      this.scoreHTML.html(`Score: ${this.score}`);
      this.timeHTML.html(`Time: ${this.gameTime.toFixed(2)}`);
    }

    // start game immediately
    this.state = GAME_STATE.PLAYING;

    return this;
  }
  sendMoveInput (move) {
    this.move = move;

    if (move === ACTIONS.DOWN) this.score += 0.0;
  }
  pause = () => (this.paused = !this.paused);

  getState = () => this.state;
  getScore = () => this.score;
  getGameTime = () => this.gameTime;
  getSpeed = () => GAME_UI.speed;
  getBoard = () => this.board;

  step() {
    
    if (this.state != GAME_STATE.PLAYING || this.paused) return false;
    this.gameTime = (millis() - this.gameTimer) / 1000;

    if (millis() - this.cycle < 1000 / GAME_UI.speed) return false;

    const rowsCleared = this.board.step(this.move);
    this.move = ACTIONS.NONE; // reset move for next step

    this.cycle = millis();

    if (this._checkGameOver()) {
      this.state = GAME_STATE.GAMEOVER;
      this.gameTime = (millis() - this.gameTimer) / 1000;
    }

    this.score += rowsCleared;
    return this;
  }

  render() {
    // Background
    fill(0);
    rect(this.x, this.y, GAME_UI.width, GAME_UI.height);

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
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(GAME_UI.width / 500 * 32);
    text("TETRIS\nPress Space to Start", this.x + GAME_UI.width / 2, this.y + GAME_UI.height / 2);
  }

  _showGameScreen() {
    this.board.render(false);

    if (player === PLAYER.HUMAN) {
      this.scoreHTML.html(`Score: ${this.score.toFixed(2)}`);
      this.timeHTML.html(`Time: ${this.gameTime.toFixed(2)}`); // update time
    } else {
      strokeWeight(0.1);
      stroke(255);
      fill(255);
      text(`Score: ${this.score}`, this.x + GAME_UI.width - 50, this. y + 10);
    }
  }

  _showGameOverScreen() {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(GAME_UI.width / 500 * 32);
    text("GAME OVER\nPress Space to Restart", this.x + GAME_UI.width / 2, this.y + GAME_UI.height / 2);
    text(`Score: ${this.score}`, this.x + GAME_UI.width / 2, this.y + GAME_UI.height / 2 + 75);
    text(`Time: ${this.gameTime.toFixed(2)}`, this.x + GAME_UI.width / 2, this.y + GAME_UI.height / 2 + 100);
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
