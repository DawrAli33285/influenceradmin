import React,{useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ToastContainer,toast } from 'react-toastify';
import { BASE_URL } from '../base_url';
import axios from 'axios';
const Sendemail = () => {
  const [state,setState]=useState({
    to:'',
    subject:'',
    description:''
  })
  const location=useLocation();
const getQueryData=()=>{
let params=new URLSearchParams(location.search)
let to=params.get('to')

setState({
  to
})
}
useEffect(()=>{
getQueryData()
},[])

const replyToEmail=async()=>{
  try{
    if(state.to.length===0){
    toast.error("To not found",{containerId:"sendEmail"})
  return;  
  }else if(state.subject.length===0){
    toast.error("Subject not found",{containerId:"sendEmail"})
  return
  }else if(state.description.length===0){
    toast.error("Please enter description",{containerId:"sendEmail"})
  return;
  }
let response=await axios.post(`${BASE_URL}/sendEmail`,state)
toast.success("Email sent sucessfully",{containerId:"sendEmail"})
setTimeout(()=>{
navigate(-1)
},800)
  }catch(e){
if(e?.response?.data?.error){
  toast.error(e?.response?.data?.error,{containerId:"sendEmail"})
}else{
  toast.error("Client error please try again",{containerId:"sendEmail"})
}
  }
}
const navigate=useNavigate()

  return (
    <>
    <ToastContainer containerId={"sendEmail"}/>
 
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
      <div
        className="w-full h-full bg-white shadow-lg rounded-2xl p-8 overflow-auto flex flex-col"
      >
        <svg width={32} className='cursor-pointer' onClick={()=>{
          navigate(-1)
        }} height={32} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path><path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path></g></svg>
        <div className="grid my-5 grid-cols-2 gap-6 flex-grow">
          <div className="flex flex-col">
            <label className="text-gray-600 mb-2 font-semibold text-lg">To</label>
            <input
            value={state.to}
            disabled
              type="text"
              className="px-6 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
           
            />
          </div>

        </div>

        
        <div className="flex flex-col flex-grow">
          <label className="text-gray-600 mb-2 font-semibold text-lg">Subject</label>
          
            <input
            placeholder='Enter subject'
            value={state.subject}
            onChange={(e)=>{
                setState({
                    ...state,
                    subject:e.target.value
                })
            }}
           
              type="text"
              className="px-6 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
             
            />
           
        </div>

       
        <div className="flex flex-col flex-grow">
          <label className="text-gray-600 mb-2 font-semibold text-lg">Description</label>
          <textarea
          value={state.description}
          onChange={(e)=>{
            setState({
              ...state,
              description:e.target.value
            })
          }}
            className="px-6 py-4 h-64 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-lg"
            placeholder="Enter detailed description"
          ></textarea>
        </div>

  
        <div className="flex justify-end gap-4 mt-auto">
          <button onClick={()=>{
            navigate(-1)
          }} className="px-8 py-4 bg-gray-200 text-gray-700 text-lg rounded-lg hover:bg-gray-300 transition">
            Back
          </button>

          <button onClick={replyToEmail} className="px-8 py-4 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition shadow-lg">
            Send Message
          </button>
        </div>
      </div>
    </div>

    </>
  )
}

export default Sendemail;
