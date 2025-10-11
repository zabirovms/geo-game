import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getActiveLanguage, getTranslate} from 'react-localize-redux';

import {footerItems, locale} from '../constants';
import {areas} from '../services/countriesService';

import AreaList from '../components/start-screen/area-list/AreaList';
import PageFooter from '../components/page-footer/PageFooter';
import SimpleWorldMap from '../components/learning-maps/SimpleWorldMap';

class StartScreen extends Component {

  render() {
    const {selectedLocale, translate} = this.props,
      localizedModes = {
        countryName: translate('modes.country-name'),
        capital: translate('modes.capital'),
        flag: translate('modes.flag')
      },
      localizedAreas = areas.map(area => ({id: area, label: translate(`continents.${area}`)}));

    const totalCountries = 200;

    return (
      <div className="container" style={{maxWidth: '1400px'}}>
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">
            {translate('header.title')}
          </h1>
        </section>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🌍</div>
            <div className="stat-number">{totalCountries}</div>
            <div className="stat-label">Кишварҳо</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🗺️</div>
            <div className="stat-number">{areas.length}</div>
            <div className="stat-label">Қитъаҳо</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-number">3</div>
            <div className="stat-label">Режимҳои бозӣ</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-number">∞</div>
            <div className="stat-label">Имкониятҳо</div>
          </div>
        </div>

        {/* 3D Globe and Game Modes */}
        <div className="main-content-grid">
          {/* Interactive 3D Globe */}
          <div className="globe-section">
            <div className="section-card">
              <h3 className="section-title">🌐 Харитаи интерактивӣ</h3>
              <div style={{height: '400px'}}>
                <SimpleWorldMap />
              </div>
            </div>
          </div>

          {/* Game Mode Selector */}
          <div className="modes-section">
            <h3 className="section-title">🎯 Режими бозиро интихоб кунед</h3>
            <div className="game-modes-grid">
              <div className="mode-card mode-card-country">
                <div className="mode-icon">🌍</div>
                <div className="mode-name">{localizedModes.countryName}</div>
                <div className="mode-desc">Кишварҳоро бо номи онҳо ёбед</div>
              </div>
              <div className="mode-card mode-card-capital">
                <div className="mode-icon">🏛️</div>
                <div className="mode-name">{localizedModes.capital}</div>
                <div className="mode-desc">Кишварҳоро бо пойтахт ёбед</div>
              </div>
              <div className="mode-card mode-card-flag">
                <div className="mode-icon">🏴</div>
                <div className="mode-name">{localizedModes.flag}</div>
                <div className="mode-desc">Кишварҳоро бо парчам ёбед</div>
              </div>
            </div>

            {/* Difficulty Selector */}
            <div className="difficulty-section">
              <h4 className="difficulty-title">⚡ Дараҷаи душворӣ</h4>
              <div className="difficulty-buttons">
                <button className="difficulty-btn difficulty-easy">
                  <span className="difficulty-emoji">😊</span> Осон
                </button>
                <button className="difficulty-btn difficulty-medium">
                  <span className="difficulty-emoji">🤔</span> Миёна
                </button>
                <button className="difficulty-btn difficulty-hard">
                  <span className="difficulty-emoji">😤</span> Душвор
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Section */}
        <div className="quick-start-section">
          <h3 className="section-title">⚡ Шурӯи зуд</h3>
          <div className="quick-start-grid">
            {localizedAreas.map(area => (
              <button key={area.id} className="quick-start-btn">
                <span className="continent-flag">{this.getContinentEmoji(area.id)}</span>
                <span className="continent-name">{area.label}</span>
                <span className="play-icon">▶</span>
              </button>
            ))}
          </div>
        </div>

        {/* Continent Selection */}
        <AreaList items={localizedAreas} modes={localizedModes} selectedLocale={selectedLocale}/>
        
        {/* Footer */}
        <PageFooter locale={locale} items={footerItems.map(item => ({
          text: item.text || translate(`footer.${item.id}`),
          url: item.url
        }))}/>
      </div>
    );
  }

  getContinentEmoji(continentId) {
    const emojiMap = {
      asia: '🌏',
      africa: '🌍',
      'north-america': '🌎',
      'south-america': '🌎',
      europe: '🗺️',
      oceania: '🏝️'
    };
    return emojiMap[continentId] || '🌍';
  }

}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  selectedLocale: getActiveLanguage(state.locale).code
});

export default connect(
  mapStateToProps
)(StartScreen);
