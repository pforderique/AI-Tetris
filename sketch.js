let game;

function setup() {
  game = new Game(10, 20);
  createCanvas(UI.width, UI.height);

}

function draw() {
  background(0);

  game.step()
  game.render();
}