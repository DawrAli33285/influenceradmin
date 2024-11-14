import React, { useEffect, useState } from 'react';
import { MoonLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { gapi } from 'gapi-script';

import axios from 'axios';
import { BASE_URL } from '../base_url';

export default function CustomerSupportTable() {
    const [selectedMonth, setSelectedMonth] = useState('default');
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [emails, setEmails] = useState([]);
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
    const statusOptions = ['PENDING', 'REJECTED', 'APPROVED', 'COMPLETED', 'WAITING FOR EXCHANGE', 'IN PROGRESS'];
    const amountRangeOptions = [
        'Under $1,000',
        '$1,000 - $5,000',
        '$5,000 - $10,000',
        '$10,000 - $50,000',
        '$50,000 - $100,000',
        'Above $100,000',
    ];

    const navigate = useNavigate();
    const handleApiError = async (error) => {
        if (error?.status === 429) {
            const retryAfter = error.headers['Retry-After'];
            const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 5000;
            console.log(`Rate limit exceeded. Retrying after ${waitTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return true;
        }
        console.error('Error occurred:', error);
        return false;
    };

    const exponentialBackoff = async (fn, retries = 5, delay = 1000) => {
        try {
            return await fn();
        } catch (error) {
            if (retries <= 0 || !(await handleApiError(error))) {
                throw error;
            }

            console.log(`Retrying after ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return exponentialBackoff(fn, retries - 1, delay * 2);
        }
    };


    const extractEmail = (from) => {

        const match = from.match(/<([^>]+)>/);
        return match ? match[1] : from;
    };


    const filteredData = emails?.filter((item) => {
        const matchesSearch =
            item?.subject?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
            item?.id?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
            item?.snippet?.toLowerCase()?.includes(searchQuery?.toLowerCase());

        const matchesFrom = filters.from
            ? extractEmail(item.from)?.toLowerCase()?.includes(filters.from?.toLowerCase())
            : true;


        const matchesReplied =
            filters.replied !== undefined ? item.replied === filters.replied : true;

        const matchesStatus = filters.status ? item.status === filters.status : true;
        const matchesBondType = filters.bondType ? item.bondType === filters.bondType : true;

        return matchesSearch && matchesFrom && matchesReplied && matchesStatus && matchesBondType;
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





    const filterSearch = (e) => {
        setSearchQuery(e.target.value);

    };


    const initClient = () => {
        gapi.client.init({
            apiKey: 'AIzaSyCZ8H0BHeuhGUOisBp5uFeaehKB7sc6Caw',
            clientId: '18819315923-dgjfpoa60vhgf4c1ftba93aj6otb6sl3.apps.googleusercontent.com',
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
            scope: "https://www.googleapis.com/auth/gmail.readonly",
        }).then(() => {

            const authInstance = gapi.auth2.getAuthInstance();
            if (authInstance.isSignedIn.get()) {
                setIsAuthenticated(true);
                listMessages();
            }
        });
    };


    useEffect(() => {
        gapi.load('client:auth2', initClient);
    }, []);


    const extractMessageId = (messageId) => {
        const match = messageId.match(/<([^>]+)>/);
        return match ? match[1] : "No messageId";
    };

    const listMessages = async () => {
        try {
            const response = await exponentialBackoff(() =>
                gapi.client.gmail.users.messages.list({
                    userId: 'me',
                    labelIds: ['INBOX'],
                    q: 'is:unread',
                })
            );

            const messages = response.result.messages || [];

            const messageDetails = messages.map(async (message) => {
                const messageResponse = await gapi.client.gmail.users.messages.get({
                    userId: 'me',
                    id: message.id,
                });

                const emailData = messageResponse.result;
                const threadId = emailData.threadId;


                const threadResponse = await gapi.client.gmail.users.threads.get({
                    userId: 'me',
                    id: threadId,
                });

                const hasReply = threadResponse.result.messages.length > 1;  // Check if more than one message in the thread

                const headers = emailData.payload.headers;
                const fromHeader = headers.find((header) => header.name === 'From');
                const subjectHeader = headers.find((header) => header.name === 'Subject');
                const messageIdHeader = headers.find((header) => header.name === 'Message-ID');

                return {
                    id: emailData.id,
                    from: fromHeader ? fromHeader.value : 'No sender',
                    subject: subjectHeader ? subjectHeader.value : 'No subject',
                    messageId: messageIdHeader ? messageIdHeader.value : 'No Message-ID',
                    snippet: emailData.snippet,
                    replied: hasReply,
                    threadId: threadId
                };
            });

            Promise.all(messageDetails).then((emails) => {
                setEmails(emails);
                setLoading(false);
            });
        } catch (error) {
            toast.error('Failed to fetch emails. Please try again later.', { containerId: 'customersupport' });
            console.error('Failed to fetch emails:', error);
        }
    };






    return (
        <>
            <ToastContainer containerId="customersupport" limit={1} />

            {loading == true ? <div className="flex justify-center items-center">
                <MoonLoader color="#6B33E3" size={100} />
            </div> : <div className="bg-white max-h-[700px]  overflow-y-auto p-[20px] rounded-[20px] shadow-md">
                <div className="flex justify-between items-center mb-[20px]">

                    <h1 className=" text-[24px] font-semibold">Support Requests</h1>
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
                            <label htmlFor="Replied" className="block text-md  font-semibold text-[#272226]">Replied</label>
                            <select
                                value={filters.replied}
                                onChange={(e) => setFilters({ ...filters, replied: e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined })}
                                className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                            >
                                <option value="">All</option>
                                <option value="true">True</option>
                                <option value="false">False</option>
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
                        {emails?.length > 0 ?
                            <div>
                                <table className="min-w-full xl:table hidden table-auto border-gray-300 border-collapse mt-4">
                                    <thead>
                                        <tr className="bg-[#FDFBFD]">
                                            <th className="p-[10px] text-left border-l border-t border-gray-300">Email ID</th>
                                            <th className="p-[10px] text-left border-l border-t border-gray-300">From</th>
                                            <th className="p-[10px] text-left border-l border-t border-gray-300">Subject</th>
                                            <th className="p-[10px] text-left border-l border-t border-gray-300">Message ID</th>
                                            <th className="p-[10px] text-left border-l border-t border-gray-300">Replied</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems?.map((bond, index) => {

                                            return (
                                                <tr onClick={() => {
                                                    navigate(`/Managecustomersupport?to=${extractEmail(bond?.from)}&subject=${bond?.subject}&id=${bond?.id}&messageId=${extractMessageId(bond?.messageId)}`)
                                                }} key={bond.id} className="border-b cursor-pointer">
                                                    <td className="p-[10px] border-l border-gray-300">{bond?.id}</td>
                                                    <td className="p-[10px] border-l border-gray-300">{extractEmail(bond?.from)}</td>
                                                    <td className="p-[10px] border-l border-gray-300">{bond?.subject}</td>
                                                    <td className="p-[10px] border-l border-gray-300">{extractMessageId(bond?.messageId)}</td>
                                                    <td className="p-[10px] border-l border-gray-300">
                                                        {bond?.replied !== undefined && bond?.replied !== null
                                                            ? bond.replied.toString()
                                                            : 'Not found'}
                                                    </td>
                                                </tr>
                                            );
                                        })}

                                    </tbody>
                                </table>
                                <div className='w-full xl:hidden block'>
                                    <div className="xl:grid-cols-4 grid-cols-2 gap-[20px] border-b border-gray-300 py-4">
                                        {currentItems?.map((bond, index) => (
                                            <div key={bond.id} className="grid xl:grid-cols-4 grid-cols-2 gap-[20px] border-b border-gray-300 py-4">
                                                <div className="flex flex-col gap-[10px]">
                                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Email ID</h1>
                                                    <p className="text-[16px] font-semibold">{bond?.id?.slice(0, 6)}...</p>
                                                </div>

                                                <div className="flex flex-col gap-[10px]">
                                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">From</h1>
                                                    <p className="text-[16px] font-semibold">{extractEmail(bond?.from)}</p>
                                                </div>

                                                <div className="flex flex-col gap-[10px]">
                                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Subject</h1>
                                                    <p className="text-[16px] font-semibold">{bond?.subject}</p>
                                                </div>
                                                <div className="flex flex-col gap-[10px]">
                                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Message ID</h1>
                                                    <p className="text-[16px] font-semibold">{extractMessageId(bond?.messageId)}</p>
                                                </div>
                                                <div className="flex flex-col gap-[10px] relative">
                                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Replied</h1>
                                                    <p className="text-[16px] font-semibold">{bond?.replied !== undefined && bond?.replied !== null
                                                        ? bond.replied.toString()
                                                        : 'Not found'}</p>
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
        </>
    );
}
