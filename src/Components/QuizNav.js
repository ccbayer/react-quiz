import React, { Component } from 'react';
import ReactDom from 'react-dom';
import update from 'react-addons-update';
import { Button, Col, Grid, Row } from 'react-bootstrap';

/* Quiz Nav: Used for quiz groups only */
const QuizNav = React.createClass({
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

export default QuizNav;
