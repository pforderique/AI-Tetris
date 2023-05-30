new p5();

// Size of one game instance
const GAME_UI = {
  width: 200,
  height: 400,
  rows: 5,
  cols: 16,
  speed: 100, // speed in blocks per second
}

// Size of entire program screen
const UI = {
  width: GAME_UI.width * GAME_UI.cols,
  height: GAME_UI.height * GAME_UI.rows,
}

const [bw, bh] = [10, 20].map((x) => x * 1);
const BOARD = {
  boardWidth: bw,
  boardHeight: bh,
  blockWidth: GAME_UI.width / bw,
  blockHeight: GAME_UI.height / bh,
}

const GAME_STATE = {
  WELCOME: 0,
  PLAYING: 1,
  GAMEOVER:  2,
}

const TYPES = {
  EMPTY: 0, // empty
  BLOCKED: 1, // block
};

const PLAYER = {
  HUMAN: 0,
  AI: 1,
}

const COLORS = {
  red: color("#E91F1F"),
  blue: color("#2C63F5"),
  green: color("#1FE91F"),
  yellow: color("#FDFD4D"),
  purple: color("#981FB7"),
  lightblue: color("#54E9DD"),
  orange: color("#EA9503"),
};

const ALL_COLORS = Object.values(COLORS);
const TRANSPARENT = color(0, 255)

const ACTIONS = {
  NONE: "none",
  LEFT: "left",
  RIGHT: "right",
  DOWN: "down",
  ROTATE: "rotate",
};

/**
 *
 * @returns true iff num1, num2, and num3 are in ascending order
 */
function isBetween(num1, num2, num3) {
  return num1 < num2 && num2 < num3;
}

/**
 *
 * @param {Array} choices list containing elements to choose from
 * @returns a random element from `choices`
 */
function randChoose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

function getPieceType(piece) {
  switch (piece.constructor.name) {
    case "Square":
      return 0;
    case "Line":
      return 1;
    case "T":
      return 2;
    case "LeftL":
      return 3;
    case "RightL":
      return 4;
    case "LeftZ":
      return 5;
    case "RightZ":
      return 6;
  }
}