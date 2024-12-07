import { ToastContainer, toast } from "react-toastify"
import { MoonLoader } from 'react-spinners';
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./base_url";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function ViewBond() {
    let { id } = useParams();
    const [loading, setLoading] = useState(false)
    const [state, setState] = useState()


    const navigate = useNavigate();

useEffect(()=>{
fetchMissionSubmission();
},[])

const fetchMissionSubmission=async()=>{
    try{
let response=await axios.get(`${BASE_URL}/getSingleMissionSubmission/${id}`)
setState(response.data.missionSubmission)

console.log(response.data)

console.log("RESPONSE DATA")
    }catch(e){
        if(e?.response?.data?.error){
            toast.error(e?.response?.data?.error,{containerId:"viewMissionSubmissionIssuer"})
        }else{
            toast.error("Something went wrong please try again",{containerId:"viewMissionSubmissionIssuer"})
        }
    }
}

const acceptMissionSubmission=async(id)=>{

    try{
let response=await axios.get(`${BASE_URL}/acceptMissionSubmission/${id}`)
toast.success("Mission accepted sucessfully",{containerId:"viewMissionSubmissionIssuer"})
setTimeout(()=>{
navigate('/missionsubmission')
},300)
    }catch(e){
if(e?.response?.data?.error){
toast.error(e?.response?.data?.error,{containerId:"viewMissionSubmissionIssuer"})
}else{
    toast.error("Something went wrong please try again",{containerId:"viewMissionSubmissionIssuer"})
}
    }
}

const rejectMissionSubmission=async(id)=>{
    try{
        let response=await axios.get(`${BASE_URL}/rejectmissionSubmission/${id}`)
        toast.success("Mission rejected sucessfully",{containerId:"viewMissionSubmissionIssuer"})
        setTimeout(()=>{
        navigate('/missionsubmission')
        },300)
    }catch(e){
        if(e?.response?.data?.error){
            toast.error(e?.response?.data?.error,{containerId:"viewMissionSubmissionIssuer"})
            }else{
                toast.error("Something went wrong please try again",{containerId:"viewMissionSubmissionIssuer"})
            }
    }
}

    return (
        <>
            <ToastContainer containerId={"viewMissionSubmissionIssuer"} />


            <div className="w-full px-[30px] py-[40px] bg-white min-h-[800px]">
                <svg onClick={() => {
                    navigate(-1)
                }} className="cursor-pointer" width="35" height="35" fill="#000000" viewBox="0 0 200 200" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title></title><path d="M160,89.75H56l53-53a9.67,9.67,0,0,0,0-14,9.67,9.67,0,0,0-14,0l-56,56a30.18,30.18,0,0,0-8.5,18.5c0,1-.5,1.5-.5,2.5a6.34,6.34,0,0,0,.5,3,31.47,31.47,0,0,0,8.5,18.5l56,56a9.9,9.9,0,0,0,14-14l-52.5-53.5H160a10,10,0,0,0,0-20Z"></path></g></svg>
                {loading ? <div className="flex justify-center items-center">

                    <MoonLoader color="#6B33E3" size={100} />
                </div> : <>

                    <div className="flex justify-between lg:flex-row flex-col items-center mb-[20px]">
                        <div className='flex flex-col'>
                            <h1 className="text-[24px] font-semibold">Mission Submission</h1>
                            <p className='text-[18px] text-[#74767E]'>{state?.mission?.mission_title}</p>
                            {state?.videoUrl && (
  <video
    className="mt-[20px] rounded-[10px] border border-[#74767E] w-[80%] h-[400px] mx-auto"
    controls
    onError={(e) => {
      console.error('Video error:', e);
      toast.error("Error loading video", { containerId: "viewMissionSubmissionIssuer" });
    }}
  >
    <source src={state?.videoUrl} type="video/mp4" />
    <p>Your browser does not support the video tag or the video cannot be loaded.</p>
  </video>
)}

                       


                        </div>




                    </div>
                    <div className="grid grid-cols-2 gap-[10px]">
                        <div className='flex flex-col'>
                            <h1 className="text-[18px] font-semibold">Title</h1>
                            <p className='text-[16px] text-[#74767E]'>{state?.mission?.mission_title}</p>
                        </div>
                        <div className='flex flex-col'>
                            <h1 className="text-[18px] font-semibold">Mission</h1>
                            <p className='text-[16px] text-[#74767E]'>{state?.mission?.description?.length > 0 ? state?.mission?.description?.slice(0,45)+'...' : `No Mission Found`}</p>
                        </div>
                        <div className='flex flex-col'>
                            <h1 className="text-[18px] font-semibold">Validity</h1>
                            <p className='text-[16px] text-[#74767E]'>{state?.bond_id?.validity_number} months</p>
                        </div>
                        <div className='flex flex-col'>
                            <h1 className="text-[18px] font-semibold">Price</h1>
                            <p className='text-[16px] text-[#74767E]'>${state?.bond_id?.bond_issuerance_amount}</p>
                        </div>


                        <div onClick={()=>rejectMissionSubmission(state?.mission?._id)} className="hover:cursor-pointer border-[1px] mt-[20px] rounded-[10px] border-[#6b33e3]  w-full xl:w-1/2 text-center text-[15px] bg-white px-[20px] py-[10px] text-[#6b33e3] font-semibold">
                            Reject
                        </div>
                        <div onClick={()=>acceptMissionSubmission(state?.mission?._id)} className="hover:cursor-pointer border-[1px] mt-[20px] rounded-[10px] w-full xl:w-1/2 text-center text-[15px] bg-[#6b33e3] px-[20px] py-[10px] text-white font-semibold">
                            Accept
                        </div>

                    </div>
                </>}
            </div>

        </>
    )
}