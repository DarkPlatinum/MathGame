import React, { useState, useEffect, useRef } from 'react';
import HPBar from '../Battle/HPBar';
import BattleLog from '../Battle/BattleLog';
import AnswerInput from '../Battle/AnswerInput';
import DamagePopup from '../Battle/DamagePopup';
import '../Battle/BattleScreen.css';
import './PvPBattle.css';

export default function PvPBattle({ socket, roomCode, initialPlayers }) {
  const [players, setPlayers] = useState(initialPlayers);
  const [question, setQuestion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [damagePopups, setDamagePopups] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [shakeTarget, setShakeTarget] = useState(null); // 'player' or 'enemy'
  const [inputDisabled, setInputDisabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(socket.connected ? 'connected' : 'disconnected');
  
  const popupIdRef = useRef(0);

  const myId = socket.id;
  const opponentId = Object.keys(players).find(id => id !== myId);
  
  const myPlayer = players[myId];
  const opponent = players[opponentId];

  useEffect(() => {
    const handleConnect = () => setConnectionStatus('connected');
    const handleDisconnect = () => setConnectionStatus('disconnected');

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    socket.on('newQuestion', (data) => {
      setQuestion(data.questionText);
      setInputDisabled(false);
      setIsSubmitting(false);
    });

    socket.on('answerResult', (data) => {
      setIsSubmitting(false);
      
      if (data.correct) {
        const isMe = data.playerId === myId;
        const target = isMe ? 'enemy' : 'player';
        
        addMessage(`${data.playerName} answered correctly for ${data.damage} damage!`, 'damage');
        addDamagePopup(data.damage, target, 'Correct Answer!');
        triggerShake(target);
        
        if (isMe) {
          let feedbackText = 'Correct! ✓';
          let feedbackType = 'correct';
          if (data.streak > 1) {
            feedbackText = `Combo x${data.streak}! 🔥`;
            feedbackType = 'streak';
          }
          showFeedback(feedbackText, feedbackType);
        } else {
          showFeedback('Opponent got it! ⚡', 'wrong');
        }
        
        setInputDisabled(true); // Stop typing since someone got it
      } else {
        const isMe = data.playerId === myId;
        if (isMe) {
          showFeedback('Wrong! ⚠️', 'wrong');
          setInputDisabled(true);
          setTimeout(() => {
            // Only re-enable if question hasn't been solved by opponent
            setInputDisabled(false);
          }, data.penaltyMs);
        }
      }
    });

    socket.on('hpUpdate', (data) => {
      setPlayers(data.players);
    });

    socket.on('battleLog', (data) => {
      addMessage(data.message, data.type);
    });

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('newQuestion');
      socket.off('answerResult');
      socket.off('hpUpdate');
      socket.off('battleLog');
    };
  }, [socket, myId]);

  const addMessage = (text, type = 'info') => {
    setMessages(prev => [...prev, { text, type }]);
  };

  const showFeedback = (text, type) => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 1500);
  };

  const addDamagePopup = (damage, position, attackName) => {
    const id = ++popupIdRef.current;
    setDamagePopups(prev => [...prev, { id, damage, position, attackName }]);
    setTimeout(() => {
      setDamagePopups(prev => prev.filter(p => p.id !== id));
    }, 1300);
  };

  const triggerShake = (target) => {
    setShakeTarget(target);
    setTimeout(() => setShakeTarget(null), 400);
  };

  const handleAnswerSubmit = (answer) => {
    if (!question || inputDisabled || isSubmitting) return;
    setIsSubmitting(true);
    socket.emit('submitAnswer', { roomCode, answer });
  };

  if (!myPlayer || !opponent) return null;

  return (
    <div className={`pvp-battle-screen ${shakeTarget === 'player' ? 'screen-shake' : ''}`}>
      <div className="battle-arena">
        <div className="battle-bg-pattern" />

        <div className="pvp-battle-header">
          <span className="room-code-badge">ROOM: {roomCode}</span>
          <div className={`lobby-status status-${connectionStatus}`}>
            {connectionStatus === 'connected' ? '● Connected' : '○ Disconnected'}
          </div>
        </div>

        {/* Enemy (Opponent) section */}
        <div className={`battle-enemy-section ${shakeTarget === 'enemy' ? 'sprite-shake' : ''}`}>
          <HPBar 
            current={opponent.hp} 
            max={100} 
            name={opponent.name} 
            isEnemy={true} 
            color="#f72585" 
          />
          <div className="battle-sprite enemy-sprite" style={{ background: '#f72585' }}>
            <div className="sprite-face">
              <div className="sprite-eyes"><span className="sprite-eye"/><span className="sprite-eye"/></div>
              <div className="sprite-mouth enemy-mouth" />
            </div>
          </div>
          <div className="pvp-streak">🔥 {opponent.streak}</div>
        </div>

        {damagePopups.map(popup => (
          <DamagePopup key={popup.id} damage={popup.damage} position={popup.position} attackName={popup.attackName} />
        ))}

        {/* Player section */}
        <div className={`battle-player-section ${shakeTarget === 'player' ? 'sprite-shake' : ''}`}>
          <div className="battle-sprite player-sprite" style={{ background: '#4cc9f0' }}>
            <div className="sprite-face">
              <div className="sprite-eyes"><span className="sprite-eye"/><span className="sprite-eye"/></div>
              <div className="sprite-mouth" />
            </div>
          </div>
          <HPBar 
            current={myPlayer.hp} 
            max={100} 
            name={myPlayer.name + ' (You)'} 
            isEnemy={false} 
            color="#4cc9f0" 
          />
          <div className="pvp-streak pvp-streak-player">🔥 {myPlayer.streak}</div>
        </div>

        {feedback && <div className={`battle-feedback feedback-${feedback.type}`}>{feedback.text}</div>}
      </div>

      <div className="battle-bottom">
        <div className="question-box">
          <div className="question-label">SOLVE FIRST:</div>
          <div className="question-text">{question ? question : 'Waiting for question...'}</div>
        </div>
        
        <AnswerInput 
          onSubmit={handleAnswerSubmit} 
          disabled={!question || inputDisabled || isSubmitting} 
        />
        
        <BattleLog messages={messages} />
      </div>
    </div>
  );
}
