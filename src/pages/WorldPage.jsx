import React, { useState } from 'react';
import OverworldMap from '../components/Overworld/OverworldMap';
import BattleScreen from '../components/Battle/BattleScreen';
import Modal from '../components/UI/Modal';
import Button from '../components/UI/Button';
import { updatePlayer, markNPCDefeated, addBadge } from '../utils/storage';
import { loadPlayer } from '../utils/storage';
import { calculateDamage, getXPReward as calcXP, getCoinReward as calcCoin, getXPForNextLevel } from '../utils/damageCalculator';
import './WorldPage.css';

export default function WorldPage() {
  const [activeBattle, setActiveBattle] = useState(null);
  const [battleResult, setBattleResult] = useState(null); // { won: boolean, xp: number, coins: number, leveledUp: boolean }
  const player = loadPlayer();

  const handleStartBattle = (npc) => {
    setActiveBattle(npc);
  };

  const handleBattleEnd = (won, stats) => {
    const npc = activeBattle;
    
    // Calculate rewards
    const xpReward = calcXP(npc.difficulty, won);
    const coinReward = calcCoin(npc.difficulty, won);
    
    let currentLevel = player.level;
    let currentXP = player.xp + xpReward;
    let leveledUp = false;
    
    // Level up logic
    while (currentXP >= getXPForNextLevel(currentLevel)) {
      currentXP -= getXPForNextLevel(currentLevel);
      currentLevel += 1;
      leveledUp = true;
    }

    const updates = {
      xp: currentXP,
      level: currentLevel,
      coins: player.coins + coinReward,
      wins: player.wins + (won ? 1 : 0),
      losses: player.losses + (won ? 0 : 1),
      totalCorrectAnswers: player.totalCorrectAnswers + stats.totalCorrect,
      bestStreak: Math.max(player.bestStreak, stats.bestStreak || 0)
    };

    updatePlayer(updates);

    if (won) {
      markNPCDefeated(npc.id);
      if (npc.badge) {
        addBadge(npc.badge);
      }
    }

    setBattleResult({ won, xp: xpReward, coins: coinReward, leveledUp, npcName: npc.name });
  };

  const closeBattleResult = () => {
    setActiveBattle(null);
    setBattleResult(null);
  };

  return (
    <>
      {activeBattle && !battleResult ? (
        <BattleScreen npc={activeBattle} onBattleEnd={handleBattleEnd} />
      ) : (
        <OverworldMap onStartBattle={handleStartBattle} />
      )}

      <Modal isOpen={!!battleResult} title={battleResult?.won ? 'Victory!' : 'Defeat'}>
        {battleResult && (
          <div className="battle-result-modal">
            <p className="result-text">
              {battleResult.won ? `You defeated ${battleResult.npcName}!` : `You were defeated by ${battleResult.npcName}.`}
            </p>
            
            <div className="result-rewards">
              <div className="reward-item">
                <span className="reward-icon">⭐</span>
                <span className="reward-amount">+{battleResult.xp} XP</span>
              </div>
              <div className="reward-item">
                <span className="reward-icon">🪙</span>
                <span className="reward-amount">+{battleResult.coins} Coins</span>
              </div>
            </div>

            {battleResult.leveledUp && (
              <div className="level-up-notice">
                🎉 LEVEL UP! 🎉
              </div>
            )}

            <Button onClick={closeBattleResult} className="result-continue-btn">
              Continue
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}
