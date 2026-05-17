import React, { useEffect, useRef } from 'react';
import './MobileControls.css';

export default function MobileControls({ onMove, onInteract }) {
  const intervalRef = useRef(null);
  const onMoveRef = useRef(onMove);
  const activePointerIdRef = useRef(null);

  // Sync the latest onMove function to ref to prevent closures capturing stale states
  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  const startMoving = (e, dir) => {
    if (activePointerIdRef.current !== null) return;
    activePointerIdRef.current = e.pointerId;

    // Walk immediately
    onMoveRef.current(dir);

    // Set walking loop
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      onMoveRef.current(dir);
    }, 180);
  };

  const stopMoving = (e) => {
    if (e && e.pointerId !== activePointerIdRef.current) return;
    activePointerIdRef.current = null;
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
            onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); startMoving(e, 'up'); }} 
            onPointerUp={(e) => { e.preventDefault(); stopMoving(e); }}
            onPointerLeave={(e) => stopMoving(e)}
            onPointerCancel={(e) => stopMoving(e)}
          >
            ▲
          </button>
        </div>
        <div className="d-pad-row">
          <button 
            className="d-pad-btn left" 
            onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); startMoving(e, 'left'); }} 
            onPointerUp={(e) => { e.preventDefault(); stopMoving(e); }}
            onPointerLeave={(e) => stopMoving(e)}
            onPointerCancel={(e) => stopMoving(e)}
          >
            ◀
          </button>
          <div className="d-pad-center"></div>
          <button 
            className="d-pad-btn right" 
            onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); startMoving(e, 'right'); }} 
            onPointerUp={(e) => { e.preventDefault(); stopMoving(e); }}
            onPointerLeave={(e) => stopMoving(e)}
            onPointerCancel={(e) => stopMoving(e)}
          >
            ▶
          </button>
        </div>
        <div className="d-pad-row">
          <button 
            className="d-pad-btn down" 
            onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); startMoving(e, 'down'); }} 
            onPointerUp={(e) => { e.preventDefault(); stopMoving(e); }}
            onPointerLeave={(e) => stopMoving(e)}
            onPointerCancel={(e) => stopMoving(e)}
          >
            ▼
          </button>
        </div>
      </div>
      
      <div className="action-buttons">
        <button 
          className="action-btn interact" 
          onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onInteract(); }}
        >
          Interact
        </button>
      </div>
    </div>
  );
}
