import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface QuestionsObj {
    id: string;
    text: string;
    mediaId: string;
}

interface AnswersObj {
    id: string;
    isCorrect: boolean;
    knowledgeCheckBlockId: string;
    pos: number;
    text: string;
}

interface MediaObj {
    id: string;
    type: string;
    url: string;
}
const LearningBlock: any = () => {
  const [questions, setQuestions] = useState<QuestionsObj[] | []>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswersObj[] | []>([]);
  const [mediaURL, setMediaURL] = useState<string>('')
  const [loading, setLoading] = useState(true);
  const [questionsError, setQuestionsError]: any = useState(null);
  const [mediaError, setMediaError]: any = useState(null);
  const [answersError, setAnswersError] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
        await axios.get('http://localhost:5001/questions')
        .then((res) => {
            setQuestions(res.data);
            setLoading(false);
        }).catch((errrror) => {
            console.log('errrrroorrrrrr', errrror)
            setQuestionsError(errrror);
            setLoading(false);
        });
    };
    const fetchAnswers = async () => {
        await axios.get(`http://localhost:5001/answers`)
        .then((res) => {
            setAnswers(res.data)
        })
        .catch((error) => {
            setAnswersError(error);
            setLoading(false);
        })
    };
    const fetchMedia = async () => {
        const mediaURL = questions?.find((q, index) => index === currentQuestion)?.mediaId
        await axios.get(`http://localhost:5001/media/${mediaURL}`)
            .then((res) => {
                const mediaBlock = res.data?.find((_: MediaObj, index: number) => index === 0)
                setMediaURL(mediaBlock.url);
            })
            .catch((error) => {
                setMediaError(error);
                setLoading(false);
            })
    };
    if (questions.length === 0) {
        fetchQuestions();
      }
    if (answers.length === 0) {
        fetchAnswers();
    }
    if (questions?.length != 0 && !mediaURL) {
        fetchMedia();
    }
  }, [questions, answers]);

  const SubmitButton = () => {
    // call /knowledge-check-blocks and display text
    return (
        <form>
            <button onClick={(e) => {e.preventDefault()}}>Submit Answer</button>
        </form>
    )
  };

  const renderMedia = () => {
    return (
        <img src={mediaURL} alt='Bruh, sorry. Couldnt find media, just pretend you see coffee and cookies'></img>
    )
  }

  const currentWholeQuestion: any = questions?.find((q, index) => index === currentQuestion);

  const clickedAnswer = (answer: AnswersObj) => {
    setSelectedAnswer(answer.pos);
}

  if (loading) return <div>Loading...</div>;
  if (questionsError) return <div>Error fetching questions:</div>;

  return (
    <div>
      <h1>Questions</h1>

        {currentWholeQuestion ? 
          <h3>{currentWholeQuestion.text}</h3>
         : null}

      <div>
        {mediaURL ? renderMedia() : <div>Media is loading... probably</div>}
      </div>
      <div>
        <ul>
            {answers ? answers.map((answer) => {
                if (selectedAnswer === answer.pos) {
                    return <li id={answer.id} className='selectedAnswer' onClick={() => clickedAnswer(answer)}>{answer.text}</li>
                }
                return (
                    <li id={answer.id} className='unselectedAnswer' onClick={() => clickedAnswer(answer)}>{answer.text}</li>
                )
            }) : null}
        </ul>
      </div>
      <div>
        <SubmitButton />
      </div>
    </div>
  );
};

export default LearningBlock;
