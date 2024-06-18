"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Interview = ({ params }) => {
  const [interviewData, setInterviewData] = useState(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

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
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  

  return (
    <div className="my-6 flex">
      <h2 className="font-bold text-2xl">Toh chaliye shuru karte hai!!</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="flex flex-col my-5 gap-5">
            <div className="p-5 rounded-lg border" >
          <h2 className="text-lg">
            <strong>Job Role/Job Position:</strong>
            {interviewData[0].jobPosition}
          </h2>
          <h2 className="text-lg">
            <strong>Job Description/Tech Stack:</strong>
            {interviewData[0].jobDesc}
          </h2>
          <h2 className="text-lg">
            <strong>Yoe:</strong>
            {interviewData[0].jobExperience}
          </h2>

            </div>
          <div className="p-5 border rounded-lg border-red bg-yellow-100" >
            <h2 className="flex gap-2 items-center" >Information</h2>
            <h2>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident voluptas quos
                necessitatibus harum quaerat dicta accusamus explicabo autem atque laboriosam odio
                aut sapiente quidem qui, laborum expedita assumenda voluptate incidunt!
            </h2>
          </div>
        </div>

        <button
          onClick={() => setWebCamEnabled((prev) => !prev)}
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          {webCamEnabled ? "Disable" : "Enable"} Webcam
        </button>
        {webCamEnabled && (
          <div className="mt-4">
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              style={{
                height: 300,
                width: 300,
              }}
            />
            <p>Camera</p>
          </div>
        )}
      </div>
      <div className="flex justify-end items-end">
        <Link href={'/dashboard/interview/'+params.interviewId+"/start"} >
            <Button>Start Interview</Button>
        </Link>
      </div>

    </div>
  );
};

export default Interview;
