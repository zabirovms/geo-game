import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const TopBar = ({ location }) => {
  return (
    <div style={{
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <Link to={`/tg`} style={{ fontWeight: 700, color: '#1e293b', textDecoration: 'none' }}>
        Geo Game
      </Link>
      <div />
    </div>
  );
};

export default withRouter(TopBar);
