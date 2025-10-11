import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getActiveLanguage, getTranslate} from 'react-localize-redux';

import {footerItems, locale} from '../constants';
import {supportedGameLocales} from '../services/localizationService';
import {areas} from '../services/countriesService';

import AreaList from '../components/start-screen/area-list/AreaList';
import PageFooter from '../components/page-footer/PageFooter';
import SimpleWorldMap from '../components/learning-maps/SimpleWorldMap';
import ThreeJSGlobe from '../components/learning-maps/ThreeJSGlobe';

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
      <div className="container">
        <div className="mb-4"/>
        <div className="mb-5">
          <h3 className="text-center mb-4" style={{
            color: '#6366f1',
            fontWeight: '800',
            fontSize: '2rem',
            marginBottom: '2.5rem'
          }}>{translate('header.title')}</h3>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="map-card">
                <SimpleWorldMap />
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="map-card">
                <ThreeJSGlobe />
              </div>
            </div>
          </div>
        </div>

        <AreaList items={localizedAreas} modes={localizedModes} selectedLocale={selectedLocale}/>
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
