class STATES {
  static WELCOME = 0;
  static PLAYING = 1;
  static GAMEOVER = 2;
}

class Game {
  constructor() {
    this.board = new Board();

    this.speed = 10; // blocks per second
    this.cycle = millis();
    this.move = ACTIONS.NONE;

    this.paused = false;
  }

  setup = () => this.board.setup();
  pause = () => this.paused = !this.paused;

  sendMoveInput(move) {
    console.log('sendMoveInput', move);
    this.move = move;
  }

  /**
   * 
   * @param {ACTIONS} move the move to make 
   */
  step() {
    if (this.paused) return;
    if (millis() - this.cycle < 1000 / this.speed) return;

    this.board.step(this.move);
    this.move = ACTIONS.NONE; // reset move for next step

    this.cycle = millis();
  }

  render = () => this.board.render(true);
}

function keyPressed() {
  switch (keyCode) {
    case 32:
      game.pause()
      break;
    case UP_ARROW:
      game.sendMoveInput(ACTIONS.ROTATE);
      break;
    case LEFT_ARROW:
      game.sendMoveInput(ACTIONS.LEFT);
      break;
    case RIGHT_ARROW:
      game.sendMoveInput(ACTIONS.RIGHT);
      break;
    case DOWN_ARROW:
      game.sendMoveInput(ACTIONS.DOWN);
      break;
  }
}
