import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import { loadPlayer } from '../utils/storage';
import './StartPage.css';

export default function StartPage() {
  const navigate = useNavigate();

  const player = loadPlayer();
  const hasSave = player.setupComplete;

  return (
    <div className="start-screen">
      {/* Animated background */}
      <div className="start-bg">
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
        <div className="bg-grid" />
      </div>

      {/* Floating math symbols */}
      <div className="math-particles">
        {['÷', '×', '+', '−', '=', 'π', '∑', '√', '%', '∞'].map((sym, i) => (
          <span
            key={i}
            className="math-symbol"
            style={{
              left: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
              fontSize: `${0.8 + Math.random() * 1.2}rem`,
            }}
          >
            {sym}
          </span>
        ))}
      </div>

      <div className="start-content">
        {/* Logo */}
        <div className="start-logo">
          <div className="logo-icon">
            <span className="logo-sword">⚔️</span>
            <span className="logo-brain">🧠</span>
          </div>
          <h1 className="game-title">
            <span className="title-mind">Mind</span>
            <span className="title-battle">Battle</span>
            <span className="title-arena">Arena</span>
          </h1>
          <p className="game-tagline">Fight with your mind. Win with math.</p>
        </div>

        {/* Menu buttons */}
        <div className="start-menu">
          <Button 
            size="large" 
            onClick={() => navigate(hasSave ? '/world' : '/setup', { state: { returnTo: '/world' } })}
          >
            ▶ Single Player
          </Button>

          <Button 
            size="large" 
            variant="secondary" 
            onClick={() => navigate(hasSave ? '/online' : '/setup', { state: { returnTo: '/online' } })}
          >
            🌐 Online Battle
          </Button>

          {hasSave && (
            <Button size="medium" variant="outline" onClick={() => navigate('/profile')}>
              📊 Profile
            </Button>
          )}
        </div>

        <div className="start-footer">
          <span>v1.0 · Made with ⚡ and 🧮</span>
        </div>
      </div>
    </div>
  );
}
