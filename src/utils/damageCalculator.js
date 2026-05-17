/**
 * Damage Calculator
 * Calculates damage based on answer speed and streak
 */

const BASE_DAMAGE = 10;

export function calculateDamage(answerTimeMs, streak) {
  let damage = BASE_DAMAGE;
  let bonusType = 'normal';
  let attackName = 'Mental Strike!';

  // Speed bonus
  if (answerTimeMs < 2000) {
    damage += 5;
    bonusType = 'fast';
    attackName = 'Lightning Calculation!';
  } else if (answerTimeMs < 4000) {
    damage += 3;
    bonusType = 'quick';
    attackName = 'Quick Math!';
  }

  // Streak bonus (every 3 correct answers in a row)
  let streakBonus = false;
  if (streak > 0 && streak % 3 === 0) {
    damage += 5;
    streakBonus = true;
    attackName = 'Brain Combo!';
  }

  return {
    damage,
    bonusType,
    streakBonus,
    attackName,
    answerTimeMs
  };
}

export function getXPReward(difficulty, won) {
  if (!won) return 5;
  switch (difficulty) {
    case 'easy': return 20;
    case 'medium': return 40;
    case 'hard': return 75;
    default: return 20;
  }
}

export function getCoinReward(difficulty, won) {
  if (!won) return 2;
  switch (difficulty) {
    case 'easy': return 10;
    case 'medium': return 25;
    case 'hard': return 50;
    default: return 10;
  }
}

export function getMaxHP(level) {
  return 100 + (level - 1) * 5;
}

export function getXPForNextLevel(level) {
  return 50 + (level - 1) * 30;
}
