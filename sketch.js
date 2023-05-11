let game;

function setup() {
  game = new Game();
  createCanvas(UI.width, UI.height);

}

function draw() {
  background(0);

  game.step()
  game.render();
}