let player;

let game;
let sim;

function setup() {
  createCanvas(UI.width, UI.height);

  player = PLAYER.AI;

  if (player === PLAYER.HUMAN) {
    game = new Game(0, 0);
  } else {
    sim = new Simulation();
    sim.start();
  }
}

function draw() {
  background(200);

  if (player === PLAYER.AI) sim.step().render();
  else game.step().render();
}

// Game controls
function keyPressed() {
  switch (keyCode) {
    case 32: // Space
      const obj = player === PLAYER.AI ? sim : game;
      if (obj.getState() === GAME_STATE.WELCOME) 
        obj.start();
      else if (obj.getState() === GAME_STATE.PLAYING)
        obj.pause();
      else if (obj.getState() === GAME_STATE.GAMEOVER) {
        obj.start();
      }
      break;
    case 82: // R
      if (player === PLAYER.AI) sim.start();
      else game.start();
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