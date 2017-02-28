import React, { Component } from 'react';
import ReactDom from 'react-dom';
import update from 'react-addons-update';
import { Button, Col, Grid, Row } from 'react-bootstrap';

// custom component
import { Answer, AnswerImage } from './Answer';

// helpers
import { shuffleArray } from '../../helpers';

const AnswerList = React.createClass({
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

export default AnswerList;
