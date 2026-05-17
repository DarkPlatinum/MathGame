import React, { useEffect, useRef } from 'react';
import './MobileControls.css';

export default function MobileControls({ onMove, onInteract }) {
  const intervalRef = useRef(null);
  const onMoveRef = useRef(onMove);

  // Sync the latest onMove function to ref to prevent closures capturing stale states
  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  const startMoving = (dir) => {
    // Walk immediately
    onMoveRef.current(dir);

    // Set walking loop
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      onMoveRef.current(dir);
    }, 180);
  };

  const stopMoving = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Ensure clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="mobile-controls">
      <div className="d-pad">
        <div className="d-pad-row">
          <button 
            className="d-pad-btn up" 
            onTouchStart={(e) => { e.preventDefault(); startMoving('up'); }} 
            onTouchEnd={stopMoving}
            onMouseDown={(e) => { e.preventDefault(); startMoving('up'); }}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
          >
            ▲
          </button>
        </div>
        <div className="d-pad-row">
          <button 
            className="d-pad-btn left" 
            onTouchStart={(e) => { e.preventDefault(); startMoving('left'); }} 
            onTouchEnd={stopMoving}
            onMouseDown={(e) => { e.preventDefault(); startMoving('left'); }}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
          >
            ◀
          </button>
          <div className="d-pad-center"></div>
          <button 
            className="d-pad-btn right" 
            onTouchStart={(e) => { e.preventDefault(); startMoving('right'); }} 
            onTouchEnd={stopMoving}
            onMouseDown={(e) => { e.preventDefault(); startMoving('right'); }}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
          >
            ▶
          </button>
        </div>
        <div className="d-pad-row">
          <button 
            className="d-pad-btn down" 
            onTouchStart={(e) => { e.preventDefault(); startMoving('down'); }} 
            onTouchEnd={stopMoving}
            onMouseDown={(e) => { e.preventDefault(); startMoving('down'); }}
            onMouseUp={stopMoving}
            onMouseLeave={stopMoving}
          >
            ▼
          </button>
        </div>
      </div>
      
      <div className="action-buttons">
        <button 
          className="action-btn interact" 
          onTouchStart={(e) => { e.preventDefault(); onInteract(); }} 
          onMouseDown={(e) => { e.preventDefault(); onInteract(); }}
        >
          Interact
        </button>
      </div>
    </div>
  );
}
