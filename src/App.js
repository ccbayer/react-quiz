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

// react quiz
var arrOfLetters = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(',');
var wrongText = [
  'Sorry, that\'s incorrect.',
  'Good try, but that\'s incorrect.',
  'Oops. Good try, though.',
  'That\'s not it.',
  'Nope. It\'s a different answer.'
];

// var bLazy = new Blazy();

// shuffle array
var shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

//Finds y value of given object
function findPos(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
    return [curtop];
    }
}

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

/* Quiz Nav: Used for quiz groups only */
var QuizNav = React.createClass({
  getInitialState: function() {
    const myNavId = 'quiz-group-nav-' + Math.floor((Math.random() * 1500) + 1);
    return {
      navRendered: false,
      navInitialized: false,
      navId: myNavId
    }
  },
  renderQuizNavItem: function(key){
    var quiz = this.props.quizList[key].Quiz;
    var count = key + 1;
    if(key == this.props.quizCount - 1) {
      // chStem.initializeQuizNav();
    }
    return (
        <quizNavItem key={key}>
          <li className={this.props.previewQuizKey == key ? 'selected' : ''} onClick={() => this.props.handleQuizNavClick(key)}>
              <span className="label">{quiz.Title}</span>
              {quiz.QuizIcon ?
                <div className="quiz-icon"><img src={quiz.QuizIcon} alt=""/></div>
              : null }
          </li>
        </quizNavItem>
      )
  },
 render: function() {
   var quizGroupNavClassName = this.props.quizStarted ? 'quiz-group-nav quiz-started' : 'quiz-group-nav';
   return (
    <div className="quiz-group-nav-wrapper">
      <div className="quiz-group-nav-control back opacity-0">
        <Button data-target={this.state.navId} data-dir="1">
          <span className="glyphicon glyphicon-chevron-left">
            <span className="sr-only">Back</span>
          </span>
        </Button>
      </div>
      <ul className={quizGroupNavClassName} id={this.state.navId} data-size={this.props.quizCount}>
        {Object.keys(this.props.quizList).map(this.renderQuizNavItem)}
      </ul>
      <div className="quiz-group-nav-control fwd">
        <Button data-target={this.state.navId} data-dir="-1">
          <span className="glyphicon glyphicon-chevron-right">
            <span className="sr-only">Back</span>
          </span>
        </Button>
      </div>
    </div>
  )
}
});
/* Quiz Preview:
Shown before the quiz starts in quiz groups
*/
var QuizPreview = React.createClass({
render: function() {
  var quiz = this.props.previewQuiz.Quiz;
  var showPreview = this.props.showPreview;
  if(showPreview) {
    var className = this.props.quizStarted ? 'quiz-preview-wrapper quiz-started' : 'quiz-preview-wrapper';
    var startCTA = quiz.CTALabel ? quiz.CTALabel : 'give it a try';
    return (
      <div className={className}>
        {this.props.showPreviewButton ?
        <div className="quiz-preview-image">
          <img src={quiz.QuizImage}/>
        </div>
        : null }
        <div className="quiz-preview">
          <h2>{quiz.Title}</h2>
          <p>{quiz.Description}</p>
          {this.props.showPreviewButton ?
            <button className="btn btn-medblue" onClick={() => this.props.handleLoadQuiz(this.props.previewQuizKey)}>{startCTA}</button>
            : null }
        </div>
      </div>
    )
    } else {
      return (
        <div/>
      )
    }
  }
});


