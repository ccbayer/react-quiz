import React, { Component } from 'react';
import ReactDom from 'react-dom';
import update from 'react-addons-update';
import { Button, Col, Grid, Row } from 'react-bootstrap';

// custom components
import AnswerList from './Answers/AnswerList';
import { Answer, AnswerImage } from './Answers/Answer';


// helpers
import { findPos, arrOfLetters, wrongText } from '../helpers';


/* Quiz Interface:
The actual question / answer interface
*/


const QuestionGraphic = React.createClass({
  render: function() {
    if(this.props.imgSrc) {
      return (
        <div className="question-graphic-wrapper">
          <img src={this.props.imgSrc}/>
        </div>
      )
    } else {
      return null;
    }
  }
});


const QuizInterface = React.createClass({
  getInitialState: function() {
    var initExplanation = this.props.isQuizGroup ? '' : this.props.description;
    return {
      isAnswered: false,
      explanation: initExplanation,
      note: '',
      correctAnswerClass: '',
      answerImage: false
    }
  },
  shouldComponentUpdate(nextProps, nextState) {
    // quiz has been unloaded; reset state
    if(!nextProps.quiz) {
      var initExplanation = this.props.isQuizGroup ? '' : this.props.description;
      this.setState({
        isAnswered: false,
        explanation: initExplanation,
        note: '',
        correctAnswerClass: '',
        answerImage: false
      });
    }
    return true;
  },
  renderAnswer: function(key) {
    var quiz = this.props.quiz;
    var answer = quiz.quizInfo.Questions[quiz.currentQuestion].Answers[key];
    // is this the "correct" answer
    var correctAnswerClass = answer.IsCorrect ? this.state.correctAnswerClass : '';
    var answerImage = this.state.answerImage;
    var letter = arrOfLetters[key];
    var reference = 'Answer-' + key;
    return <Answer ref={reference} key={key} index={key} answerDetails={answer} handleUpdateScore={this.props.handleUpdateScore} markAnswered={this.markAnswered} isAnswered={this.state.isAnswered} correctCssClass={correctAnswerClass} letter={letter} IsTryAgain={this.props.quiz.quizInfo.TryAgain} answerImage={answerImage}/>
  },
  markAnswered: function(isCorrect, explanation, answerImage) {
    var correctAnswerClass = 'correct'
    var note = 'That\'s correct!';
    if(isCorrect) {
      // updates score
      this.props.handleUpdateScore();
    } else {
      // mark the correct answer so the user knows, but only if we allow it
      if(!this.props.quiz.quizInfo.TryAgain) {
        correctAnswerClass = 'actual-correct';
      } else {
        correctAnswerClass = 'incorrect-txt-only';
      }
      // get a random wrong text to display
      note = wrongText[Math.floor(Math.random()*wrongText.length)];
      if(this.props.quiz.quizInfo.TryAgain) {
        note = note + ' Try again.';
      }
    }
    // displays explanation, enables next button, hides preview, marks correct answer
    this.setState({
      'isAnswered': true,
      'explanation': explanation,
      'note': note,
      'correctAnswerClass': correctAnswerClass,
      'answerImage': answerImage
    })
    this.props.handleTogglePreview(false);
  },
  componentWillReceiveProps : function(nextProps) {
    // reset css class if we are loading new answers
  },
  handleNextClick: function() {
    this.props.handleNextClick();
    // disable "next" button for the next question
    this.setState({
      'explanation': '',
      'correctAnswerClass': '',
      'note': '',
      'isAnswered': false,
      'answerImage': false
    });
  },
  handleReplayQuizClick: function() {
    var initExplanation = this.props.isQuizGroup ? '' : this.props.description;
    this.setState({
      'isAnswered': false,
      'explanation': initExplanation,
      'note': '',
      'correctAnswerClass': ''
    });
    this.props.handleTogglePreview(true);

    this.props.handleReplayQuizClick();
  },
  getScorePercentage: function() {
    return this.props.quiz.score/this.props.quiz.maxQuestions;
  },
  showScore: function() {
    var percentage = this.getScorePercentage();
    var ranking = 'pretty good!';
    var trophyClass = 'trophy-icon';
    if(percentage === 0) {
      trophyClass = trophyClass + ' trophy-0';
      ranking = 'Oops!';
    } else if(percentage > .01 && percentage < .34) {
      trophyClass = trophyClass + ' trophy-1';
      ranking = 'Good try!';
    } else if(percentage > .33 && percentage < .66) {
      trophyClass = trophyClass + ' trophy-2';
      ranking = 'Pretty good!';
    } else if(percentage > .66 && percentage < 1) {
      trophyClass = trophyClass + ' trophy-3';
      ranking = 'Great job!';
    } else if(percentage === 1) {
      trophyClass = trophyClass + ' trophy-4';
      ranking = 'Awesome!';
    }
    return (
      <div className="final-score">
        <div className={trophyClass}><span className="sr-only">{percentage}</span></div>
        <h2>{ranking}</h2>
        <p>You got {this.props.quiz.score} out of {this.props.quiz.maxQuestions}.</p>
      </div>
    )
  },
  renderProgressIndicator(key) {
    var key = parseInt(key, 10);
    var isActive = key < this.props.quiz.currentQuestion ? 'answered ' : '';
    var isCurrent = key == this.props.quiz.currentQuestion ? 'current' : '';
    var cssClass = isActive + isCurrent;
    var message = '';
    var index = key + 1;
    if(key < this.props.quiz.currentQuestion) {
      message = ' has been answered';
    } else if (key > this.props.quiz.currentQuestion){
      message = ' has not been answered';
    } else {
      message = ' is the current question';
    }
    return (
      <li key={key} className={cssClass}><span className="sr-only">Question {index} {message}</span></li>
    )
  },
  socialShare: function(network) {
    return;
    /*
    var sharing = this.props.quiz.quizInfo.EndScreen.SharingMessages[network];
      try {
        if(network === 'Twitter') {
            SocialShare.share('twitter', {
              url: this.props.sharingUrl,
              text: sharing.Message,
              hashtags: sharing.Hashtags,
            });
        } else {
            SocialShare.share('facebook', {
              u: this.props.sharingUrl,
              text: sharing.Message,
              hashtags: sharing.Hashtags,
            });
        }
    } catch(e) {
      console.log('No SocialShare library available!');
      console.log('Error: ' + e);
    }
    */
  },
  getEndScreenDescription: function() {
    var weightedMessages = this.props.quiz.quizInfo.EndScreen.WeightedMessages;
    if(!weightedMessages) {
        return this.props.quiz.quizInfo.EndScreen.Message;
    } else {
      var endScreenDescriptions = this.props.quiz.quizInfo.EndScreen.Messages;
      var percentage = this.getScorePercentage();
      if(percentage === 0) {
        return endScreenDescriptions[0];
      } else if(percentage > .01 && percentage < .34) {
        return endScreenDescriptions[1];
      } else if(percentage > .33 && percentage < .66) {
        return endScreenDescriptions[2];
      } else if(percentage > .66 && percentage < 1) {
        return endScreenDescriptions[3];
      } else if(percentage === 1) {
        return endScreenDescriptions[4];
      }
    }
  },
  render: function() {
    var quiz = this.props.quiz;
    // add one since currentquestion is zero-indexed from its array
    var questionCount = quiz.currentQuestion + 1;
    // is this part of a group?
    if(this.props.showQuestion && this.props.quiz) {
      return (
        <div>
          {this.props.showPreview ? '' :
              <div className="answer-explanation">
                <AnswerImage imgSrc={this.state.answerImage}></AnswerImage>
                <h2>{quiz.quizInfo.Title}</h2>
                <h3 className={this.state.correctAnswerClass}>{this.state.note}</h3>
                {this.state.explanation}
              </div>
          }
          <div className="quiz-inner-wrapper">
            <div className="score-wrapper">
              <div className="score-inner-wrapper">
                {quiz.quizInfo.Type === 'Scored' ?
                <div className="your-score"><p>Your Score: {quiz.score}</p></div>
                : null }
                <h3>
                  {questionCount} / {quiz.maxQuestions}
                </h3>
                <ul className="progress-indicator">
                  {Object.keys(quiz.quizInfo.Questions).map(this.renderProgressIndicator)}
                </ul>
                <h2 className="quiz-title-mobile">{quiz.quizInfo.Title}</h2>
              </div>
            </div>
            <div className="question-text">
              <p>{quiz.quizInfo.Questions[quiz.currentQuestion].QuestionText}</p>
            </div>
            <QuestionGraphic imgSrc={quiz.quizInfo.Questions[quiz.currentQuestion].QuestionGraphic}/>
            <AnswerList answerList={quiz.quizInfo.Questions[quiz.currentQuestion].Answers} shuffleAnswers={quiz.quizInfo.Questions[quiz.currentQuestion].Shuffle} renderAnswer={this.renderAnswer} isAnswered={this.state.isAnswered} IsTryAgain={quiz.quizInfo.TryAgain}/>
            <button className="btn btn-next" disabled={!this.state.isAnswered} onClick={this.handleNextClick}>Next</button>
          </div>
          </div>
      )
    } else if(this.props.quiz) {
      return (
        <div className="quiz-done-outer-wrapper">
          <div className="quiz-done-inner-wrapper">
          <h2>{quiz.quizInfo.Title}</h2>
          {quiz.quizInfo.Type === 'Scored' ?
          this.showScore()
          :
          <div className="icon">
            <img src={quiz.quizInfo.EndScreen.Image}/>
          </div>
         }
          <p>{this.getEndScreenDescription()}</p>
          {quiz.quizInfo.Replayable ?
          <button className="btn" onClick={this.handleReplayQuizClick}>play again</button>
          : null }
            {quiz.quizInfo.EndScreen.Sharing ?
              <div className="sharing">
                <p>{quiz.quizInfo.EndScreen.SharingLabel}</p>
                <a href="javascript:void(0);" data-share-u="sharing/link-engineering.html" className="share share-facebook social-share" target="_blank" role="button" aria-label="Share your score on Facebook" onClick={() => this.socialShare('Facebook')}>
                  <span>
                    <span className="sr-only">Share on Facebook!</span>
                  </span>
                </a>
                <a href="javascript:void(0);" data-share-url="sharing/link-engineering.html" className="share share-twitter social-share" target="_blank" role="button" title="Share on Twitter" onClick={() => this.socialShare('Twitter')}>
                  <span>
                    <span className="sr-only">Share on Twitter!</span>
                  </span>
                </a>
              </div>
              :
              null
            }
        </div>
      </div>
      )
    } else {
      return (<div/>)
    }
  }
});

export default QuizInterface;
