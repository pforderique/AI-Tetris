const keystates = {
  NO_PRESS: 0,
  LEFT_DOWN: 1,
  RIGHT_DOWN: 2,
}
let keystate = keystates.NO_PRESS;

class Paddle {
  constructor() {
    const hoverDistance = 50; // distance from bottom of screen
    this.pos = createVector(width / 2, height - hoverDistance);
    this.width = width / 5;
    this.thickness = 15;
    this.color = color("#ADD8E6");

    this.moveDistance = 7;
  }

  show() {
    push();
    fill(this.color);
    rectMode(CENTER);
    rect(this.pos.x, this.pos.y, this.width, this.thickness);
    pop();
  }

  update() {
    // key press fsm
    switch (keystate) {
      case keystates.NO_PRESS:
        if (keyIsDown(LEFT_ARROW)) {
          keystate = keystates.LEFT_DOWN;
        } else if (keyIsDown(RIGHT_ARROW)) {
          keystate = keystates.RIGHT_DOWN;
        }
        break;
      case keystates.LEFT_DOWN:
        keystate = keyIsDown(LEFT_ARROW) ? keystates.LEFT_DOWN : keystates.NO_PRESS;
        this.moveLeft();
        break;
      case keystates.RIGHT_DOWN:
        keystate = keyIsDown(RIGHT_ARROW) ? keystates.RIGHT_DOWN : keystates.NO_PRESS;
        this.moveRight();
        break;
    }
  }

  collidesWith(ball) {
    const threshold = 2;
    return (
      isBetween(
        this.pos.x - this.width / 2,
        ball.pos.x,
        this.pos.x + this.width / 2
      ) &&
      isBetween(
        this.pos.y - this.thickness / 2,
        ball.pos.y + ball.radius,
        this.pos.y + threshold
      )
    );
  }

  moveLeft() {
    const newX = this.pos.x - this.moveDistance;
    this.pos.x = newX - this.width / 2 < 0 ? this.width / 2 : newX;
  }

  moveRight() {
    const newX = this.pos.x + this.moveDistance;
    this.pos.x = newX + this.width / 2 > width ? width - this.width / 2 : newX;
  }
}