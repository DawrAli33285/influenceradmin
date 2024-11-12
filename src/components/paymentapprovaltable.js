import React, { useEffect, useState } from 'react';
import { MoonLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { BASE_URL } from '../base_url';

export default function Paymentapprovaltable() {
    const [selectedMonth, setSelectedMonth] = useState('default');
    const [loading, setLoading] = useState(true);
    const [cancellationData,setCancellationData]=useState([])
    const [transactionData,setTransactionData]=useState([])
    const [showMenu, setShowMenu] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [bonds, setBonds] = useState([])
    const [filters, setFilters] = useState({
        bondType: '',
        status: '',
        registrationDate: '',
        amountRange: '',
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const statusOptions = ['SUCESS','FAILED','REJECTED'];
    const amountRangeOptions = [
        'Under $1,000',
        '$1,000 - $5,000',
        '$5,000 - $10,000',
        '$10,000 - $50,000',
        '$50,000 - $100,000',
        'Above $100,000',
    ];

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




    const filteredData = transactionData?.filter((item) => {
        const lowerSearchQuery = searchQuery?.toLowerCase();
    
       
        const matchesSearch = 
            (item?.payment_method_id?.method_name?.toLowerCase()?.includes(lowerSearchQuery)) || 
            (item?.status?.toLowerCase()?.includes(lowerSearchQuery));
        
        const matchesStatus = filters.status ? item.status === filters.status : true;
        const matchesBondType = filters.bondType ? item.bondType === filters.bondType : true;
        
        const checkAmountRange = (range, amount) => {
            switch (range) {
                case 'Under $1,000':
                    return amount < 1000;
                case '$1,000 - $5,000':
                    return amount >= 1000 && amount <= 5000;
                case '$5,000 - $10,000':
                    return amount > 5000 && amount <= 10000;
                case '$10,000 - $50,000':
                    return amount > 10000 && amount <= 50000;
                case '$50,000 - $100,000':
                    return amount > 50000 && amount <= 100000;
                case 'Above $100,000':
                    return amount > 100000;
                default:
                    return true;
            }
        };
    
        const matchesAmountRange = filters.amountRange ? checkAmountRange(filters.amountRange, item.bond_price * item.total_bonds) : true;
    
        return matchesSearch && matchesStatus && matchesBondType && matchesAmountRange;
    });
    

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);
    
    const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

const getTransactionData=async()=>{
    try{
let response=await axios.get(`${BASE_URL}/get-payments`)
console.log("RESPONSE")
console.log(response.data)
setTransactionData(response.data.transactions)
toast.success(response?.data?.message,{containerId:"paymentapproval"})
setLoading(false)
    }catch(e){
if(e?.response?.data?.error){
toast.error(e?.response?.data?.error,{containerId:"paymentapproval"})
}else{
toast.error("Client error please try again",{containerId:"paymentapproval"})
}
    }
}


   useEffect(()=>{
   getTransactionData();
   },[])

    
    




    const filterSearch = (e) => {
        setSearchQuery(e.target.value);
        console.log(e.target.value);
    };



const suspendTransaction=async(id)=>{
    try{
let response=await axios.patch(`${BASE_URL}/suspendPayment/${id}`)
setTransactionData((prev)=>{
    let old=[...prev]
    let findIndex=old.findIndex(u=>u._id==id)
    old[findIndex]={
        ...old[findIndex],
        status:"REJECTED"
    }
    return old
})
setShowMenu(false)
toast.success("Payment rejected sucessfully",{containerId:"paymentapproval"})
    }catch(e){
if(e?.response?.data?.error){
    toast.error(e?.response?.data?.error,{containerId:"paymentapproval"})
}else{
    toast.error("Client error please try again",{containerId:"paymentapproval"})
}
    }
}



const approveTransaction=async(id)=>{
    try{
let response=await axios.patch(`${BASE_URL}/approvePayment/${id}`)
setTransactionData((prev)=>{
    let old=[...prev]
    let findIndex=old.findIndex(u=>u._id==id)
    old[findIndex]={
        ...old[findIndex],
        status:"SUCESS"
    }
    return old
})
setShowMenu(false)
toast.success("Payment approved sucessfully",{containerId:"paymentapproval"})
    }catch(e){
if(e?.response?.data?.error){
    toast.error(e?.response?.data?.error,{containerId:"paymentapproval"})
}else{
    toast.error("Client error please try again",{containerId:"paymentapproval"})
}
    }
}



    return (
        <>
            <ToastContainer containerId="paymentapproval" limit={1} />

            {loading == true ? <div className="flex justify-center items-center">
                <MoonLoader color="#6B33E3" size={100} />
            </div> : <div className="bg-white max-h-[700px]  overflow-y-auto p-[20px] rounded-[20px] shadow-md">
                <div className="flex justify-between items-center mb-[20px]">
                    <h1 className=" text-[24px] font-semibold">Payment Managment</h1>
                    <div className='flex gap-[20px] items-center'>
                        <div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={filterSearch}
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
                            <label htmlFor="status" className="block text-md  font-semibold text-[#272226]">Satus</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                            >
                                <option value="">All</option>
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
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
                        {currentItems?.length > 0 ? <table className="min-w-full table-auto border-gray-300 border-collapse mt-4">
                            <thead>
                                <tr className="bg-[#FDFBFD]">
                                    <th className="p-[10px] text-left border-l border-t border-gray-300">Bond ID</th>
                                    <th className="p-[10px] text-left border-l border-t border-gray-300">Method Name</th>
                                    <th className="p-[10px] text-left border-l border-t border-gray-300">No Of Bonds</th>
                                    <th className="p-[10px] text-left border-l border-t border-gray-300">Amount</th>
                                    <th className="p-[10px] text-left border-l border-t border-gray-300">Status</th>
                                    <th className="p-[10px] text-left border-l border-r border-t border-gray-300">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems?.map((bond, index) => (
                                    <tr key={bond.id} className="border-b">
                                        <td className="p-[10px] border-l border-gray-300">{bond?.bond_id?._id}</td>
                                        <td className="p-[10px] border-l border-gray-300">{bond?.payment_method_id?.method_name}</td>
                                        <td className={`p-[10px] border-l border-gray-300`}>
                                           {bond?.no_of_bonds}
                                        </td>
                                        <td className={`p-[10px] border-l border-gray-300`}>
                                            ${bond?.amount?.toString()}
                                        </td> 
                                        <td className={`p-[10px] border-l border-gray-300 ${bond?.status?bond?.status:`PENDING`}`}>
                                            {bond?.status?bond?.status:`PENDING`}
                                        </td>
                                        <td className="p-[10px] border-l border-r border-gray-300 relative">
                                            <button onClick={() => handleActionClick(index)} className="focus:outline-none">
                                                <BsThreeDotsVertical />
                                            </button>
                                            {showMenu === index && (
                                                <div className="absolute top-full right-0 mt-2 w-[150px] bg-white border border-gray-300 rounded-lg shadow-md z-[999]">
                                                    <ul>
                                                        
                                                        <li onClick={()=>suspendTransaction(bond?._id)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Reject</li>
                                                        <li onClick={()=>approveTransaction(bond?._id)} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Approve</li>
                                                    </ul>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table> : <div className='w-full flex items-center justify-center'>
                            <p>No Record Found</p>
                        </div>}

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
            </div>}
        </>
    );
}
