import React, { useEffect, useState } from 'react';
import { MoonLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import { Link } from 'react-router-dom';

import axios from 'axios';
import { BASE_URL } from '../base_url';

export default function MissionSubmissionTable() {
    const [selectedMonth, setSelectedMonth] = useState('default');
    const [suspendpopup, setSuspendPopup] = useState(false)
    const [loading, setLoading] = useState(true);
    const [cancelledpopup, setCancelledPopup] = useState(false)
    const [showMenu, setShowMenu] = useState(null);
    const [cancellationState, setCancellationState] = useState({
        reason: 'Incomplete Information',
        description: '',
        bond_id: '',
        email: '',
        title: ''
    })
    const [reasonpopup, setReasoPopup] = useState(false)
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
    const [bondtosuspend, setBondToSuspend] = useState();
    const [reason, setReason] = useState("");
    const suspendpopupfunction = (id) => {
        setSuspendPopup(!suspendpopup);
        setBondToSuspend(id)
    }
    const handleReasonChange = (e) => {
        setReason(e.target.value);
    };

    const handleConfirm = () => {
        setSuspendPopup(!suspendpopup);
        const bondid = bondtosuspend
        updateStatus("REJECTED", bondid)
        setBondToSuspend(null)
    };

    const statusOptions = ['PENDING', 'REJECTED', 'APPROVED', 'COMPLETED', 'WAITING FOR EXCHANGE', 'IN PROGRESS'];
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




    const filteredData = bonds?.filter((item) => {
        const matchesSearch = item?.bond_id?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
            item?.bond_id?._id?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
            item?.bond_id?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());

        const matchesStatus = filters.status ? item?.bond_id?.status === filters.status : true;


        const matchesBondType = filters.bondType ? item?.bond_id?.bondType === filters.bondType : true;
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

        const matchesAmountRange = filters.amountRange ? checkAmountRange(filters.amountRange, item?.bond_id?.bond_price * item?.bond_id?.total_bonds) : true;

        return matchesSearch && matchesStatus && matchesBondType && matchesAmountRange;
    });



    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

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

    useEffect(() => {
        getBonds();
    }, [searchQuery])


    const getBonds = async () => {
        try {

            let response = await axios.get(`${BASE_URL}/getSubmittedBonds`)
          
            setLoading(false)
           
            setBonds(response.data.missionSubmissions)
            console.log('response one')
            console.log(response.data)
        } catch (e) {
            if (e?.response?.data?.error) {
                toast.error(e?.response?.data?.error, { containerId: "bondmanagement" })
            } else {
                toast.error("Client error please try again", { containerId: "bondmanagement" })
            }
        }
    }

    const deleteBond = async (id) => {
        try {
            let response = await axios.delete(`${BASE_URL}/deleteBond/${id}`)
            setBonds((prev) => {
                let old = [...prev]
                let newold = old.filter(u => u?._id != id)
                return newold
            })
            toast.success(response.data.message, { containerId: "bondmanagement" })
            setShowMenu(!showMenu)
        } catch (e) {
            if (e?.response?.data?.error) {
                toast.error(e?.response?.data?.error, { containerId: "bondmanagement" })
            } else {
                toast.error("Client error please try again", { containerId: "bondmanagement" })
            }
        }
    }

    const updateStatus = async (status, id) => {
        try {
            let response = await axios.patch(`${BASE_URL}/update-status/${status}/${id}`)
            setBonds((prev) => {
                let old = [...prev]
                let getIndex = old.findIndex(u => u?._id == id)
                let newbond = {
                    ...old[getIndex],
                    status
                }
                old[getIndex] = newbond
                return old

            })
            toast.success(response?.data?.message, { containerId: "bondmanagement" })
            setShowMenu(!showMenu)
        } catch (e) {
            if (e?.response?.data?.error) {
                toast.error(e?.response?.data?.error, { containerId: "bondmanagement" })
            } else {
                toast.error("Client error please try again", { containerId: "bondmanagement" })
            }
        }
    }




    const filterSearch = (e) => {
        setSearchQuery(e.target.value);
        console.log(e.target.value);
    };


    const cancellbond = async () => {
        try {
            let response = await axios.post(`${BASE_URL}/rejectBond`, cancellationState)
            setCancellationState({
                reason: 'Incomplete Information',
                description: '',
                bond_id: ''
            })
            setBonds((prev) => {
                let old = [...prev]
                let findIndex = old.findIndex(u => u._id == cancellationState.bond_id)
                old[findIndex] = {
                    ...old[findIndex],
                    status: "REJECTED"
                }
                return old
            })
            setCancelledPopup(false)
            toast.success(response.data.message, { containerId: "bondmanagement" })
        } catch (e) {
            if (e?.response?.data?.error) {
                toast.error(e?.response?.data?.error, { containerId: "bondmanagement" })
            } else {
                toast.error("Client error please try again", { containerId: "bondmanagement" })
            }
        }
    }

    return (
        <>
            <ToastContainer containerId="bondmanagement" limit={1} />

            {loading == true ? <div className="flex justify-center items-center">
                <MoonLoader color="#6B33E3" size={100} />
            </div> : <div className="bg-white max-h-[700px]  overflow-y-auto p-[20px] rounded-[20px] shadow-md">
                <div className="flex xl:flex-row flex-col justify-between items-center mb-[20px]">
                    <h1 className=" text-[24px] font-semibold">Sponsor Bond Managment</h1>
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
                    <div className="absolute bg-white p-4 rounded-lg lg:shadow-lg shadow-md space-y-4 right-[3rem] w-[250px] z-50">

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

                        <div className='mt-4'>
                            <label htmlFor="range" className="block text-md  font-semibold text-[#272226]">Amount Range</label>

                            <select
                                value={filters.amountRange}
                                onChange={(e) => setFilters({ ...filters, amountRange: e.target.value })}
                                className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                            >
                                <option value="">All</option>
                                {amountRangeOptions.map((range) => (
                                    <option key={range} value={range}>
                                        {range}
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
                        {currentItems?.length > 0 ? <div>
                            <table className="min-w-full table-auto xl:table hidden border-gray-300 border-collapse mt-4">
                                <thead>
                                    <tr className="bg-[#FDFBFD]">
                                        <th className="p-[10px] text-left border-l border-t border-gray-300">Bond ID</th>
                                        <th className="p-[10px] text-left border-l border-t border-gray-300">Issuer Name</th>
                                        <th className="p-[10px] text-left border-l border-t border-gray-300">Unit Price</th>
                                        <th className="p-[10px] text-left border-l border-t border-gray-300">Validity Number</th>
                                        <th className="p-[10px] text-left border-l border-t border-gray-300">Issuer</th>
                                        <th className="p-[10px] text-left border-l border-t border-gray-300">Bond Amount</th>
                                        <th className="p-[10px] text-left border-l border-t border-gray-300">Status</th>
                                        <th className="p-[10px] text-left border-l border-r border-t border-gray-300">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems?.map((bond, index) => (
                                        <tr key={bond.id} className="border-b">
                                            <td className="p-[10px] border-l border-gray-300">{bond?.bond_id?._id}</td>
                                            <td className="p-[10px] border-l border-gray-300">{bond?.bond_id?.title}</td>
                                            <td className="p-[10px] border-l border-gray-300">{bond?.bond_id?.bond_price}</td>
                                            <td className="p-[10px] border-l border-gray-300">{bond?.bond_id?.validity_number}</td>
                                            <td className="p-[10px] border-l border-gray-300">{bond?.issuer_id?.user_id?.username}</td>
                                            <td className="p-[10px] border-l border-gray-300">{bond?.bond_id?.bond_issuerance_amount}</td>
                                            <td className={`p-[10px] border-l border-gray-300 ${getStatusClass(bond?.bond_id?.status)}`}>
                                                {bond.bond_id?.status}
                                            </td>
                                            <td className="p-[10px] border-l border-r border-gray-300 relative">
                                                <button onClick={() => handleActionClick(index)} className="focus:outline-none">
                                                    <BsThreeDotsVertical />
                                                </button>
                                                {showMenu === index && (
                                                    <div className="absolute top-full right-0 mt-2 w-[150px] bg-white border border-gray-300 rounded-lg shadow-md z-[999]">
                                                        <ul>
                                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                                <Link to={`/viemissionSubmission/${bond?.bond_id?._id}`}>View</Link>
                                                            </li>
                                                            
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
                                    {currentItems?.map((bond, index) => (
                                        <div key={bond.id} className="grid xl:grid-cols-4 grid-cols-2 gap-[20px] border-b border-gray-300 py-4">
                                            <div className="flex flex-col gap-[10px]">
                                                <h1 className="text-[18px] font-semibold text-[#7E8183]">Bond ID</h1>
                                                <p className="text-[16px] font-semibold">{bond?.bond_id?._id?.slice(0, 6)}...</p>
                                            </div>

                                            <div className="flex flex-col gap-[10px]">
                                                <h1 className="text-[18px] font-semibold text-[#7E8183]">Name</h1>
                                                <p className="text-[16px] font-semibold">{bond?.bond_id?.title}</p>
                                            </div>

                                            <div className="flex flex-col gap-[10px]">
                                                <h1 className="text-[18px] font-semibold text-[#7E8183]">Unit Price</h1>
                                                <p className="text-[16px] font-semibold">{bond?.bond_id?.bond_price}</p>
                                            </div>

                                            <div className="flex flex-col gap-[10px]">
                                                <h1 className="text-[18px] font-semibold text-[#7E8183]">Validity Number</h1>
                                                <p className="text-[16px] font-semibold">{bond?.bond_id?.validity_number}</p>
                                            </div>

                                            <div className="flex flex-col gap-[10px]">
                                                <h1 className="text-[18px] font-semibold text-[#7E8183]">Issuer</h1>
                                                <p className="text-[16px] font-semibold">{bond?.issuer_id?.user_id?.username}</p>
                                            </div>

                                            <div className="flex flex-col gap-[10px]">
                                                <h1 className="text-[18px] font-semibold text-[#7E8183]">Bond Amount</h1>
                                                <p className="text-[16px] font-semibold">{bond?.bond_id?.bond_issuerance_amount}</p>
                                            </div>

                                            <div className="flex flex-col gap-[10px]">
                                                <h1 className="text-[18px] font-semibold text-[#7E8183]">Status</h1>
                                                <p className="text-[16px] font-semibold">{bond?.bond_id?.status}</p>
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
                                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                                                                <Link to={`/viemissionSubmission/${bond?.bond_id?._id}`}>View</Link>
                                                            </li>
                                                           
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div> : <div className='w-full flex items-center justify-center'>
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





            {cancelledpopup ? <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={(e) => {
                setCancelledPopup(!cancelledpopup)
            }}>
                <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                    <h2 className="text-[24px] font-semibold mb-4">Rejection Reason</h2>

                    <div className="mb-4">
                        <label className="text-[18px] font-semibold text-black" htmlFor="rejectionReason">
                            Select Reason
                        </label>
                        <select
                            id="rejectionReason"
                            value={cancellationState.reason}
                            onChange={(e) => {
                                setCancellationState({
                                    ...cancellationState,
                                    reason: e.target.value
                                })
                            }}
                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                        >
                            <option value="" disabled>Select a reason</option>
                            <option value="Incomplete Information">Incomplete Information</option>
                            <option value="Invalid Data">Invalid Data</option>
                            <option value="Policy Violation">Policy Violation</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="text-[18px] font-semibold text-black" htmlFor="note">
                            Add Note
                        </label>
                        <textarea
                            id="note"
                            value={cancellationState.description}
                            onChange={(e) => {
                                setCancellationState({
                                    ...cancellationState,
                                    description: e.target.value
                                })
                            }}

                            rows="4"
                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                            placeholder="Add additional details here"
                        />
                    </div>

                    <button
                        onClick={cancellbond}
                        className="w-full py-3 mt-4 bg-blue-500 text-white rounded-[20px] font-semibold hover:bg-[#6b33e3]"
                    >
                        Reject bond
                    </button>
                </div>
            </div> : ''}
            {
                suspendpopup && (
                    <div className="fixed top-0 left-0 w-[100vw] h-[100vh] p-[20px] bg-[#00000037] flex items-center justify-center">
                        <div className="max-w-[600px] max-h-[500px] flex flex-col rounded-[20px] bg-white p-[20px]">
                            <h2 className="text-[1.5rem] font-bold text-[#6b33e3] mb-[20px]">Suspend Bond?</h2>
                            <label htmlFor="reason" className="lg:text-[17px] text-[15px]  mb-[10px]">
                                Select a reason to suspend the bond:
                            </label>
                            <select
                                id="reason"
                                value={reason}
                                onChange={handleReasonChange}
                                className="border border-[#6b33e3] rounded-[10px] p-[10px] mb-[20px] w-full"
                            >
                                <option value="">Select a reason</option>
                                <option value="Violation of terms">Violation of terms</option>
                                <option value="Non-payment">Non-payment</option>
                                <option value="Other">Other</option>
                            </select>

                            <div className="flex justify-end gap-[10px]">
                                <button
                                    onClick={handleConfirm}
                                    disabled={!reason}
                                    className={`px-[20px] py-[10px] rounded-[10px] text-white ${reason ? "bg-[#6b33e3]" : "bg-gray-300 cursor-not-allowed"
                                        }`}
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => {
                                        setSuspendPopup(!suspendpopup);
                                        setBondToSuspend(null)
                                    }}
                                    className="px-[20px] py-[10px] rounded-[10px] bg-white border border-[#6b33e3] text-[#6b33e3]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
