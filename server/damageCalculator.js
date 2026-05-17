function calculateDamage(answerTimeMs, streak) {
  let damage = 10; // Base damage
  
  if (answerTimeMs <= 2000) {
    damage += 5; // Under 2s bonus
  } else if (answerTimeMs <= 4000) {
    damage += 3; // Under 4s bonus
  }
  
  if (streak >= 3) {
    damage += 5; // Streak bonus
  }
  
  return damage;
}

module.exports = {
  calculateDamage
};
