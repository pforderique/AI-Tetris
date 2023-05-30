class AI {
  constructor(game) {
    this.game = game;
  }

  generateMove(board) {
    throw new Error("generateMove() not implemented");
  }
}

class RandomBot extends AI {
  constructor(game) {
    super(game);
  }

  generateMove(board) {
    const randomMove = randChoose(Object.values(ACTIONS));
    return randomMove;
  }
}

class GeneticBot extends AI {
  constructor(game, neuralnetwork) {
    super(game);

    this.moveMap = {
      0: ACTIONS.LEFT,
      1: ACTIONS.RIGHT,
      2: ACTIONS.DOWN,
      3: ACTIONS.ROTATE,
    };

    const numActions = Object.keys(this.moveMap).length;
    this.brain = neuralnetwork
      ? neuralnetwork
      : new NeuralNetwork(7 + 3*BOARD.boardWidth, 10, numActions);

    this.fitness = 0;
  }

  generateMove(board) {
    const input = tf.tensor2d([board.getBoardInput()]);
    const output = this.brain.model.predict(input);
    const outputValue = output.dataSync();

    input.dispose();
    output.dispose();

    const maxIndex = outputValue.indexOf(Math.max(...outputValue));
    let move = this.moveMap[maxIndex];
    if (move === ACTIONS.ROTATE && !board.currentPiece.canRotate(board)) {
      move = ACTIONS.NONE;
    }

    return move;
  }

  clearMind() {
    this.brain.model.dispose();
    if (typeof this.brain.model.optimizer !== "undefined") {
      this.brain.model.optimizer.dispose();
    }
  }

  static selection(population) {
    const topPercent = 0.2;
    const sortedPopulation = population.sort((a, b) => b.fitness - a.fitness);
    const parents = sortedPopulation.slice(
      0,
      Math.ceil(topPercent * population.length)
    );
    return parents;
  }

  static crossover(parentA, parentB) {
    const child = parentA.brain.copy();
    const childWeights = child.model.getWeights();
    const parentBWeights = parentB.brain.model.getWeights();

    for (let i = 0; i < childWeights.length; i++) {
      const tensor = childWeights[i];
      const parentBWeightsTensor = parentBWeights[i];
      const values = tensor.dataSync().slice();
      const parentBValues = parentBWeightsTensor.dataSync().slice();

      const mid = Math.floor(Math.random() * values.length);
      for (let j = mid; j < values.length; j++) {
        values[j] = parentBValues[j];
      }

      // tensor.dispose();
      // parentBWeightsTensor.dispose();
      childWeights[i] = tf.tensor(values, tensor.shape);
    }

    child.model.setWeights(childWeights);
    return child;
  }

  static mutate(child) {
    const rate = 0.2;
    const childWeights = child.model.getWeights();
    for (let i = 0; i < childWeights.length; i++) {
      const tensor = childWeights[i];
      const values = tensor.dataSync().slice();
      for (let j = 0; j < values.length; j++) {
        if (random(0, 1) < rate) {
          values[j] += randomGaussian(0, 0.1);
        }
      }
      // tensor.dispose();
      childWeights[i] = tf.tensor(values, tensor.shape);
    }
    child.model.setWeights(childWeights);
    return child;
  }

  static evolve(population) {
    const parents = GeneticBot.selection(population);
    const newPopulation = [];
    for (let i = 0; i < population.length; i++) {
      const parentA = randChoose(parents);
      const parentB = randChoose(parents);
      const child = GeneticBot.crossover(parentA, parentB);
      const mutatedChild = GeneticBot.mutate(child);
      newPopulation.push(mutatedChild);
    }

    return newPopulation.map((childNet) => new GeneticBot(this.game, childNet));
  }
}
