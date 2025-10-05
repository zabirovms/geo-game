import React, {Component, Suspense} from 'react';
import {connect} from 'react-redux';
import { withTranslation } from 'react-i18next';

import * as gameActions from '../actions/gameActions';
import {hideHelp, showHelp} from '../actions/profileActions';

import GameHeader from '../components/game/header/GameHeader';
import QuestionList from '../components/question-list/QuestionList';
import ScoresTable from '../components/game/ScoresTable';
import Loader from '../components/common/Loader';
import GettingStartedModal from '../components/getting-started-dialog/GettingStartedModal';

import GameMap from './GameMap';
import Quiz from '../components/quiz/Quiz';
import '../components/quiz/_quiz.css';

import {colors, gameConfig, gameModes, gameStatus} from '../constants';

class GameScreen extends Component {

  componentDidMount() {
    const {area, gameMode, loadGame, i18n} = this.props;
    loadGame(i18n.language, area, gameMode, gameConfig.rounds);
  }

  componentWillUnmount() {
    this.stopGame();
  }

  componentDidUpdate(prevProps) {
    if (this.props.status === gameStatus.stopped && !this.props.profile.showHelp && this.isGameReady()) {
      // start the game automatically if the user deactivated the help dialog
      this.props.startGame();
    }
  }

  render() {
    const {
      t, i18n,
      status, questions, answers, mode,
      restartGame,
      duration, timeout
    } = this.props;
    const redirectToHomeScreen = () => {
      this.stopGame();
      this.props.history.push(`/${i18n.language}`);
    };

    // TODO add error handling
    if (!this.isGameReady()) {
      return <Loader/>;
    }

    const question = questions[answers.length] || {};
    const questionToDisplay = mode === gameModes.quiz ? question.question : question.display;
    const translations = {
      close: t('actions.close'),
      restart: t('actions.restart')
    };

    return (
      <Suspense fallback={<Loader/>}>
        <div className="container-fluid h-100">
          {this.getGettingStartedModal()}

          <div className="row h-100 no-gutters">

            <aside className="col-md-2 h-100 pt-3 pb-3 pr-3 d-none d-md-block">
              <div className="gg-aside-content h-100">
                <div className="gg-aside-header mb-2">
                  <ScoresTable/>
                </div>
                {mode !== gameModes.quiz && (
                  <div className="gg-aside-body">
                    <QuestionList questions={questions}
                      answers={answers}
                      isImg={mode === gameModes.flag}/>
                  </div>
                )}
              </div>
            </aside>

            <div className="col-md-10 h-100 pt-3 pb-2">
              <header className="gg-main-header mb-2 bg-light">
                <GameHeader status={status}
                  question={questionToDisplay}
                  timerColor={timeout < duration * 0.25 ? colors.redError : colors.greenOk}
                  animateTimer={timeout <= 3 || timeout === duration}
                  flagMode={mode === gameModes.flag}
                  restartGame={restartGame}
                  translations={translations}
                  returnHomeScreen={redirectToHomeScreen}/>
              </header>

              <div className="gg-main-body pb-2">
                {mode === gameModes.quiz ? (
                  <Quiz question={question} onAnswer={this.props.answerCurrentQuestion}/>
                ) : (
                  <GameMap/>
                )}
              </div>

              <footer className="gg-main-footer d-md-none">
                <ScoresTable/>
              </footer>
            </div>

          </div>
        </div>
      </Suspense>
    );
  }

  isGameReady() {
    const props = this.props;
    return !props.mapLoading && !props.profile.loading && props.countriesData !== undefined;
  }

  stopGame() {
    this.props.stopGame();

    if (this.props.profile.persisted.config.showHelpOnGameStart) {
      this.props.showHelp();
    }
  }

  getGettingStartedModal() {
    const {t, profile} = this.props,
      listLen = parseInt(t('gettingStarted.list.length'), 10),
      content = {
        title: t('gettingStarted.title'),
        intro: t('gettingStarted.intro'),
        info: t('gettingStarted.info'),
        infoList: [],
        play: t('actions.play'),
        doNotShowAgain: t('gettingStarted.doNotShowAgain')
      };

    // IMPR build localization lib instead of this hack
    for (let i = 0; i < listLen; i++) {
      const text = t(`gettingStarted.list.items.${i}`).split(':');

      content.infoList.push({
        where: text[0],
        text: text[1],
        icon: text[2]
      });
    }

    return (<GettingStartedModal show={profile.showHelp}
      content={content}
      onPlayClick={this.onPlayClick.bind(this)}/>);
  }

  onPlayClick(showHelpOnGameStart) {
    this.props.hideHelp(showHelpOnGameStart);
    this.props.startGame();
  }
}

const mapStateToProps = state => {
  const
    {status, questions, answers, mode} = state.game,
    {countriesData, loading, error} = state.map,
    {duration, timeout} = state.timer;

  return {
    status, questions, answers, mode,
    countriesData,
    mapLoading: loading, error,
    duration, timeout
  };
};

const mapDispatchToProps = dispatch => ({
  loadGame: (locale, areaId, gameMode, questionCount, timeout) => {
    dispatch(gameActions.loadGame(locale, areaId, gameMode, questionCount, timeout));
  },
  startGame: () => {
    dispatch(gameActions.startGame(gameConfig.timeout));
  },
  restartGame: () => {
    dispatch(gameActions.restartGame());
  },
  stopGame: () => {
    dispatch(gameActions.stopGame());
  },
  answerCurrentQuestion: answer => {
    dispatch(gameActions.answerCurrentQuestion(answer));
  },
  showHelp: () => {
    dispatch(showHelp());
  },
  hideHelp: showHelpOnGameStart => {
    dispatch(hideHelp(showHelpOnGameStart));
  }
});

export default withTranslation()(connect(
  mapStateToProps,
  mapDispatchToProps
)(GameScreen));
