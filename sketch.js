let game;

function setup() {
  game = new Game(10, 20);
  createCanvas(500, 1000);
}

function draw() {
  background(0);

  game.step(move='none')
  game.render();
}
