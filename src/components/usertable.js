import React, { useState, useContext, useEffect } from 'react';
import { MoonLoader } from 'react-spinners';
import { ToastContainer,toast } from 'react-toastify';
import axios from 'axios'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BASE_URL } from '../base_url';

const UserTable = () => {
    const [selectedMonth, setSelectedMonth] = useState('default');
    const [loading, setLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(null);
    const [users,setUsers]=useState([])

    const handleActionClick = (index) => {
        setShowMenu(showMenu === index ? null : index);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Active':
                return 'text-green-500';
            case 'TEMPORARY':
                return 'text-red-500';
            default:
                return '';
        }
    };

    
    const dummyData = [
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', userType: 'Admin', status: 'Active', registrationDate: '01/01/2023' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901', userType: 'User', status: 'Inactive', registrationDate: '02/01/2023' },
        { id: 3, name: 'Robert Brown', email: 'robert@example.com', phone: '345-678-9012', userType: 'Editor', status: 'Active', registrationDate: '03/01/2023' },
    ];
    useEffect(()=>{
getUsers();

    },[])

    const getUsers=async()=>{
        try{
let response=await axios.get(`${BASE_URL}/get-users`)
setUsers(response.data.user)
console.log(response.data)
        }catch(e){
     if(e?.response?.data?.error){
        toast.error(e?.response?.data?.error)
     }else{
        toast.error("Client error please try again")
     }
        }
    }

    return (
        <>
            <ToastContainer containerId="usermanagement" limit={1} />
            <div className="bg-white p-[20px] rounded-[20px] shadow-md">
                <div className="flex justify-between items-center mb-[20px]">
                    <h1 className="text-[#2563EB] text-[24px] font-semibold">User Listing</h1>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="p-[8px] bg-white font-semibold text-black rounded-[10px] border-[1px] border-black outline-none"
                    >
                        <option value="default">Select Month</option>
                        {/* Add month options here */}
                    </select>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center">
                        <MoonLoader color="#6B33E3" size={100} />
                    </div>
                ) : (
                    <table className="min-w-full table-auto border-gray-300 border-collapse">
                        <thead>
                            <tr className="bg-[#FDFBFD]">
                                <th className="p-[10px] text-left border-l border-t border-gray-300">User ID</th>
                                <th className="p-[10px] text-left border-l border-t border-gray-300">Name</th>
                                <th className="p-[10px] text-left border-l border-t border-gray-300">Email</th>
                                <th className="p-[10px] text-left border-l border-t border-gray-300">Phone Number</th>

                                <th className="p-[10px] text-left border-l border-t border-gray-300">Status</th>
                                <th className="p-[10px] text-left border-l border-t border-r border-gray-300">Registration Date</th>
                                <th className="p-[10px] text-left border-l border-t border-r border-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user, index) => (
                                <tr key={user._id} className="border-b">
                                    <td className="p-[10px] border-l border-gray-300">{(index+1)?.toString()}</td>
                                    <td className="p-[10px] border-l border-gray-300">{user?.username}</td>
                                    <td className="p-[10px] border-l border-gray-300">{user?.email}</td>
                                    <td className="p-[10px] border-l border-gray-300">{user?.country_code_id?.country_code+user?.mobile_number}</td>
                                    
                                    <td className={`p-[10px] border-l border-gray-300 ${getStatusClass(user?.current_active_state)}`}>
                                        {user?.current_active_state}
                                    </td>
                                    <td className="p-[10px] border-l border-gray-300">{user?.createdAt && new Date(user.createdAt).toLocaleDateString('en-US', {
    month: "long",
    day: "numeric",
    year: "numeric"
})}</td>
                                    <td className="p-[10px] border-l border-r border-gray-300 relative">
                                        <button onClick={() => handleActionClick(index)} className="focus:outline-none">
                                            <BsThreeDotsVertical />
                                        </button>
                                        {showMenu === index && (
                                            <div className="absolute top-full right-0 mt-2 w-[150px] bg-white border border-gray-300 rounded-lg shadow-md z-[999]">
                                                <ul>
                                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">View</li>
                                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit</li>
                                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Delete</li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
};

export default UserTable;
