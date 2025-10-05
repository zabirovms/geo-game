import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getActiveLanguage, getTranslate} from 'react-localize-redux';
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {footerItems, locale} from '../constants';
import {supportedGameLocales} from '../services/localizationService';
import {areas} from '../services/countriesService';
import Header from '../components/start-screen/header/Header';
import AreaList from '../components/start-screen/area-list/AreaList';
import PageFooter from '../components/page-footer/PageFooter';
import LocaleSelect from '../components/start-screen/locale-select/LocaleSelect';
import ZoomingMap from '../components/amcharts/ZoomingMap';
import RotatingGlobe from '../components/amcharts/RotatingGlobe';
import '../components/amcharts/AmCharts.css';

am4core.useTheme(am4themes_animated);

class StartScreen extends Component {

  render() {
    const {selectedLocale, translate} = this.props,
      localizedModes = {
        countryName: translate('modes.country-name'),
        capital: translate('modes.capital'),
        flag: translate('modes.flag'),
        quiz: translate('modes.quiz')
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
        <AreaList items={localizedAreas} modes={localizedModes} selectedLocale={selectedLocale}/>
        <div className="maps-container">
          <ZoomingMap />
          <RotatingGlobe />
        </div>
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