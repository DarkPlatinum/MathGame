import React, { useState, useEffect, useCallback, useRef } from 'react';
import HPBar from './HPBar';
import BattleLog from './BattleLog';
import AnswerInput from './AnswerInput';
import DamagePopup from './DamagePopup';
import { generateQuestion } from '../../utils/mathGenerator';
import { calculateDamage, getMaxHP } from '../../utils/damageCalculator';
import { loadPlayer } from '../../utils/storage';
import './BattleScreen.css';

export default function BattleScreen({ npc, onBattleEnd }) {
  const player = loadPlayer();
  const playerMaxHP = getMaxHP(player.level);

  const [playerHP, setPlayerHP] = useState(playerMaxHP);
  const [enemyHP, setEnemyHP] = useState(npc.hp);
  const [question, setQuestion] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [streak, setStreak] = useState(0);
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [damagePopups, setDamagePopups] = useState([]);
  const [battleState, setBattleState] = useState('intro'); // intro, fighting, penalty, ended
  const [shakeTarget, setShakeTarget] = useState(null); // 'player' or 'enemy'
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [introStep, setIntroStep] = useState(0);
  const popupIdRef = useRef(0);

  // NPC correct chance not needed for turn-based

  const addMessage = useCallback((text, type = 'info') => {
    setMessages(prev => [...prev, { text, type }]);
  }, []);

  const showFeedback = useCallback((text, type) => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 1500);
  }, []);

  const addDamagePopup = useCallback((damage, position, attackName) => {
    const id = ++popupIdRef.current;
    setDamagePopups(prev => [...prev, { id, damage, position, attackName }]);
    setTimeout(() => {
      setDamagePopups(prev => prev.filter(p => p.id !== id));
    }, 1300);
  }, []);

  const triggerShake = useCallback((target) => {
    setShakeTarget(target);
    setTimeout(() => setShakeTarget(null), 400);
  }, []);

  const nextQuestion = useCallback(() => {
    const q = generateQuestion(npc.difficulty);
    setQuestion(q);
    setQuestionStartTime(Date.now());
    setBattleState('fighting');
  }, [npc.difficulty]);

  const npcAttack = useCallback((onSurvive) => {
    const npcDamage = calculateDamage(3000, 0); // Average damage
    setPlayerHP(prev => {
      const newHP = Math.max(0, prev - npcDamage.damage);
      addMessage(`${npc.name} attacked!`, 'damage');
      addMessage(`You took ${npcDamage.damage} damage!`, 'damage');
      addDamagePopup(npcDamage.damage, 'player', 'Enemy Strike!');
      triggerShake('player');

      if (newHP <= 0) {
        setBattleState('ended');
        setTimeout(() => onBattleEnd(false, { totalCorrect, streak: 0 }), 1500);
      } else if (onSurvive) {
        onSurvive();
      }
      return newHP;
    });
  }, [npc.name, addMessage, addDamagePopup, triggerShake, onBattleEnd, totalCorrect]);

  // Start intro sequence
  useEffect(() => {
    if (battleState === 'intro' && introStep === 0) {
      addMessage(`${npc.name} appeared!`, 'info');
      setIntroStep(1);
    }
  }, [battleState, introStep, npc.name, addMessage]);

  // Handle intro dialogue
  const handleIntroClick = () => {
    if (introStep === 1) {
      addMessage(`"${npc.dialogue}"`, 'info');
      setIntroStep(2);
    } else if (introStep === 2) {
      addMessage('Battle Start!', 'critical');
      nextQuestion();
    }
  };



  const handlePlayerAnswer = (answer) => {
    if (battleState !== 'fighting' || !question) return;

    const answerTime = Date.now() - questionStartTime;
    setBattleState('penalty'); // Briefly disable input

    if (answer === question.correctAnswer) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setTotalCorrect(prev => prev + 1);

      const dmgResult = calculateDamage(answerTime, newStreak);
      const isCritical = dmgResult.bonusType === 'fast';
      const isStreakBonus = dmgResult.streakBonus;

      setEnemyHP(prev => {
        const newHP = Math.max(0, prev - dmgResult.damage);

        addMessage(`${player.name} answered correctly!`, 'correct');
        addMessage(`${npc.name} took ${dmgResult.damage} damage!`, 'damage');
        addDamagePopup(dmgResult.damage, 'enemy', dmgResult.attackName);
        triggerShake('enemy');

        if (isCritical) showFeedback('Critical Hit! ⚡', 'critical');
        else if (isStreakBonus) showFeedback('Brain Combo! 🔥', 'streak');
        else showFeedback('Correct! ✓', 'correct');

        if (newHP <= 0) {
          setBattleState('ended');
          setTimeout(() => onBattleEnd(true, { totalCorrect: totalCorrect + 1, bestStreak: newStreak }), 1500);
        } else {
          setTimeout(() => {
            npcAttack(() => {
              setTimeout(() => nextQuestion(), 1000);
            });
          }, 1200);
        }
        return newHP;
      });
    } else {
      // Wrong answer
      setStreak(0);
      showFeedback('Wrong!', 'wrong');
      addMessage('Wrong answer!', 'wrong');
      
      setTimeout(() => {
        npcAttack(() => {
          setTimeout(() => nextQuestion(), 1000);
        });
      }, 1000);
    }
  };

  return (
    <div className={`battle-screen ${shakeTarget === 'player' ? 'screen-shake' : ''}`}>
      {/* Battle arena background */}
      <div className="battle-arena">
        <div className="battle-bg-pattern" />

        {/* Enemy section */}
        <div className={`battle-enemy-section ${shakeTarget === 'enemy' ? 'sprite-shake' : ''}`}>
          <HPBar
            current={enemyHP}
            max={npc.hp}
            name={npc.name}
            isEnemy={true}
            color={npc.color}
          />
          <div className="battle-sprite enemy-sprite" style={{ background: npc.color }}>
            <div className="sprite-face">
              <div className="sprite-eyes">
                <span className="sprite-eye" />
                <span className="sprite-eye" />
              </div>
              <div className="sprite-mouth enemy-mouth" />
            </div>
            <div className="sprite-difficulty">{npc.difficulty.toUpperCase()}</div>
          </div>
        </div>

        {/* Damage popups */}
        {damagePopups.map(popup => (
          <DamagePopup
            key={popup.id}
            damage={popup.damage}
            position={popup.position}
            attackName={popup.attackName}
          />
        ))}

        {/* Player section */}
        <div className={`battle-player-section ${shakeTarget === 'player' ? 'sprite-shake' : ''}`}>
          <div className="battle-sprite player-sprite" style={{ background: player.avatarColor }}>
            <div className="sprite-face">
              <div className="sprite-eyes">
                <span className="sprite-eye" />
                <span className="sprite-eye" />
              </div>
              <div className="sprite-mouth" />
            </div>
          </div>
          <HPBar
            current={playerHP}
            max={playerMaxHP}
            name={player.name}
            isEnemy={false}
            color={player.avatarColor}
          />
        </div>

        {/* Feedback overlay */}
        {feedback && (
          <div className={`battle-feedback feedback-${feedback.type}`}>
            {feedback.text}
          </div>
        )}
      </div>

      {/* Question and input area */}
      <div className="battle-bottom">
        {battleState === 'intro' ? (
          <div className="battle-intro" onClick={handleIntroClick}>
            <div className="intro-dialogue">
              {introStep === 0 && `${npc.name} appeared!`}
              {introStep === 1 && `${npc.name}: "${npc.dialogue}"`}
              {introStep === 2 && 'Get ready to battle!'}
            </div>
            <span className="intro-continue">Click to continue ▼</span>
          </div>
        ) : battleState === 'ended' ? (
          <div className="battle-ended-msg">
            {enemyHP <= 0 ? (
              <div className="victory-text">🏆 VICTORY! 🏆</div>
            ) : (
              <div className="defeat-text">💀 DEFEATED 💀</div>
            )}
          </div>
        ) : (
          <>
            {question && (
              <div className="question-box">
                <div className="question-label">SOLVE:</div>
                <div className="question-text">{question.questionText}</div>
              </div>
            )}
            <AnswerInput
              onSubmit={handlePlayerAnswer}
              disabled={battleState === 'penalty' || battleState === 'ended'}
            />
            <div className="battle-stats-bar">
              <span className="streak-display">🔥 Streak: {streak}</span>
              <span className="correct-display">✓ Correct: {totalCorrect}</span>
            </div>
          </>
        )}

        <BattleLog messages={messages} />
      </div>
    </div>
  );
}
