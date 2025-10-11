import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect, Route, Switch} from 'react-router-dom';
import {addTranslationForLanguage, initialize, setActiveLanguage} from 'react-localize-redux';

import StartScreen from './StartScreen';
import GameScreen from './GameScreen';
import Loader from '../components/common/Loader';

import {isAreaIdValid} from '../services/countriesService';
import {
  getBestMatchingLocale,
  getTranslation,
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
    this.props.loadProfile('unknown');
    const locale = getBestMatchingLocale();
    this.props.setLocale(locale)
      .then(() => {
        this.setState(() => ({currentLocale: locale}));
      })
      .catch(err => {
        console.error('Error loading translations:', err);
      });
  }

  render() {
    const {profile} = this.props;

    if (!this.state.currentLocale) {
      return <Loader/>;
    }

    return (
      <div className="h-100">
        <Switch>
          <Route exact path="/"
            render={() => <StartScreen selectedLocale={this.state.currentLocale}/>}/>
          <Route path="/:area/:mode"
            render={({match, ...args}) => {
              const areaId = match.params.area,
                mode = match.params.mode;

              return isAreaIdValid(areaId) && gameModes[mode] !== undefined
                ? (<GameScreen area={areaId} profile={profile} gameMode={mode} {...args}/>)
                : (<Redirect to="/"/>);
            }}/>
        </Switch>
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
