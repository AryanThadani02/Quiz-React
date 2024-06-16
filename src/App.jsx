import React, { useState, useEffect } from "react";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "https://opentdb.com/api.php?amount=10&type=multiple"
        );
        const data = await response.json();
        const formattedQuestions = data.results.map((question) => {
          const incorrectAnswers = question.incorrect_answers.map((answer) => ({
            text: answer,
            isCorrect: false,
          }));
          const correctAnswer = {
            text: question.correct_answer,
            isCorrect: true,
          };
          return {
            question: question.question,
            answers: [...incorrectAnswers, correctAnswer].sort(
              () => Math.random() - 0.5
            ),
          };
        });
        setQuestions(formattedQuestions);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      handleSkip();
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleAnswerButtonClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(5);
    } else {
      setShowScore(true);
    }
  };

  const handleSkip = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(5);
    } else {
      setShowScore(true);
    }
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      {showScore ? (
        <div className="score-section">
          You scored {score} out of {questions.length}
        </div>
      ) : (
        <>
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className="question-text">
              {questions[currentQuestion].question}
            </div>
          </div>
          <div className="answer-section">
            {questions[currentQuestion].answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => handleAnswerButtonClick(answer.isCorrect)}
              >
                {answer.text}
              </button>
            ))}
          </div>
          <div className="skip-section">
            <button onClick={handleSkip}>Skip</button>
          </div>
          <div className="timer-section">Time left: {timeLeft}</div>
        </>
      )}
    </div>
  );
};

export default App;
