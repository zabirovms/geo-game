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

    return (
      <div className="container" style={{maxWidth: '1200px'}}>
        {/* Hero Section */}
        <section className="hero-section">
          <h1 className="hero-title">
            {translate('header.title')}
          </h1>
          <p className="hero-subtitle">
            {translate('header.sub-title')}
          </p>
        </section>

        {/* Interactive World Map */}
        <div className="mb-5">
          <div className="map-card">
            <h4 style={{textAlign: 'center', marginBottom: '1.5rem'}}>
              {translate('header.description')}
            </h4>
            <SimpleWorldMap />
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

}

const mapStateToProps = state => ({
  translate: getTranslate(state.locale),
  selectedLocale: getActiveLanguage(state.locale).code
});

export default connect(
  mapStateToProps
)(StartScreen);
