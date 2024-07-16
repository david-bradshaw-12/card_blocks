import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LearningBlock: any = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]: any = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get('/questions');
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching questions:</div>;

  return (
    <div>
      <h1>Questions</h1>
      <ul>
        {/* {questions.map((question) => (
          <li key={question.id}>{question.title}</li>
        ))} */}
      </ul>
    </div>
  );
};

export default LearningBlock;
