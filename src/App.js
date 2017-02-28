import React, { Component } from 'react';
import ReactDom from 'react-dom';
import update from 'react-addons-update';
import { Button, Col, Grid, Row } from 'react-bootstrap';
// import SocialShare from 'socialshare';
import logo from './logo.svg';
import './App.css';


// imports bootstrap
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

// custom components
import QuizNav from './Components/QuizNav';
import QuizPreview from './Components/QuizPreview';
import QuizInterface from './Components/QuizInterface';

// helpers
import { findPos } from 'helpers';

// react quiz

var QuizApp = React.createClass({
  getInitialState: function() {
    return {
      isOpen: false,
      quiz: false,
      quizList: [],
      previewQuizKey: 0,
      showPreviewStartButton: true,
      showPreview: true
    }
  },
  componentDidUpdate: function(prevProps, prevState) {
      var node = ReactDom.findDOMNode(this);
      // only scroll to quiz if it was previously closed
      if(!prevState.isOpen) {
        var pos = findPos(node);
        if(prevProps.isGroup) {
          // accomodate the quiz nav
            var nav = ReactDom.findDOMNode(this.refs['quiz-nav']);
            pos = pos - nav.scrollHeight;
        }
        window.scroll(0, pos);
      }
  },
  showEndScreen: function() {
    var showQuestion = update(this.state.quiz, {
      showQuestion: {
        $apply: function(score) {
          return false;
        }
      }
    });
    this.state.quiz = showQuestion;
    this.setState({'quiz': this.state.quiz});
  },
  nextQuestion: function() {
    var max = this.state.quiz.maxQuestions;
    if(this.state.quiz.currentQuestion + 1 < max) {
      var updatedQuestion = update(this.state.quiz, {
        currentQuestion: {
          $apply: function(question) {
            return question + 1;
          }
        }
      });
      this.state.quiz = updatedQuestion;
      this.setState({'quiz': this.state.quiz});
    } else {
      // show the end state
      this.showEndScreen();
    }
  },
  addToScore: function() {
    var updatedScore = update(this.state.quiz, {
      score: {
        $apply: function(score) {
          return score + 1;
        }
      }
    });
    this.state.quiz = updatedScore;
    this.setState({'quiz': this.state.quiz});
  },
  backgroundImage: function(show) {
    if(this.props.revealBackground) {
      // try and use b-lazy to load bg image
        var el = document.getElementById(this.props.revealBackground);
        if(el.classList.contains('b-loaded')) {
            // image is already loaded; simply toggle class
            if(show) {
              el.classList.remove('bg-hidden');
            } else {
              el.classList.add('bg-hidden');
            }
        } else {
          if(show) {
            // bLazy.load(el);
          } else {
            el.classList.add('bg-hidden');
          }
        }
    }
  },
  loadQuiz: function() {
    var url = './_quiz-data/' + this.props.quizPath + '.json';
    var quiz = [];
    var _this = this;
    // this.backgroundImage(true);
      var data = require(url);
      if(data) {
        _this.setState({
          isOpen: true,
          quiz: {
            quizInfo: data['Quiz'],
            score: 0,
            currentQuestion: 0,
            maxQuestions: data['Quiz'].Questions.length,
            showQuestion: true
          }
        });
      } else {
        console.log('Quiz data not found');
      }
  },
  loadQuizByKey: function(key) {
    if(key || key === 0) {
      var quiz = this.state.quizList[key];
      this.setState({
        quiz: {
          quizInfo: quiz['Quiz'],
          score: 0,
          currentQuestion: 0,
          maxQuestions: quiz['Quiz'].Questions.length,
          showQuestion: true
        },
        showPreviewStartButton: false
      });
    }
  },
  renderQuizPreview: function(quizId) {
    this.setState({
      previewQuizKey: quizId,     // set QuizID for preview
      quiz: false, // remove current quiz
      showPreviewStartButton: true, //enable the quiz preview start button
      showPreview: true
    });
  },
  togglePreview: function(show) {
      this.setState({
        showPreview: show,
      });
  },
  replayQuiz: function() {
    // reset quiz values to allow to replay
    var resetQuiz = update(this.state.quiz, {
      currentQuestion: {
        $apply: function() {
          return 0;
        }
      },
      showQuestion: {
        $apply: function() {
          return true;
        }
      },
      score: {
        $apply: function() {
          return 0;
        }
      }
    });
    this.state.quiz = resetQuiz;
    this.setState({'quiz': this.state.quiz});
  },
  addQuizzesToQuizList: function(groupIntro) {
    var quizArr = this.props.quizList;
    // var $groupIntro = groupIntro ? $(groupIntro) : false;
    var _this = this;
    if(quizArr.length > 0) {
      /*
      quizArr.forEach(function(item) {
        var quiz = item.trim();
        var url = '/_quiz-data/' + quiz + '.js';
        var quiz = [];
        $.ajax({
            url: url,
            dataType: 'json',
            statusCode: {
              404: function() {
                console.log('404: ' + url + ' not found');
              }
            }
          }).success(function(data) {
            // push this quiz into the state array
            quiz = update(_this.state.quizList, {$push: [data]});
            _this.setState({
              isOpen: true,
              quizList: quiz
            });
            // hide introduction
            if($groupIntro) {
              $groupIntro.prev('.quiz-group-intro').hide();
              $groupIntro.removeClass('hidden');
            }
          }).error(function(data) {
            console.log('Err:' + data);
          }).fail(function() {
            console.log('Quiz Not Found: ' + url);
          });
      });
      */
      console.log('hi');
    }
  },
  removeQuiz: function() {
    // reset state
    this.setState({
      isOpen: false,
      quiz: false,
      quizList: [],
      previewQuizKey: 0,
      showPreviewStartButton: true,
      showPreview: true
    });
    // remove bg
    this.backgroundImage(false);
    // show introduction
    /* var $groupIntro = $(this.props.groupIntro);
    if($groupIntro) {
      $groupIntro.prev('.quiz-group-intro').show();
      $groupIntro.addClass('hidden');
    }
    */
  },
  render: function() {
    // single quiz
    if(!this.props.isGroup) {
      // no quiz in state; prompt user to load it
      if(!this.state.quiz) {
        return (
          <Col xs={12} className="text-center">
            <Button bsStyle="success" onClick={this.loadQuiz}>{this.props.label}</Button>
          </Col>
        )
      // quiz has been loaded, render interface
      } else {
        return (
          <Grid>
            <Row>
            <div className="quiz-content-outer-wrapper clearfix">
              <QuizInterface quiz={this.state.quiz} handleUpdateScore={this.addToScore} handleNextClick={this.nextQuestion} showQuestion={this.state.quiz.showQuestion}  handleReplayQuizClick={this.replayQuiz} description={this.state.quiz.quizInfo.Description} handleTogglePreview={this.togglePreview} isQuizGroup={false} sharingUrl={this.props.sharingUrl}/>
            </div>
            <Col xs={12} className="text-center">
              <Button bsStyle="danger" onClick={this.removeQuiz}>exit game</Button>
            </Col>
          </Row>
        </Grid>
        )
      }
    } else {
      if(this.state.quizList.length < 1) {
        return (
          <Grid>
            <Row>
              <Col xs={12} className="text-center">
                <Button bsStyle="success" bsSize="small" onClick={() => this.addQuizzesToQuizList(this.props.groupIntro)}>
                  {this.props.label}
                </Button>
              </Col>
            </Row>
          </Grid>
        )
      } else {
        // quizzes are loaded into the state; render the quiz group nav and preview.
        var navId = 'quiz-group-nav-' + Math.floor((Math.random() * 1500) + 1);
        var quizStarted = this.state.quiz ? true : false;
        return (
          <Grid>
            <Row>
              <QuizNav ref='quiz-nav' quizList={this.state.quizList} previewQuizKey={this.state.previewQuizKey} handleQuizNavClick={this.renderQuizPreview} quizStarted={quizStarted} quizCount={this.props.quizCount}/>
              <Col className="quiz-content-outer-wrapper below-nav clearfix">
                <QuizPreview previewQuiz={this.state.quizList[this.state.previewQuizKey]} handleLoadQuiz={this.loadQuizByKey} previewQuizKey={this.state.previewQuizKey} showPreviewButton={this.state.showPreviewStartButton} showPreview={this.state.showPreview} quizStarted={quizStarted}/>
                <QuizInterface quiz={this.state.quiz} handleUpdateScore={this.addToScore} handleNextClick={this.nextQuestion} showQuestion={this.state.quiz.showQuestion} handleReplayQuizClick={this.replayQuiz} handleTogglePreview={this.togglePreview} showPreview={this.state.showPreview} isQuizGroup={true} sharingUrl={this.props.sharingUrl}/>
              </Col>
              <Col xs={12} className="text-center">
                <Button bsStyle="danger" onClick={this.removeQuiz}>exit game</Button>
              </Col>
            </Row>
          </Grid>
        )
      }
    }
  }
});


var quizElements = document.getElementsByClassName('quiz-outer-wrapper');

for(var i = 0; i < quizElements.length; i++) {
  var data = quizElements[i].dataset;
  var quizzes = data.quizzes ? data.quizzes.split(',') : '';
  var quizCount = data.isGroup ? quizzes.length : 1;
  var label = data.label ? data.label : data.isGroup ? 'Load Quizzes' : 'Load Quiz';
  var groupIntro = data.groupIntro ? data.groupIntro : false;
  ReactDom.render(<QuizApp quizPath={data.quiz} quizList={quizzes} label={label} isGroup={data.isGroup} groupIntro={groupIntro} quizCount={quizCount} sharingUrl={data.sharingUrl} revealBackground={data.revealBackground}/>, quizElements[i]);
}
export default QuizApp;
