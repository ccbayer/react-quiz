import React, { Component } from 'react';
import ReactDom from 'react-dom';
import update from 'react-addons-update';
import { Button, Col, Grid, Row } from 'react-bootstrap';


/* Quiz Preview:
Shown before the quiz starts in quiz groups
*/
const QuizPreview = React.createClass({
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

export default QuizPreview;
