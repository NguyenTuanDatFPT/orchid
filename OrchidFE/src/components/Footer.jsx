import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      background: '#fff0f6',
      color: '#b83260',
      textAlign: 'center',
      padding: '16px 0',
      marginTop: '40px',
      borderTop: '1px solid #f6c1c7'
    }}>
      © {new Date().getFullYear()} Orchid Shop. All rights reserved.
    </footer>
  );
}