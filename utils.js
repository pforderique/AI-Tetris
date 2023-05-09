// class COLORS {
//   static red = color("#E91F1F");
//   static blue = color("#2C63F5");
//   static green = color("#448F68");
//   static yellow = color("#FDFD4D");
//   static purple = color("#981FB7");
//   static lightblue = color("#54E9DD");
//   static orange = color("#EA9503");
//   static allColors = [
//     this.red,
//     this.blue,
//     this.green,
//     this.yellow,
//     this.purple,
//     this.lightblue,
//     this.orange,
//   ];
// }

class ACTIONS {
  static none = "none";
  static left = "left";
  static right = "right";
  static down = "down";
  static rotate = "rotate";
}

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
