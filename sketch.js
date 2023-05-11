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