let game;

function setup() {
  createCanvas(UI.width, UI.height);
  game = new Game();
  game.setup();
}

function draw() {
  background(0);

  game.step()
  game.render();
}

// Game controls
function keyPressed() {
  switch (keyCode) {
    case 32: // Space
      game.pause()
      break;
    case 82: // R
      game.setup();
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