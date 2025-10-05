import React, {Component, Suspense} from 'react';
import {connect} from 'react-redux';
import {Redirect, Route, withRouter} from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import StartScreen from './StartScreen';
import GameScreen from './GameScreen';
import Loader from '../components/common/Loader';

import {isAreaIdValid} from '../services/countriesService';
import {
  getBestMatchingLocale,
  isLocaleSupported
} from '../services/localizationService';

import {gameModes} from '../constants';
import {load as loadProfile} from '../actions/profileActions';

class LocalizedRoute extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentLocale: undefined
    };
  }

  componentDidMount() {
    this.props.loadProfile('unknown');
    this.setLocale(this.props.match.params.locale);
  }

  componentDidUpdate(prevProps) {
    const newLocale = this.props.match.params.locale;
    if (newLocale && newLocale !== prevProps.match.params.locale) {
      this.setLocale(newLocale);
    }
  }

  setLocale(locale) {
    if (locale && locale !== this.state.currentLocale && isLocaleSupported(locale)) {
      this.props.i18n.changeLanguage(locale)
        .then(() => {
          this.setState(() => ({currentLocale: locale}));
        });
    }
  }

  render() {
    const {match, profile} = this.props,
      locale = match.params.locale;

    if (!locale || !isLocaleSupported(locale)) {
      return <Redirect to={`/${getBestMatchingLocale()}`}/>;
    }

    if (this.state.currentLocale === undefined) {
      return <Loader/>;
    }

    return (
      <Suspense fallback={<Loader/>}>
        <div className="h-100">
          <Route path={`${match.url}/:area/:mode`}
            render={({match, ...args}) => {
              const areaId = match.params.area,
                mode = match.params.mode;

              return isAreaIdValid(areaId) && gameModes[mode] !== undefined
                ? (<GameScreen area={areaId} profile={profile} gameMode={mode} {...args}/>)
                : (<Redirect to={match.url}/>);
            }}/>
          <Route exact
            path={match.url}
            render={() => <StartScreen selectedLocale={locale}/>}/>
        </div>
      </Suspense>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  loadProfile: id => dispatch(loadProfile(id))
});

export default withRouter(withTranslation()(connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalizedRoute)));
