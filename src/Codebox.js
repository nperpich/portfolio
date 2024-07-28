import React from 'react';

export default function Codebox({ variable, obj = {}, rightAlign = false }) {
  return (
    <div className={`code-container ${rightAlign ? 'right-align' : ''}`}>
      <div>
        <span style={{ color: 'var(--pink)' }}>{`${variable} `}</span>
        <span>{`{`}</span>
      </div>
      {Object.keys(obj).map((key) => {
        const value = obj[key];
        const isArray = Array.isArray(value);
        return (
          <div
            style={{
              paddingLeft: '30px',
              //   display: 'flex',
              //   justifyContent: 'flex-start',
              //   flexDirection: 'row',
              //   gap: '8px',
            }}
          >
            <span>{`${key}: `}</span>
            {isArray ? (
              <>
                {' '}
                <span style={{ color: 'var(--sky-blue)' }}>{'['}</span>
                {value.map((el) => (
                  <div
                    style={{ marginLeft: '36px', color: 'var(--sky-blue)' }}
                  >{`${el},`}</div>
                ))}
                <div style={{ color: 'var(--sky-blue)' }}>{']'}</div>
              </>
            ) : (
              <span style={{ color: 'var(--sky-blue)' }}>{`${value};`}</span>
            )}
          </div>
        );
      })}
      <div>
        <span>{`}`}</span>
      </div>
    </div>
  );
}
