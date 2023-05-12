let game;

function setup() {
  createCanvas(UI.width, UI.height);
  game = new Game();
}

function draw() {
  background(0);

  game.step();
  game.render();
}

// Game controls for Human player
function keyPressed() {
  switch (keyCode) {
    case 32: // Space
      if (game.getState() === GAME_STATE.WELCOME) game.start();
      else if (game.getState() === GAME_STATE.PLAYING) game.pause();
      else if (game.getState() === GAME_STATE.GAMEOVER) game.reset();
      break;
    case 82: // R
      game.start();
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
