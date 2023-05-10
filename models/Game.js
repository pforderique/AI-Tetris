class STATES {
  static WELCOME = 0;
  static PLAYING = 1;
  static GAMEOVER = 2;
}

class Game {
  constructor(width, height) {
    this.board = new Board(width, height);

    this.speed = 15; // blocks per second
    this.cycle = millis();
    this.move = ACTIONS.NONE;
  }

  sendMoveInput(move) {
    console.log('sendMoveInput', move);
    this.move = move;
  }

  /**
   * 
   * @param {ACTIONS} move the move to make 
   */
  step() {
    if (millis() - this.cycle < 1000 / this.speed) return;

    print('step');
    this.board.step(this.move);
    this.move = ACTIONS.NONE; // reset move for next step

    this.cycle = millis();
  }

  render() {
    this.board.render(true);
  }

}

function keyPressed() {
  switch (keyCode) {
    case '':
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
