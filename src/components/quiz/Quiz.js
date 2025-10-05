import React from 'react';

const Quiz = ({ question, onAnswer }) => {
  if (!question) {
    return null;
  }

  const { question: questionText, correctAnswer, incorrectAnswers } = question;
  const answers = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5);

  return (
    <div className="quiz-container">
      <h2>{questionText}</h2>
      <div className="answers">
        {answers.map((answer, index) => (
          <button key={index} onClick={() => onAnswer(answer)}>
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;