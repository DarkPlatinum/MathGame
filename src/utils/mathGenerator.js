/**
 * Math Question Generator
 * Generates math questions based on difficulty level
 */

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEasy() {
  const ops = ['+', '-'];
  const op = ops[randInt(0, ops.length - 1)];
  let a = randInt(1, 50);
  let b = randInt(1, 50);

  if (op === '-' && b > a) [a, b] = [b, a];

  const questionText = `${a} ${op} ${b}`;
  const correctAnswer = op === '+' ? a + b : a - b;

  return { questionText, correctAnswer, difficulty: 'easy' };
}

function generateMedium() {
  const ops = ['+', '-', '×'];
  const op = ops[randInt(0, ops.length - 1)];
  let a, b, correctAnswer;

  switch (op) {
    case '+':
      a = randInt(10, 100);
      b = randInt(10, 100);
      correctAnswer = a + b;
      break;
    case '-':
      a = randInt(20, 100);
      b = randInt(1, a);
      correctAnswer = a - b;
      break;
    case '×':
      a = randInt(2, 15);
      b = randInt(2, 15);
      correctAnswer = a * b;
      break;
  }

  const questionText = `${a} ${op} ${b}`;
  return { questionText, correctAnswer, difficulty: 'medium' };
}

function generateHard() {
  const ops = ['+', '-', '×', '÷', 'mixed'];
  const op = ops[randInt(0, ops.length - 1)];
  let a, b, c, correctAnswer, questionText;

  switch (op) {
    case '+':
      a = randInt(50, 200);
      b = randInt(50, 200);
      correctAnswer = a + b;
      questionText = `${a} + ${b}`;
      break;
    case '-':
      a = randInt(50, 200);
      b = randInt(1, a);
      correctAnswer = a - b;
      questionText = `${a} - ${b}`;
      break;
    case '×':
      a = randInt(5, 25);
      b = randInt(5, 25);
      correctAnswer = a * b;
      questionText = `${a} × ${b}`;
      break;
    case '÷':
      b = randInt(2, 15);
      correctAnswer = randInt(2, 20);
      a = b * correctAnswer;
      questionText = `${a} ÷ ${b}`;
      break;
    case 'mixed':
      a = randInt(5, 30);
      b = randInt(2, 10);
      c = randInt(1, 20);
      const mixOps = [
        { text: `${a} + ${b} × ${c}`, answer: a + b * c },
        { text: `${a} × ${b} - ${c}`, answer: a * b - c },
        { text: `${a} + ${b} + ${c}`, answer: a + b + c },
      ];
      const chosen = mixOps[randInt(0, mixOps.length - 1)];
      questionText = chosen.text;
      correctAnswer = chosen.answer;
      break;
  }

  return { questionText, correctAnswer, difficulty: 'hard' };
}

export function generateQuestion(difficulty = 'easy') {
  switch (difficulty) {
    case 'easy':
      return generateEasy();
    case 'medium':
      return generateMedium();
    case 'hard':
      return generateHard();
    default:
      return generateEasy();
  }
}
