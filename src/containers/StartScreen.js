import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getActiveLanguage, getTranslate} from 'react-localize-redux';

import {footerItems, locale} from '../constants';
import {supportedGameLocales} from '../services/localizationService';
import {areas} from '../services/countriesService';

import Header from '../components/start-screen/header/Header';
import AreaList from '../components/start-screen/area-list/AreaList';
import PageFooter from '../components/page-footer/PageFooter';
import LocaleSelect from '../components/start-screen/locale-select/LocaleSelect';
import ZoomableWorldMap from '../components/learning-maps/ZoomableWorldMap';
import RotatingGlobe from '../components/learning-maps/RotatingGlobe';

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
        <Header
          title={translate('header.title')}
          sub-title={translate('header.sub-title')}
          description={translate('header.description')}>
          <LocaleSelect locales={supportedGameLocales} selectedLocale={selectedLocale}/>
        </Header>
        
        <div className="row mb-5">
          <div className="col-12">
            <h3 className="text-center mb-4">Explore the World - Learning Tools</h3>
          </div>
          <div className="col-md-6 mb-4">
            <ZoomableWorldMap />
          </div>
          <div className="col-md-6 mb-4">
            <RotatingGlobe />
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
