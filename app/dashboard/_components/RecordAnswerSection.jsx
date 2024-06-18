"use client";

import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAiModal";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) => {
  const { user } = useUser();
  const [userAnswer, setUserAnswer] = useState("");
  const [Loading, SetLoading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    const newTranscript = results.map((result) => result.transcript).join(" ");
    setUserAnswer(newTranscript);
  }, [results]);

  useEffect(()=>{
    if(!isRecording && userAnswer.length>10){
      UpdateUserAnswer()
    }
  },[isRecording, userAnswer])

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    SetLoading(true);
    const feedbackPrompt =
      "Question:" +
      mockInterviewQuestion[activeQuestionIndex]?.question +
      ",User Answer:" +
      userAnswer +
      ",Depends on question and user answer for given interview question" +
      "Please give us rating for answer and feedback for area of improvement if any." +
      "In just 5-6 lines to improve it in JSON format with rating field and feedback field.";

    const result = await chatSession.sendMessage(feedbackPrompt);

    const mockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    console.log(mockJsonResp);
    const JsonFeedbackResp = JSON.parse(mockJsonResp);

    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: mockInterviewQuestion[activeQuestionIndex]?.question,
      correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
      userAns: userAnswer,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format("DD-MM=yyyy"),
    });

    if (resp) {
      toast("USer Answer recorded successfully!!");
      setUserAnswer("");
      setResults([])
      }
      setResults([]);
      SetLoading(false);
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        RecordAnswerSection
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
        disabled={Loading}
      >
        {isRecording ? (
          <h2 className="text-red-600 flex gap-2">
            <Mic /> Recording...
          </h2>
        ) : (
          "Record Answer"
        )}
      </Button>
    </div>
  );
};

export default RecordAnswerSection;
