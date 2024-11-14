import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { MoonLoader } from 'react-spinners';
import { BASE_URL } from './base_url';
import axios from 'axios';
export default function UserDetail() {
    const [avatar, setAvatar] = useState(null);
    const [myAvatar,setMyAvatar]=useState("")
    const [state, setState] = useState({
        email: '',
        username: '',
        mobile_number: '',
        current_active_state: '',
        avatar: '',
        createdAt: ''
    })
    const [loading,setLoading]=useState(true)
    let { useremail } = useParams()
    const navigate = useNavigate()
    const onDrop = useCallback((acceptedFiles) => {
        
        const file = acceptedFiles[0];
        setState((prevState) => ({
            ...prevState,
            avatar: file
        }));
        
        if (file) {
            setAvatar(URL.createObjectURL(file));
            setMyAvatar(URL.createObjectURL(file))
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        maxFiles: 1,
    });
    useEffect(() => {
        getUserData();
    }, [])
    const convertUrlToFile = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], "avatar.jpg", { type: blob.type });
        return file;
    };

    const getUserData = async () => {
        try {


            let response = await axios.get(`${BASE_URL}/getUser/${useremail}`)
            setState(response.data.user)
            setMyAvatar(response.data.user.avatar)
            setLoading(false)
            console.log(response.data)
        } catch (e) {
            if (e?.response?.data?.error) {
                toast.error(e?.response?.data?.error, { containerId: "editUser" })
            } else {
                toast.error("Client error please try again", { containerId: "editUser" })
            }
        }
    }
    const editUser = async () => {
        try {
            console.log(state)
            const formData = new FormData();
        

            for (const key in state) {
                if (state.hasOwnProperty(key)) {
                    const value = state[key];

                    if (Array.isArray(value)) {
                        
                    } else {
                        formData.append(key, value);
                    }
                }
            }
            let avatarFile;


            if(typeof myAvatar==="string"){
                avatarFile=await convertUrlToFile(myAvatar)
              
                formData.append("avatar",avatarFile)
            }else{
                formData.append("avatar",myAvatar)
            }

         

           
            let response = await axios.patch(`${BASE_URL}/editUser/${useremail}`, formData)


            setState(response?.data?.user)
            toast.success(response?.data?.message, { containerId: "editUser" })
        } catch (e) {
            if (e?.response?.data?.error) {
                toast.error(e?.response?.data?.error, { containerId: "editUser" })
            } else {
                toast.error("Client error please try again", { containerId: "editUser" })
            }
        }
    }

    const goBack = () => {
        navigate(-1)
    }

    return (
        <>
            <ToastContainer containerId={"editUser"} />
            <div className="h-[100vh]">
                <div className="w-full overflow-x-auto bg-white rounded-[20px] mt-[20px] px-[40px] py-[40px] flex flex-col">
                   {loading?<div className="flex justify-center items-center">
                        <MoonLoader color="#6B33E3" size={100} />
                    </div>:<>
                    <div className="flex gap-[30px] xl:flex-row flex-col">
                        <div
                            {...getRootProps()}
                            className="w-[150px] h-[150px] rounded-[100%] border-dashed border-2 border-gray-300 xl:m-0 m-auto flex items-center justify-center cursor-pointer"
                        >
                            <input {...getInputProps()} />
                            {myAvatar ? (
                                <img
                                    src={myAvatar}
                                    alt="avatar"
                                    className="w-full h-full object-cover rounded-[100%]"
                                />
                            ) : (
                                <p className="text-center text-gray-500">Upload Avatar</p>
                            )}
                        </div>
                        <div className="xl:grid grid-cols-2 xl:w-[80%] w-full flex gap-[20px] xl:flex-row flex-col">

                            <div className="mt-[10px]">
                                <label htmlFor="lastname" className="block text-xl font-semibold text-[#272226]">Username</label>
                                <input
                                    value={state?.username}
                                    type="text"
                                    name="lastname"
                                    onChange={(e) => {
                                        setState({
                                            ...state,
                                            username: e.target.value
                                        })
                                    }}
                                    placeholder="Enter Last Name"
                                    className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="xl:grid grid-cols-2  mt-[30px] w-full flex gap-[20px] xl:flex-row flex-col">
                        <div className="mt-[10px]">
                            <label htmlFor="email" className="block text-xl font-semibold text-[#272226]">Email</label>
                            <input
                                value={state.email}
                                onChange={(e) => {
                                    setState({
                                        ...state,
                                        email: e.target.value
                                    })
                                }}
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                            />
                        </div>
                        <div className="mt-[10px]">
                            <label htmlFor="phonenumber" className="block text-xl font-semibold text-[#272226]">Phone Number</label>
                            <input
                                value={state.mobile_number}
                                onChange={(e) => {
                                    setState({
                                        ...state,
                                        mobile_number: e.target.value
                                    })
                                }}

                                type="phonenumber"
                                name="phonenumber"
                                placeholder="Enter Last Name"
                                className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div className="xl:grid grid-cols-2 mt-[30px] w-full flex gap-[20px] xl:flex-row flex-col">

                        <div className="mt-[10px]">
                            <label htmlFor="status" className="block text-xl font-semibold text-[#272226]">Status</label>
                            <select
                                value={state.current_active_state}
                                onChange={(e) => {
                                    setState({
                                        ...state,
                                        current_active_state: e.target.value
                                    })
                                }}

                                name="status"
                                className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                            >
                                <option value="">Select Status</option>
                                <option value="TEMPORARY">TEMPORARY</option>
                                <option value="ISSUERER">ISSUERER</option>
                                <option value="BUYER">BUYER</option>
                            </select>
                        </div>
                    </div>
                    <div className="xl:grid grid-cols-2  mt-[30px] w-full flex gap-[20px] xl:flex-row flex-col">



                    </div>
                    <div className='flex justify-end w-full gap-[20px]'>
                        <button className='border rounded-[20px] px-[20px] py-[10px] text-[#6b33e3] border-[#6b33e3]' onClick={editUser}>Edit User</button>
                        <button className='border rounded-[20px] px-[20px] py-[10px] text-red-500 border-red-500' onClick={goBack}>Cancel</button>
                    </div>
                   </>}
                </div>

            </div>

        </>
    );
}
