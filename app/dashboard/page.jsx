import React from 'react'
import AddNewInterview from "./_components/AddNewInterview.jsx"
import InterviewList from "./_components/InterviewList.jsx"

const DashBoard = () => {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl' >
        DashBoard
      </h2>
      <h2 className='text-gray-500' >Create Your own AI powered Interview with IntelliSense</h2>

      <div className='grid grid-cols-1 md:grid-cols-3'>
        <AddNewInterview/>
      </div>
      <InterviewList/>
    </div>
  )
}

export default DashBoard