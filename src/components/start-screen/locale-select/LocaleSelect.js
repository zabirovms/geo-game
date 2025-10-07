import React from 'react';
import {Link} from 'react-router-dom';

import './_localeSelect.css';

export default props => (
  <div className="gg-localeSelect">
    {props.locales.map(locale => (
      <Link
        to={`/${locale.code}`}
        key={locale.code}
        className={`btn ${props.selectedLocale === locale.code ? 'active' : ''}`}>
        <span className="text-capitalize">{locale.name}</span>
      </Link>
    ))}
  </div>
);