/* Quiz Interface:
The actual question / answer interface
*/
var QuizInterface = React.createClass({
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
    var isActive = key < this.props.quiz.currentQuestion ? 'answered ' : '';
    var isCurrent = key == this.props.quiz.currentQuestion ? 'current' : '';
    var cssClass = isActive + isCurrent;
    var message = '';
    var index = key + 1;
    if(key < this.props.quiz.currentQuestion) {
      message = ' has been answered';
    } {
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
                <h4 className={this.state.correctAnswerClass}>{this.state.note}</h4>
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

var AnswerImage =  React.createClass({
  render: function() {
    if(this.props.imgSrc) {
      return (
        <div className="answer-image-wrapper">
          <img src={this.props.imgSrc}/>
        </div>
      )
    } else {
      return null;
    }
  }
});

var QuestionGraphic = React.createClass({
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

/* Answer List : Container for answers; shuffles answers around if configured for that question */
var AnswerList = React.createClass({
  getInitialState: function() {
    if(this.props.shuffleAnswers) {
      return {
        answers: shuffleArray(this.props.answerList)
      }
    } else {
      return {
        answers: this.props.answerList
      }
    }
  },
  shouldComponentUpdate: function(nextProps, nextState) {
    if(nextProps.isAnswered) {
      // don't update state with new answers but clear CSS
      if(this.props.IsTryAgain) {
          var answerRefs = this.refs;
          Object.keys(this.refs).forEach(function(key) {
            if(answerRefs[key].state.cssClass !== "") {
              answerRefs[key].clearCss();
            }
          });
        }
      return true;
    } else {
        var answers = nextProps.answerList;
        if(nextProps.shuffleAnswers) {
          answers = shuffleArray(answers);
        }
        // set state
        this.setState({'answers': answers});
        return true;
    }
  },
  render: function() {
    var questionOptionsClass = this.props.isAnswered ? 'answer-options is-answered' : 'answer-options';
    return (
      <ul className={questionOptionsClass}>
        {Object.keys(this.props.answerList).map(this.props.renderAnswer)}
      </ul>
    )
  }
});

/* Answer:
Renders list of selectable answers
*/
var Answer = React.createClass({
  getInitialState: function() {
    return {
      cssClass: ''
    }
  },
  clearCss: function() {
    this.setState({'cssClass': ''});
  },
  componentWillReceiveProps : function(nextProps) {
    // reset css class if we are loading new answers
    if(!nextProps.isAnswered) {
      this.clearCss();
    }
  },
  handleAnswer: function() {
    if(this.props.answerDetails.IsCorrect === true) {
      // update score
      this.props.markAnswered(true, this.props.answerDetails.Explanation, this.props.answerDetails.AnswerImage);
      // mark this one as correct
      this.setState({'cssClass': 'correct'});
    } else {
      // update score
      this.props.markAnswered(false, this.props.answerDetails.Explanation, this.props.answerDetails.AnswerImage);
      // mark this one as incorrect
      this.setState({'cssClass': 'incorrect'});
    }
  },
  handleAnswerClick: function() {
    // only allow one click if TryAgain is off
    if(!this.props.IsTryAgain) {
      if(!this.props.isAnswered) {
        this.handleAnswer();
      }
    } else {
      this.handleAnswer();
    }
  },
  render: function() {
    var cssTryAgain = this.props.IsTryAgain ? '' : ' not-try-again';
    var cssClass = this.props.correctCssClass + ' ' + this.state.cssClass + cssTryAgain;
    return (
      <li className={cssClass}>
        <button onClick={this.handleAnswerClick}><span>{this.props.letter}.</span> {this.props.answerDetails.AnswerText}</button>
      </li>
    )
  }
});

/* JQUERY to load quizzes */
var quizElements = document.getElementsByClassName('quiz-outer-wrapper');
/*
$('.quiz-outer-wrapper').each(function() {
  var data = $(this).data();
  var quizzes = data.quizzes ? data.quizzes.split(',') : '';
  var quizCount = data.isGroup ? quizzes.length : 1;
  var label = data.label ? data.label : data.isGroup ? 'Load Quizzes' : 'Load Quiz';
  var groupIntro = data.groupIntro ? data.groupIntro : false;
  React.render(<QuizApp quizPath={data.quiz} quizList={quizzes} label={label} isGroup={data.isGroup} groupIntro={groupIntro} quizCount={quizCount} sharingUrl={data.sharingUrl} revealBackground={data.revealBackground}/>, $(this)[0]);
});
*/
for(var i = 0; i < quizElements.length; i++) {
  var data = quizElements[i].dataset;
  var quizzes = data.quizzes ? data.quizzes.split(',') : '';
  var quizCount = data.isGroup ? quizzes.length : 1;
  var label = data.label ? data.label : data.isGroup ? 'Load Quizzes' : 'Load Quiz';
  var groupIntro = data.groupIntro ? data.groupIntro : false;
  ReactDom.render(<QuizApp quizPath={data.quiz} quizList={quizzes} label={label} isGroup={data.isGroup} groupIntro={groupIntro} quizCount={quizCount} sharingUrl={data.sharingUrl} revealBackground={data.revealBackground}/>, quizElements[i]);
}
export default QuizApp;
