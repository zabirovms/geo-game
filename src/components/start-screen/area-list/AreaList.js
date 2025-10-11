import React from 'react';
import {Link} from 'react-router-dom';

import Continents from '../../maps/continents/Continents';
import './_areaList.css';

const modeIcons = {
  countryName: '🌍',
  capital: '🏛️',
  flag: '🏴'
};

export default props => (
  <div className="row">
    {props.items.map(i => (
      <div className="col-12 col-lg-6" key={i.id}>
        <div className="gg-area glass-card">
          <h3>{i.label}</h3>
          <div className="gg-area-buttons">
            {[
              'countryName',
              'capital',
              'flag'
            ].map(mode => (
              <Link 
                className="btn btn-outline-primary gg-mode-btn"
                to={`/${i.id}/${mode}`}
                key={mode}>
                <span className="mode-icon">{modeIcons[mode]}</span>
                <span>{props.modes[mode]}</span>
              </Link>
            ))}
          </div>
          <div className="gg-area-icon">
            <Continents active={i.id}/>
          </div>
        </div>
      </div>
    ))}
  </div>
);
