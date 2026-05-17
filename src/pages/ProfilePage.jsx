import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { loadPlayer, resetPlayer } from '../utils/storage';
import { getMaxHP } from '../utils/damageCalculator';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const player = loadPlayer();
  const maxHP = getMaxHP(player.level);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your profile? This will delete all progress and cannot be undone.")) {
      resetPlayer();
      navigate('/');
    }
  };

  return (
    <div className="profile-screen">
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h1 className="profile-title">Player Profile</h1>
        <div style={{ width: '60px' }}></div>
      </div>

      <div className="profile-content">
        <Card glow className="profile-card">
          <div className="profile-top">
            <div className="profile-avatar" style={{ background: player.avatarColor || '#e63946' }}>
              <div className="sprite-face">
                <div className="sprite-eyes">
                  <span className="sprite-eye" />
                  <span className="sprite-eye" />
                </div>
                <div className="sprite-mouth" />
              </div>
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{player.name || 'Unknown Hero'}</h2>
              <div className="profile-level">Level {player.level}</div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-icon">❤️</span>
              <span className="stat-label">Max HP</span>
              <span className="stat-value">{maxHP}</span>
            </div>
            <div className="stat-box">
              <span className="stat-icon">⭐</span>
              <span className="stat-label">Total XP</span>
              <span className="stat-value">{player.xp}</span>
            </div>
            <div className="stat-box">
              <span className="stat-icon">🪙</span>
              <span className="stat-label">Coins</span>
              <span className="stat-value">{player.coins}</span>
            </div>
            <div className="stat-box">
              <span className="stat-icon">🏆</span>
              <span className="stat-label">Wins</span>
              <span className="stat-value">{player.wins}</span>
            </div>
            <div className="stat-box">
              <span className="stat-icon">💀</span>
              <span className="stat-label">Losses</span>
              <span className="stat-value">{player.losses}</span>
            </div>
            <div className="stat-box">
              <span className="stat-icon">🔥</span>
              <span className="stat-label">Best Streak</span>
              <span className="stat-value">{player.bestStreak || 0}</span>
            </div>
            <div className="stat-box">
              <span className="stat-icon">✓</span>
              <span className="stat-label">Correct Answers</span>
              <span className="stat-value">{player.totalCorrectAnswers || 0}</span>
            </div>
            <div className="stat-box">
              <span className="stat-icon">👾</span>
              <span className="stat-label">NPCs Defeated</span>
              <span className="stat-value">{player.npcsDefeated?.length || 0}</span>
            </div>
          </div>

          <div className="badges-section">
            <h3 className="badges-title">Badges</h3>
            {player.badges && player.badges.length > 0 ? (
              <div className="badges-list">
                {player.badges.map((badge, idx) => (
                  <div key={idx} className="badge-item" title={badge.description}>
                    <span className="badge-icon">{badge.icon}</span>
                    <span className="badge-name">{badge.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-badges">No badges earned yet. Go defeat some NPCs!</p>
            )}
          </div>

          <div className="profile-actions">
            <Button variant="outline" onClick={handleReset} className="reset-btn">
              Reset Profile
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
