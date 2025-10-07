import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { supportedGameLocales } from '../../services/localizationService';

const TopBar = ({ location }) => {
  const currentLocale = (location.pathname.split('/')[1] || 'tg');
  const locales = ['tg', 'ru', 'en'];

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
      <Link to={`/${currentLocale}`} style={{ fontWeight: 700, color: '#1e293b', textDecoration: 'none' }}>
        Geo Game
      </Link>

      <div style={{ display: 'flex', gap: 8 }}>
        {locales.map(code => {
          const localeObj = supportedGameLocales.find(l => l.code === code);
          const name = localeObj ? localeObj.name : code;
          const newPath = `/${code}${location.pathname.replace(/^\/[a-z]{2}/, '') || ''}`;
          const active = currentLocale === code;
          return (
            <Link
              key={code}
              to={newPath}
              style={{
                padding: '6px 10px',
                borderRadius: 10,
                fontWeight: 600,
                textDecoration: 'none',
                color: active ? '#fff' : '#4f46e5',
                background: active ? '#4f46e5' : 'transparent',
                border: '1px solid #4f46e5'
              }}
            >
              {name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default withRouter(TopBar);
