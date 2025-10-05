import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
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
    const {selectedLocale, t} = this.props,
      localizedModes = {
        countryName: t('modes.country-name'),
        capital: t('modes.capital'),
        flag: t('modes.flag'),
        quiz: t('modes.quiz')
      },
      localizedAreas = areas.map(area => ({id: area, label: t(`data.continents.${area}`)}));

    return (
      <div className="container">
        <Header
          title={t('header.title')}
          sub-title={t('header.sub-title')}
          description={t('header.description')}>
          <LocaleSelect locales={supportedGameLocales} selectedLocale={selectedLocale}/>
        </Header>
        <AreaList items={localizedAreas} modes={localizedModes} selectedLocale={selectedLocale}/>
        <div className="maps-container">
          <ZoomingMap />
          <RotatingGlobe />
        </div>
        <PageFooter locale={locale} items={footerItems.map(item => ({
          text: item.text || t(`footer.${item.id}`),
          url: item.url
        }))}/>
      </div>
    );
  }

}

export default withTranslation()(StartScreen);
