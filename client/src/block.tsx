import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface QuestionsObj {
    id: string;
    text: string;
    mediaId: string;
}

const LearningBlock: any = () => {
  const [questions, setQuestions] = useState<QuestionsObj[] | null>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionsError, setQuestionsError]: any = useState(null);
  const [mediaError, setMediaError]: any = useState(null);
  const [answersError, setAnswersError]: any = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
        try {
          console.log('running useEffect and about to fetch questions HERE')
        const { data } = await axios.get('localhost:5001/questions');
        console.log('data: ', data)
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        setQuestionsError(err);
        setLoading(false);
      }
    };
    const fetchAnswers = async () => {
      try {
          const { data } = await axios.get(`localhost:5001/answers/`);
      } catch (err) {
        setAnswersError(err);
        setLoading(false);
      }
    };
    const fetchMedia = async () => {
        if (questions) {
            try {
                const { data } = await axios.get(`localhost:5001/media/${questions[currentQuestion].mediaId}`);
            } catch (err) {
                setMediaError(err);
                setLoading(false);
            }
        } 
      };

    fetchQuestions();
    fetchAnswers();
    fetchMedia();
  }, []);

  const SubmitButton = () => {
    // call /knowledge-check-blocks and display text
    return (
        <form>
            <button onSubmit={() => {}}>Submit Answer</button>
        </form>
    )
  }

  if (loading) return <div>Loading...</div>;
  if (questionsError) return <div>Error fetching questions:</div>;

  return (
    <div>
      <h1>Questions</h1>
      <ul>
        {questions ? questions.map((question) => (
          <li key={question.id}>{question.text}</li>
        )) : null}
      </ul>
      <div>
        <SubmitButton />
      </div>
    </div>
  );
};

export default LearningBlock;
