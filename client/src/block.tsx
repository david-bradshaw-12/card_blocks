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
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswersObj | null>(null);
//   const [submitSelected, setSubmitSelected] = useState<boolean>(false);
  const [knowledgeCheck, setKnowledgeCheck] = useState<string | null>('')

  useEffect(() => {
    const fetchQuestions = async () => {
        await axios.get('http://localhost:5001/questions')
        .then((res) => {
            setQuestions(res.data);
            setLoading(false);
        }).catch((errrror) => {
            console.log('errrrroorrrrrr', errrror)
            setFetchError(true);
            setLoading(false);
        });
    };
    const fetchAnswers = async () => {
        await axios.get(`http://localhost:5001/answers`)
        .then((res) => {
            setAnswers(res.data)
        })
        .catch((error) => {
            setFetchError(error);
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
                setFetchError(error);
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
    const submitClicked = async (event: any) => {
        event.preventDefault(); 
        const isAnswerCorrect = selectedAnswer?.isCorrect
        // send selectedAnswer through API call, back-end match knowledge-check-block, sends back appropriate response.
        // check that question IDs match ///  isCorrect
        await axios.get('http://localhost:5001/knowledge-check-blocks')
            .then((res) =>{
                if (isAnswerCorrect) {
                    const displayText = res.data[0].feedback
                    setKnowledgeCheck(displayText)
                } else {
                    setKnowledgeCheck('You got it wrong, bro!')
                }
                // alert(displayText)
            })
            .catch((err) => {
                console.error(err);
                setFetchError(true);
            })
    }
    return (
        <div>
            <button className='submitButton' onClick={(e) => {submitClicked(e)}}>Submit</button>
        </div>
    )
  };

  const KnowledgeCheckSection = () => {
    const retakeQuestion = () => {
        setKnowledgeCheck('');
        setSelectedAnswer(null);
    };
    if (knowledgeCheck) {

    return (
        <div className='bottomAnswer'>
            <div>{knowledgeCheck} </div>
            <button onClick={retakeQuestion}>
            <i className="fa fa-refresh" aria-hidden="true"></i>
            retake
            </button>
        </div>
    )
    } else {
        return null
    }
  };

  const renderMedia = () => {
    return (
        <img src={mediaURL} alt='Bruh, sorry. Couldnt find media, just pretend you see coffee and cookies'></img>
    )
  }

  const currentWholeQuestion: any = questions?.find((q, index) => index === currentQuestion);

  const clickedAnswer = (answer: AnswersObj) => {
    setSelectedAnswer(answer);
}

  if (loading) return <div>Loading...</div>;
  if (fetchError) return <div>Error fetching questions:</div>;


  return (
    <div>
        {currentWholeQuestion ? 
          <div className='topQuestion'>{currentWholeQuestion.text}</div>
         : null}
      <div className='media'>
        {mediaURL ? renderMedia() : <div>Media is loading... (put spinner *here*) </div>}
      </div>
      <div>
            {answers ? answers.map((answer) => {
                if (selectedAnswer?.pos === answer.pos) {
                    return (
                        <div  aria-checked={true} aria-disabled={false} className='selectedAnswer' id={answer.id} onClick={() => clickedAnswer(answer)}>
                            <input checked={true} type="radio" />
                            {answer.text}
                        </div>
                    )
                }
                return (
                    <div  aria-checked={false} aria-disabled={false} className='unSelectedAnswer' id={answer.id} onClick={() => clickedAnswer(answer)}>
                        <input checked={false} type="radio" />
                        {answer.text}
                    </div>
                )
            }) : null}
      </div>
    <SubmitButton />
    <div>
        <KnowledgeCheckSection />
    </div>
    </div>
  );
};

export default LearningBlock;
