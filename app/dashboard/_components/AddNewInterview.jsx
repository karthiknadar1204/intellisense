"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {chatSession} from "@/utils/GeminiAiModal"
import {db} from "@/utils/db";
import {MockInterview} from "@/utils/schema";
import { v4 as uuidv4 } from 'uuid';
import {useUser} from "@clerk/nextjs";
import moment from 'moment';

const AddNewInterview = () => {
    const {user}=useUser()

  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState(false);
  const [jobDesc, setJobDesc] = useState(false);
  const [jobExperience, setJobExperience] = useState(false);
  const [Loading,SetLoading]=useState(false);
  const [jsonResponse,setJsonResponse]=useState([]);

  const onSubmit =async (e) => {
    SetLoading(true);
    e.preventDefault();
    console.log(jobPosition, jobDesc, jobExperience);
    
    const InputPrompt = `Job position: ${jobPosition}, job description: ${jobDesc}, years of experience: ${jobExperience}. From the above details, generate 5 interview questions for the role in JSON`;
    const result=await chatSession.sendMessage(InputPrompt);
    console.log(result.response.text());
    const MockJsonResp=(result.response.text()).replace('```json','').replace('```','')
    console.log(JSON.parse(MockJsonResp));
    setJsonResponse(MockJsonResp);

    if(MockJsonResp){
        const resp=await db.insert(MockInterview).values({
            mockId:uuidv4(),
            jobPosition:jobPosition,
            jobDesc:jobDesc,
            jobExperience:jobExperience,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            createdAt:moment().format('DD-MM=yyyy'),
            jsonMockResp:MockJsonResp
        }).returning({
            mockId:MockInterview.mockId
        });
        console.log("Inserted id is ",resp);
        if(resp){
            setOpenDialog(false);
        }
    }
    else{
        console.log("error hai bhidu")        
    }
SetLoading(false);
  };
  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+Add new</h2>
      </div>
      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about the job you want to interview for?
            </DialogTitle>
            <DialogDescription>
              <form action="" onSubmit={onSubmit}>
                <div>
                  <h2>
                    Add details about your job position/role,job description and
                    years of experience
                  </h2>

                  <div className="mt-7 my-3">
                    <label htmlFor="">Job Role/Job Position</label>
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      required
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>

                  <div className="mt-7 my-3">
                    <label htmlFor="">
                      Job Description/Tech Stack(In Short)
                    </label>
                    <Textarea
                      placeholder="Ex. React,Angular,Nodejs"
                      required
                      onChange={(event) => setJobDesc(event.target.value)}
                    />
                  </div>

                  <div className="mt-7 my-3">
                    <label htmlFor="">Years of Experience</label>
                    <Input
                      placeholder="5"
                      type="number"
                      max="50"
                      required
                      onChange={(event) => setJobExperience(event.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-5 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setOpenDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={Loading}>
                    {Loading ? "Creating..." : "Create Interview"}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
