new p5();

const UI = {
  width: 500,
  height: 1000,
}

const COLORS = {
  red: color("#E91F1F"),
  blue: color("#2C63F5"),
  green: color("#448F68"),
  yellow: color("#FDFD4D"),
  purple: color("#981FB7"),
  lightblue: color("#54E9DD"),
  orange: color("#EA9503"),
};

const ALL_COLORS = Object.values(COLORS);

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