import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect, Route} from 'react-router-dom';
import {addTranslationForLanguage, initialize, setActiveLanguage} from 'react-localize-redux';

import StartScreen from './StartScreen';
import GameScreen from './GameScreen';
import Loader from '../components/common/Loader';

import {isAreaIdValid} from '../services/countriesService';
import {
  getBestMatchingLocale,
  getTranslation,
  isLocaleSupported,
  supportedGameLocales
} from '../services/localizationService';

import {gameModes} from '../constants';
import {load as loadProfile} from '../actions/profileActions';

class LocalizedRoute extends Component {

  constructor(props) {
    super();

    props.initializeLocalization();

    this.state = {
      currentLocale: null
    };
  }

  componentDidMount() {
    console.log('LocalizedRoute mounted, locale from URL:', this.props.match.params.locale);
    this.props.loadProfile('unknown');
    this.setLocale(this.props.match.params.locale);
  }

  componentDidUpdate(prevProps) {
    const prevLocale = prevProps.match.params.locale;
    const nextLocale = this.props.match.params.locale;
    if (prevLocale !== nextLocale) {
      this.setLocale(nextLocale);
    }
  }

  setLocale(locale) {
    console.log('setLocale called', {locale, currentLocale: this.state.currentLocale, isSupported: isLocaleSupported(locale)});
    if (locale && locale !== this.state.currentLocale && isLocaleSupported(locale)) {
      console.log('Loading translations for:', locale);
      this.props.setLocale(locale)
        .then(() => {
          console.log('Translations loaded successfully for:', locale);
          this.setState(() => ({currentLocale: locale}));
        })
        .catch(err => {
          console.error('Error loading translations:', err);
        });
    } else {
      console.log('Skipping translation load - condition not met');
    }
  }

  render() {
    const {match, profile} = this.props,
      locale = match.params.locale;

    if (!locale || !isLocaleSupported(locale)) {
      return <Redirect to={`/${getBestMatchingLocale()}`}/>;
    }

    if (!this.state.currentLocale) {
      return <Loader/>;
    }

    return (
      <div className="h-100">
        <Route path={`${match.url}/:area/:mode`}
          render={({match, ...args}) => {
            const areaId = match.params.area,
              mode = match.params.mode;

            console.log('LocalizedRoute game route check', {
              areaId,
              mode,
              isAreaIdValid: isAreaIdValid(areaId),
              gameModesDefined: gameModes[mode] !== undefined,
              gameModes: gameModes
            });

            return isAreaIdValid(areaId) && gameModes[mode] !== undefined
              ? (<GameScreen area={areaId} profile={profile} gameMode={mode} {...args}/>)
              : (<Redirect to={match.url}/>);
          }}/>
        <Route exact
          path={match.url}
          render={() => <StartScreen selectedLocale={locale}/>}/>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  loadProfile: id => dispatch(loadProfile(id)),
  initializeLocalization: () => {
    dispatch(initialize(supportedGameLocales));
  },
  setLocale: locale =>
    getTranslation(locale)
      .then(translations => {
        dispatch(addTranslationForLanguage(translations, locale));
        dispatch(setActiveLanguage(locale));
      })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalizedRoute);
