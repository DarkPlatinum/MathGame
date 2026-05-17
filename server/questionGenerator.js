function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateMixed() {
  const ops = ['+', '-', '×', '÷'];
  const op = ops[randInt(0, ops.length - 1)];
  let a, b, correctAnswer, questionText;

  switch (op) {
    case '+':
      a = randInt(10, 100);
      b = randInt(10, 100);
      correctAnswer = a + b;
      questionText = `${a} + ${b}`;
      break;
    case '-':
      a = randInt(20, 100);
      b = randInt(1, a);
      correctAnswer = a - b;
      questionText = `${a} - ${b}`;
      break;
    case '×':
      a = randInt(2, 15);
      b = randInt(2, 15);
      correctAnswer = a * b;
      questionText = `${a} × ${b}`;
      break;
    case '÷':
      b = randInt(2, 12);
      correctAnswer = randInt(2, 15);
      a = b * correctAnswer;
      questionText = `${a} ÷ ${b}`;
      break;
  }

  return { questionText, correctAnswer };
}

module.exports = {
  generateQuestion: generateMixed
};
