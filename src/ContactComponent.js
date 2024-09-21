import React from 'react';
import './ContactComponent.css';

export default function ContactComponent({ icon, text, clickHandler }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '20px',

        // margin:
        cursor: clickHandler ? 'pointer' : undefined,
      }}
      onClick={clickHandler}
    >
      <div style={{ color: '' }}>{icon}</div>
      <div
        className={clickHandler ? 'text-holder' : undefined}
        style={{ fontSize: '22px' }}
      >
        {text}
      </div>
    </div>
  );
}
