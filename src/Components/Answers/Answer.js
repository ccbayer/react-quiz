import React, { Component } from 'react';
import ReactDom from 'react-dom';
import update from 'react-addons-update';
import { Button, Col, Grid, Row } from 'react-bootstrap';


/* Answer:
Renders list of selectable answers
*/


const AnswerImage =  React.createClass({
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

const Answer = React.createClass({
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
    var btnClass = this.state.cssClass === 'correct' ? 'success' : 'warning';
    return (
      <li className={cssClass}>
        <Button bsStyle={this.props.btnClass} onClick={this.handleAnswerClick}><span>{this.props.letter}.</span> {this.props.answerDetails.AnswerText}</Button>
      </li>
    )
  }
});

export { Answer, AnswerImage };
