import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { updatePlayer, loadPlayer } from '../utils/storage';
import './SetupPage.css';

const AVATAR_COLORS = [
  '#e63946', '#4cc9f0', '#f72585', '#7209b7', '#2d6a4f', '#dda15e'
];

export default function SetupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const player = loadPlayer();
  const [name, setName] = useState(player.name || '');
  const [color, setColor] = useState(player.avatarColor || AVATAR_COLORS[0]);
  const [error, setError] = useState('');

  const handleStart = () => {
    if (!name.trim()) {
      setError('Please enter your name!');
      return;
    }
    
    updatePlayer({
      name: name.trim(),
      avatarColor: color,
      setupComplete: true
    });
    
    const returnTo = location.state?.returnTo || '/world';
    navigate(returnTo);
  };

  return (
    <div className="setup-screen">
      <Card glow className="setup-card">
        <h2 className="setup-title">Player Setup</h2>
        
        <div className="setup-preview">
          <div className="preview-sprite" style={{ background: color }}>
            <div className="sprite-face">
              <div className="sprite-eyes">
                <span className="sprite-eye" />
                <span className="sprite-eye" />
              </div>
              <div className="sprite-mouth" />
            </div>
          </div>
        </div>

        <div className="setup-form">
          <div className="form-group">
            <label>Your Name</label>
            <input 
              type="text" 
              className="setup-input"
              value={name}
              onChange={e => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="Enter hero name..."
              maxLength={15}
            />
            {error && <span className="setup-error">{error}</span>}
          </div>

          <div className="form-group">
            <label>Avatar Color</label>
            <div className="color-picker">
              {AVATAR_COLORS.map(c => (
                <button
                  key={c}
                  className={`color-btn ${color === c ? 'selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="setup-actions">
          <Button variant="outline" onClick={() => navigate('/')}>Cancel</Button>
          <Button onClick={handleStart}>Begin Adventure ➔</Button>
        </div>
      </Card>
    </div>
  );
}
