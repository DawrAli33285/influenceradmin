import React, { useState, useContext, useEffect } from 'react';
import { MoonLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { BASE_URL } from '../base_url';
import { Link } from 'react-router-dom';

const UserTable = () => {
    const [selectedMonth, setSelectedMonth] = useState('default');
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(null);
    const [users, setUsers] = useState([])
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        userType: '',
        status: '',
        registrationDate: '',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
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
    useEffect(() => {
        getUsers();

    }, [])

    const getUsers = async () => {
        try {
            let response = await axios.get(`${BASE_URL}/get-users`)
            setUsers(response.data.user)
            setLoading(false)
            console.log(response.data)
        } catch (e) {
            if (e?.response?.data?.error) {
                toast.error(e?.response?.data?.error)
            } else {
                toast.error("Client error please try again")
            }
        }
    }
    const filteredData = users.filter((item) => {
        const matchesSearchQuery =
            item.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.mobile_number?.toLowerCase().includes(searchQuery.toLowerCase());
    
        const matchesStatus = filters.status === '' || item.current_active_state === filters.status;
    
       
        const itemRegistrationDate = new Date(item.createdAt).toISOString().split('T')[0]; // Extracts date portion as 'YYYY-MM-DD'
        const selectedDate = filters.registrationDate;
    
        console.log('Item Registration Date:', itemRegistrationDate);
        console.log('Selected Filter Date:', selectedDate);
        
        const matchesRegistrationDate = !selectedDate || itemRegistrationDate === selectedDate;
    
        return matchesSearchQuery && matchesStatus && matchesRegistrationDate;
    });
    
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };


const deleteUser=async(id)=>{
try{
let response=await axios.delete(`${BASE_URL}/deleteUser/${id}`)
toast.success(response?.data?.message,{containerId:"usermanagement"})
setUsers((prev)=>{
    let old=[...prev]
    let newold=old.filter(u=>u?._id!=id)
    return newold
})
setShowMenu(!showMenu)


}catch(e){
    if(e?.response?.data?.error){
        toast.error(e?.response?.data?.error,{containerId:"usermanagement"})
    }else{
        toast.error("Client error please try again")
    }
}
}

const navigate=useNavigate();
    return (
        <>
        
            <ToastContainer containerId="usermanagement" limit={1} />
            <div className="bg-white max-h-[700px]  overflow-y-auto p-[20px] rounded-[20px] shadow-md">
                <div className="flex xl:flex-row flex-col justify-between items-center mb-[20px]">
                    <h1 className="text-[#2563EB] text-[24px] font-semibold">User Listing</h1>
                    <div className='flex gap-[20px] items-center'>
                        <div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="p-[8px] bg-white font-semibold text-black rounded-[10px] border-[1px] border-black outline-none"
                                placeholder="Search"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="p-[8px] bg-white font-semibold text-black rounded-[10px] border-[1px] border-black outline-none"
                        >
                            Filters
                        </button>
                    </div>
                </div>
                {showFilters && (
                    <div className="absolute bg-white p-4 rounded-lg shadow-lg shadow-md space-y-4 right-[3rem] w-[250px] z-50">
                        {/* <div className='mt-4'>
                            <label htmlFor="usertype" className="block text-md  font-semibold text-[#272226]">User Type</label>
                            <select
                                value={filters.userType}
                                onChange={(e) => setFilters({ ...filters, bondType: e.target.value })}
                                className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                            >
                                <option value="TEMPORARY">TEMPORARY</option>
                                <option value="VERIFIED">VERIFIED</option>
                            </select>
                        </div> */}
                        <div className='mt-4'>
                            <label htmlFor="Status" className="block text-md  font-semibold text-[#272226]">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                            >
                            <option value="TEMPORARY">TEMPORARY</option>
                            <option value="VERIFIED">VERIFIED</option>
                            </select>
                        </div>
                        <div className='mt-4'>
                            <label htmlFor="date" className="block text-md  font-semibold text-[#272226]">Registration Date</label>
                            <input
                            onChange={(e) => {
                                setFilters({ ...filters, registrationDate: e.target.value });
                                console.log("Updated Filter Date:", e.target.value);  // Log the new date value
                            }}
                                type="date"
                                placeholder="Registration Date"
                                className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                            />
                        </div>
                    </div>
                )}
                {loading ? (
                    <div className="flex justify-center items-center">
                        <MoonLoader color="#6B33E3" size={100} />
                    </div>
                ) : (
                    <>
                    <table className="min-w-full hidden xl:table table-auto border-gray-300 border-collapse">
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
                            {currentItems?.map((user, index) => (
                                <tr key={user?._id} className="border-b">
                                    <td className="p-[10px] border-l border-gray-300">{(index + 1)?.toString()}</td>
                                    <td className="p-[10px] border-l border-gray-300">{user?.username}</td>
                                    <td className="p-[10px] border-l border-gray-300">{user?.email}</td>
                                    <td className="p-[10px] border-l border-gray-300">{user?.country_code_id?.country_code + user?.mobile_number}</td>

                                    <td className={`p-[10px] border-l border-gray-300 ${getStatusClass(user?.current_active_state)}`}>
                                        {user?.current_active_state}
                                    </td>
                                    <td className="p-[10px] border-l border-gray-300">{user?.createdAt && new Date(user?.createdAt).toLocaleDateString('en-US', {
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
                                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"><Link to={`/userdetail/${user?.email}`}>Edit</Link></li>
                                                    <li onClick={() => deleteUser(user?._id)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Delete</li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='w-full xl:hidden block'>
                        <div className="xl:grid-cols-4 grid-cols-2 gap-[20px] border-b border-gray-300 py-4">
                            {currentItems?.map((user, index) => (
                                <div key={user.id} className="grid xl:grid-cols-4 grid-cols-2 gap-[20px] border-b border-gray-300 py-4">
                                    <div className="flex flex-col gap-[10px]">
                                        <h1 className="text-[18px] font-semibold text-[#7E8183]">User ID</h1>
                                        <p className="text-[16px] font-semibold">{(index + 1)?.toString()}</p>
                                    </div>

                                    <div className="flex flex-col gap-[10px]">
                                        <h1 className="text-[18px] font-semibold text-[#7E8183]">Name</h1>
                                        <p className="text-[16px] font-semibold">{user?.username}</p>
                                    </div>

                                    <div className="flex flex-col gap-[10px]">
                                        <h1 className="text-[18px] font-semibold text-[#7E8183]">Email</h1>
                                        <p className="text-[16px] font-semibold">
                                            {user?.email?.slice(0, 6)} {/* Trim email to 6 characters */}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-[10px]">
                                        <h1 className="text-[18px] font-semibold text-[#7E8183]">Phone Number</h1>
                                        <p className="text-[16px] font-semibold">
                                            {user?.country_code_id?.country_code.slice(0, 3)}{user?.mobile_number?.slice(0, 3)} {/* Trim phone number to 6 characters */}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-[10px]">
                                        <h1 className="text-[18px] font-semibold text-[#7E8183]">Status</h1>
                                        <p className="text-[16px] font-semibold">{user?.current_active_state}</p>
                                    </div>

                                    <div className="flex flex-col gap-[10px]">
                                        <h1 className="text-[18px] font-semibold text-[#7E8183]">Registration Date</h1>
                                        <p className="text-[16px] font-semibold">{user?.createdAt && new Date(user?.createdAt).toLocaleDateString('en-US', {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric"
                                        })}</p>
                                    </div>
                                    <div className="flex flex-col gap-[10px] relative">
                                        <h1 className="text-[18px] font-semibold text-[#7E8183]">Action</h1>
                                        <button
                                            onClick={() => handleActionClick(index)}
                                            className="focus:outline-none"
                                        >
                                            <BsThreeDotsVertical />
                                        </button>
                                        {showMenu === index && (
                                            <div className="absolute top-full right-0 mt-2 w-[150px] bg-white border border-gray-300 rounded-lg shadow-md z-[999]">
                                                <ul>
                                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">View</li>
                                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"><Link to={`/userdetail/${user?.email}`}>Edit</Link></li>
                                                    <li onClick={() => deleteUser(user?._id)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Delete</li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>


                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="p-2 bg-white border rounded-md text-gray-600 hover:bg-gray-200"
                        >
                            <FaArrowLeft />
                        </button>
                        {[...Array(totalPages)].map((_, pageIndex) => (
                            <button
                                key={pageIndex}
                                onClick={() => handlePageClick(pageIndex + 1)}
                                className={`p-2 border rounded-md ${currentPage === pageIndex + 1 ? 'bg-[#6b33e3] text-white' : 'bg-white text-black'} hover:bg-gray-200`}
                            >
                                {pageIndex + 1}
                            </button>
                        ))}
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="p-2 bg-white border rounded-md text-gray-600 hover:bg-gray-200"
                        >
                            <FaArrowRight />
                        </button>
                    </div>
                </>
                )}
            </div>
        </>
    );
};

export default UserTable;
