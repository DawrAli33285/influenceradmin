import { ToastContainer, toast } from "react-toastify";
import { MoonLoader } from 'react-spinners';
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./base_url";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function SingleBond() {
    let { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        fetchMissionSubmission();
    }, []);

    const fetchMissionSubmission = async () => {
        try {
            let response = await axios.get(`${BASE_URL}/getSingleBond/${id}`);
            setState(response.data.bond);
            console.log(response.data);
            console.log("RESPONSE DATA");
        } catch (e) {
            if (e?.response?.data?.error) {
                toast.error(e?.response?.data?.error, { containerId: "viewMissionSubmissionIssuer" });
            } else {
                toast.error("Something went wrong please try again", { containerId: "viewMissionSubmissionIssuer" });
            }
        }
    };

    const acceptMissionSubmission = async (id) => {
        try {
            let response = await axios.get(`${BASE_URL}/acceptMissionSubmission/${id}`);
            toast.success("Mission accepted successfully", { containerId: "viewMissionSubmissionIssuer" });
            setTimeout(() => {
                navigate('/missionsubmission');
            }, 300);
        } catch (e) {
            if (e?.response?.data?.error) {
                toast.error(e?.response?.data?.error, { containerId: "viewMissionSubmissionIssuer" });
            } else {
                toast.error("Something went wrong please try again", { containerId: "viewMissionSubmissionIssuer" });
            }
        }
    };

    const rejectMissionSubmission = async (id) => {
        try {
            let response = await axios.get(`${BASE_URL}/rejectmissionSubmission/${id}`);
            toast.success("Mission rejected successfully", { containerId: "viewMissionSubmissionIssuer" });
            setTimeout(() => {
                navigate('/missionsubmission');
            }, 300);
        } catch (e) {
            if (e?.response?.data?.error) {
                toast.error(e?.response?.data?.error, { containerId: "viewMissionSubmissionIssuer" });
            } else {
                toast.error("Something went wrong please try again", { containerId: "viewMissionSubmissionIssuer" });
            }
        }
    };

    return (
        <>
            <ToastContainer containerId={"viewMissionSubmissionIssuer"} />

            <div className="w-full px-[30px] py-[40px] bg-white min-h-[550px]">
                <svg
                    onClick={() => navigate(-1)}
                    className="cursor-pointer"
                    width="35"
                    height="35"
                    fill="#000000"
                    viewBox="0 0 200 200"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M160,89.75H56l53-53a9.67,9.67,0,0,0,0-14,9.67,9.67,0,0,0-14,0l-56,56a30.18,30.18,0,0,0-8.5,18.5c0,1-.5,1.5-.5,2.5a6.34,6.34,0,0,0,.5,3,31.47,31.47,0,0,0,8.5,18.5l56,56a9.9,9.9,0,0,0,14-14l-52.5-53.5H160a10,10,0,0,0,0-20Z"></path>
                </svg>
                {loading ? (
                    <div className="flex justify-center items-center">
                        <MoonLoader color="#6B33E3" size={100} />
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between lg:flex-row flex-col items-center mb-[20px]">
                            <div className="flex flex-col">
                                <h1 className="text-[24px] font-semibold">Mission Submission</h1>
                                <p className="text-[18px] text-[#74767E]">{state?.title || "Untitled"}</p>

                                {/* Display photos instead of video */}
                                <div className="mt-[20px] grid grid-cols-2 gap-4">
                                    {state?.photos && state.photos.length > 0 ? (
                                        state.photos.map((photo, index) => (
                                            <img
                                                key={index}
                                                src={photo}
                                                alt={`photo-${index}`}
                                                className="rounded-[10px] border border-[#74767E] w-full h-[200px] object-cover"
                                            />
                                        ))
                                    ) : (
                                        <p className="text-[16px] text-center">No photos available</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-[10px]">
                            <div className="flex flex-col">
                                <h1 className="text-[18px] font-semibold">Title</h1>
                                <p className="text-[16px] text-[#74767E]">{state?.title}</p>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-[18px] font-semibold">Platform</h1>
                                <p className="text-[16px] text-[#74767E]">{state?.platform}</p>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-[18px] font-semibold">Validity</h1>
                                <p className="text-[16px] text-[#74767E]">{state?.validity_number} months</p>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-[18px] font-semibold">Price</h1>
                                <p className="text-[16px] text-[#74767E]">${state?.bond_price}</p>
                            </div>
                        </div>

                    </>
                )}
            </div>
        </>
    );
}
