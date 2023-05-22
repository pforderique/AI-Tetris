let player;

let game;
let sim;

function setup() {
  createCanvas(UI.width, UI.height);

  player = PLAYER.AI;
  game = new Game(100); // speed in blocks per second
  sim = new Simulation(game);

  if (player === PLAYER.AI) sim.start();
}

function draw() {
  background(0);

  if (player === PLAYER.AI) sim.step();
  else game.step();

  game.render();
}

// Game controls
function keyPressed() {
  switch (keyCode) {
    case 32: // Space
      if (game.getState() === GAME_STATE.WELCOME) 
        game.start();
      else if (game.getState() === GAME_STATE.PLAYING)
        game.pause();
      else if (game.getState() === GAME_STATE.GAMEOVER) {
        if (player === PLAYER.AI) sim.start();
        else game.start();
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