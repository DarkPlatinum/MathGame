import React from 'react';
import './NumberPad.css';

export default function NumberPad({ onNumber, onBackspace, onClear, onSubmit, disabled }) {
  return (
    <div className="number-pad">
      <button className="numpad-btn" onClick={() => onNumber('7')} disabled={disabled} type="button">7</button>
      <button className="numpad-btn" onClick={() => onNumber('8')} disabled={disabled} type="button">8</button>
      <button className="numpad-btn" onClick={() => onNumber('9')} disabled={disabled} type="button">9</button>
      <button className="numpad-btn numpad-action numpad-minus" onClick={() => onNumber('-')} disabled={disabled} type="button">-</button>
      
      <button className="numpad-btn" onClick={() => onNumber('4')} disabled={disabled} type="button">4</button>
      <button className="numpad-btn" onClick={() => onNumber('5')} disabled={disabled} type="button">5</button>
      <button className="numpad-btn" onClick={() => onNumber('6')} disabled={disabled} type="button">6</button>
      <button className="numpad-btn numpad-action numpad-clear" onClick={onClear} disabled={disabled} type="button">C</button>
      
      <button className="numpad-btn" onClick={() => onNumber('1')} disabled={disabled} type="button">1</button>
      <button className="numpad-btn" onClick={() => onNumber('2')} disabled={disabled} type="button">2</button>
      <button className="numpad-btn" onClick={() => onNumber('3')} disabled={disabled} type="button">3</button>
      <button className="numpad-btn numpad-action numpad-backspace" onClick={onBackspace} disabled={disabled} type="button">⌫</button>
      
      <button className="numpad-btn" onClick={() => onNumber('0')} disabled={disabled} type="button">0</button>
      <button className="numpad-btn numpad-submit" onClick={onSubmit} disabled={disabled} type="button">ENTER</button>
    </div>
  );
}
