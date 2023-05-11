class Game {
  constructor() {
    this.board = new Board();

    this.speed = 10; // blocks per second
    this.cycle = millis();
    this.move = ACTIONS.NONE;

    this.state = GAME_STATE.WELCOME;
    this.paused = false;
  }

  setup = () => this.board.setup();

  reset() {
    this.setup();
    // start game again
    this.state = GAME_STATE.PLAYING;
  }  
  pause = () => this.paused = !this.paused;
  getState = () => this.state;
  setState = (state) => this.state = state;

  sendMoveInput(move) {
    console.log('sendMoveInput', move);
    this.move = move;
  }

  /**
   * 
   * @param {ACTIONS} move the move to make 
   */
  step() {
    if (this.state != GAME_STATE.PLAYING || this.paused) return;
    if (millis() - this.cycle < 1000 / this.speed) return;

    this.board.step(this.move);
    this.move = ACTIONS.NONE; // reset move for next step

    this.cycle = millis();

    if (this._checkGameOver()) this.state = GAME_STATE.GAMEOVER;
  }

  render() {
    switch (this.state) {
      case GAME_STATE.WELCOME: this._showWelcomeScreen(); break;
      case GAME_STATE.PLAYING: this._showGameScreen(); break;
      case GAME_STATE.GAMEOVER: this._showGameOverScreen(); break;
    }
  }

  _checkGameOver = () => this.board.checkGameOver();

  _showWelcomeScreen() {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text('TETRIS\nPress Space to Start', UI.width / 2, UI.height / 2);
  }

  _showGameScreen() {
    this.board.render(false);
  }

  _showGameOverScreen() {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text('GAME OVER\nPress Space to Restart', UI.width / 2, UI.height / 2);
  }
}
