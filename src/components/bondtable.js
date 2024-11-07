import React, { useEffect, useState } from 'react';
import { MoonLoader } from 'react-spinners';
import { ToastContainer,toast } from 'react-toastify';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../base_url';

export default function BondTable() {
    const [selectedMonth, setSelectedMonth] = useState('default');
    const [loading, setLoading] = useState(false);
    const [showMenu, setShowMenu] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [bonds,setBonds]=useState([])
    const [filters, setFilters] = useState({
        bondType: '',
        status: '',
        registrationDate: '',
        amountRange: '',
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
            case 'Suspended':
                return 'text-red-500';
            case 'Pending':
                return 'text-orange-500';
            default:
                return '';
        }
    };

    const dummyData = [
        { bondID: 'BOND001', name: 'Bond Alpha', description: 'Corporate bond issued for project financing', issuer: 'Alpha Corp', submissionDate: '2024-01-01', bondAmount: '$5,000,000', status: 'Active' },
        { bondID: 'BOND002', name: 'Bond Beta', description: 'Government bond for infrastructure', issuer: 'Beta Government', submissionDate: '2024-02-15', bondAmount: '$10,000,000', status: 'Inactive' },
        { bondID: 'BOND003', name: 'Bond Gamma', description: 'Municipal bond for urban development', issuer: 'Gamma Municipality', submissionDate: '2024-03-10', bondAmount: '$2,500,000', status: 'Active' },
    ];

    const filteredData = dummyData.filter(
        (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.bondID.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

useEffect(()=>{
getBonds();
},[])


const getBonds=async()=>{
    try{
let response=await axios.get(`${BASE_URL}/get-bonds`)
setBonds(response.data.bonds)
console.log(response.data)
    }catch(e){
if(e?.response?.data?.error){
    toast.error(e?.response?.data?.error,{containerId:"bondmanagement"})
}else{
    toast.error("Client error please try again",{containerId:"bondmanagement"})
}
    }
}

const deleteBond=async(id)=>{
    try{
let response=await axios.delete(`${BASE_URL}/deleteBond/${id}`)
setBonds((prev)=>{
    let old=[...prev]
    let newold=old.filter(u=>u?._id!=id)
    return newold
})
toast.success(response.data.message,{containerId:"bondmanagement"})
setShowMenu(!showMenu)
    }catch(e){
if(e?.response?.data?.error){
    toast.error(e?.response?.data?.error,{containerId:"bondmanagement"})
}else{
    toast.error("Client error please try again",{containerId:"bondmanagement"})
}
    }
}

const updateStatus=async(status,id)=>{
    try{
let response=await axios.patch(`${BASE_URL}/update-status/${status}/${id}`)
setBonds((prev)=>{
    let old=[...prev]
    let getIndex=old.findIndex(u=>u?._id==id)
    let newbond={
        ...old[getIndex],
        status
    }
    old[getIndex]=newbond
    return old
   
})  
toast.success(response?.data?.message,{containerId:"bondmanagement"})
setShowMenu(!showMenu)
}catch(e){
if(e?.response?.data?.error){
toast.error(e?.response?.data?.error,{containerId:"bondmanagement"})
}else{
toast.error("Client error please try again",{containerId:"bondmanagement"})
}
    }
}

    return (
        <>
            <ToastContainer containerId="bondmanagement" limit={1} />
            <div className="bg-white p-[20px] rounded-[20px] shadow-md">
                <div className="flex justify-between items-center mb-[20px]">
                    <h1 className=" text-[24px] font-semibold">Sponsor Bond Managment</h1>
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
                        <div className='mt-4'>
                            <label htmlFor="bondtype" className="block text-md  font-semibold text-[#272226]">Bond Type</label>
                            <select
                                value={filters.bondType}
                                onChange={(e) => setFilters({ ...filters, bondType: e.target.value })}
                                className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                            >
                                <option value="">Select Bond Type</option>
                            </select>
                        </div>
                        <div className='mt-4'>
                            <label htmlFor="status" className="block text-md  font-semibold text-[#272226]">Satus</label>

                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                            >
                                <option value="">Select Status</option>
                            </select>
                        </div>
                        <div className='mt-4'>
                            <label htmlFor="date" className="block text-md  font-semibold text-[#272226]">Registration Date</label>

                            <input
                                type="date"
                                placeholder="Registration Date"
                                className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                            />
                        </div>
                        <div className='mt-4'>
                        <label htmlFor="range" className="block text-md  font-semibold text-[#272226]">Amount Range</label>

                            <select
                                value={filters.amountRange}
                                onChange={(e) => setFilters({ ...filters, amountRange: e.target.value })}
                                className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                            >
                                <option value="">Select Amount Range</option>
                            </select>
                        </div>
                    </div>
                )}



                {loading ? (
                    <div className="flex justify-center items-center">
                        <MoonLoader color="#6B33E3" size={100} />
                    </div>
                ) : (
                    <>
                        <table className="min-w-full table-auto border-gray-300 border-collapse mt-4">
                            <thead>
                                <tr className="bg-[#FDFBFD]">
                                    <th className="p-[10px] text-left border-l border-t border-gray-300">Bond ID</th>
                                    <th className="p-[10px] text-left border-l border-t border-gray-300">Name</th>
                                    <th className="p-[10px] text-left border-l border-t border-gray-300">Unit Price</th>
                                    <th className="p-[10px] text-left border-l border-t border-gray-300">Validity Number</th>
                                    <th className="p-[10px] text-left border-l border-t border-gray-300">Issuer</th>
                                    <th className="p-[10px] text-left border-l border-t border-gray-300">Bond Amount</th>
                                    <th className="p-[10px] text-left border-l border-t border-gray-300">Status</th>
                                    <th className="p-[10px] text-left border-l border-r border-t border-gray-300">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bonds?.map((bond, index) => (
                                    <tr key={bond.id} className="border-b">
                                        <td className="p-[10px] border-l border-gray-300">{bond?._id}</td>
                                        <td className="p-[10px] border-l border-gray-300">{bond?.title}</td>
                                        <td className="p-[10px] border-l border-gray-300">{bond?.bond_price}</td>
                                        <td className="p-[10px] border-l border-gray-300">{bond?.validity_number}</td>
                                        <td className="p-[10px] border-l border-gray-300">{bond?.issuer_id?.user_id?.username}</td>
                                        <td className="p-[10px] border-l border-gray-300">{bond?.bond_price*bond?.total_bonds}</td>
                                        <td className={`p-[10px] border-l border-gray-300 ${getStatusClass(bond?.status)}`}>
                                            {bond.status}
                                        </td>
                                        <td className="p-[10px] border-l border-r border-gray-300 relative">
                                            <button onClick={() => handleActionClick(index)} className="focus:outline-none">
                                                <BsThreeDotsVertical />
                                            </button>
                                            {showMenu === index && (
                                                <div className="absolute top-full right-0 mt-2 w-[150px] bg-white border border-gray-300 rounded-lg shadow-md z-[999]">
                                                    <ul>
                                                        <li onClick={()=>{
                                                            updateStatus("APPROVED",bond?._id)
                                                        }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Approve</li>
                                                        <li  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"><Link to = {`/bond-detail/${bond?._id}`}>Edit</Link></li>
                                                        <li onClick={()=>{
                                                            updateStatus("REJECTED",bond?._id)
                                                        }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Suspend</li>
                                                        <li className="px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer" onClick={()=>{
                                                            deleteBond(bond?._id)
                                                        }}>Delete</li>
                                                    </ul>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

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
}
