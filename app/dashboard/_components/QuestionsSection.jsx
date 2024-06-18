import React from 'react';
import { Volume2 } from 'lucide-react';


const QuestionsSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
  const textToSpeech=(text)=>{
    if('speechSynthesis' in window){
      const speech=new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech)
    }
    else{
      alert('sorry, your browser does not support text to speech')
    }

  }
  return mockInterviewQuestion && (
    <div className='p-5 border rounded-lg my-10'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {mockInterviewQuestion && mockInterviewQuestion.map((question, index) => (
          <h2
            className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${
              activeQuestionIndex === index ? 'bg-black text-white' : ''
            }`}
            key={index}
          >
            Question #{index + 1}
          </h2>
        ))}
      </div>
        <h2 className='my-5 text-md md:text-lg'>{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>
        <Volume2 className='cursor-pointer' onClick={()=>textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}/>
        <div className='border rounded-lg p-5 bg-blue-100' >
            <h2 className='flex gap-2 items-center ' >Note</h2>
            <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio, sapiente tenetur eaque et ratione eligendi
                 consectetur modi officia nobis. Libero laborum cum tempora at ipsum alias. Facilis quisquam non fugit.</h2>
        </div>
    </div>
  );
};

export default QuestionsSection;
