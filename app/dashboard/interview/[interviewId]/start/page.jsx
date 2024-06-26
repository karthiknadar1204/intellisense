"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import QuestionsSection from "../../../../dashboard/_components/QuestionsSection.jsx";
import RecordAnswerSection from "../../../../dashboard/_components/RecordAnswerSection.jsx";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const StartInterview = ({ params }) => {
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState();
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    console.log(params.interviewId);
    GetInterViewDetails();
  }, []);

  const GetInterViewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params.interviewId));
      console.log(result);
      setInterviewData(result);

      const mockresponse = JSON.parse(result[0].jsonMockResp);
      setMockInterviewQuestion(mockresponse);
      console.log(mockresponse);
      setInterviewData(result[0]);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Question */}
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        {/* video/audio recording */}
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>
      <div className="flex justify-end gap-6" >
        { activeQuestionIndex>0 && <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1 )}>Previous Question</Button>}
        { activeQuestionIndex!=mockInterviewQuestion?.length-1 &&
        <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1 )} >Next Question</Button>
        }
        { activeQuestionIndex==mockInterviewQuestion?.length-1 && 
        <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'} >
          <Button>End Interview</Button>
        </Link>
        }

      </div>
    </div>
  );
};

export default StartInterview;
