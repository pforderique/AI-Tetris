class STATES {
  static WELCOME = 0;
  static PLAYING = 1;
  static GAMEOVER = 2;
}

class Game {
  constructor(width, height) {
    this.board = new Board(width, height);

    this.speed = 2; // blocks per second
    this.cycle = millis();
  }

  /**
   * 
   * @param {ACTIONS} move the move to make 
   */
  step(move) {
    if (millis() - this.cycle < 1000 / this.speed) return;

    print('step');
    if (move == ACTIONS.none) {
      this.board.moveDown();
    }

    this.cycle = millis();
  }

  render() {
    this.board.render(true);
  }

}
