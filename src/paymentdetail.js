import { useParams } from "react-router-dom"
import { useDropzone } from 'react-dropzone';
import { FaUpload } from 'react-icons/fa';
import axios from "axios";
import { MoonLoader } from 'react-spinners';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "./base_url";
export default function PaymentDetail() {
    const [isedit, setIsEdit] = useState(false)
    const [rejectpopup, setRejectPopup] = useState(false)
    const [files, setFiles] = useState([]);
    const [bond, setBond] = useState()
    const rejectionpopup = () => {
        setRejectPopup(!rejectpopup)
    }
    const [rejectionReason, setRejectionReason] = useState('');
    const [note, setNote] = useState('');

    const handleSendMessage = () => {
        
    };
    const [editData, setEditData] = useState({
        title: '',
        bond_price: 0,
        total_bonds: 0,
        validity_number: 0,
        status: '',
        issuer_id: '',
        task_type: '',
        bond_issuerance_amount: 0
    })
    const [state, setState] = useState({
        mission: '',
        transaction: '',
        issuers: []
    })
    const [loading, setLoading] = useState(false)
    const onDrop = (acceptedFiles) => {
        const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
        setFiles(prevFiles => [...prevFiles, ...pdfFiles]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'application/pdf',
        multiple: true
    });
    const params = useParams();
    const { bondid } = params
    const dummyData = {
        bondid: "BND12345678901234567890", // Bond ID, sliced to show only first 20 characters
        bond: {
            title: "Municipal Bond 2024",
            issuer_id: {
                user_id: {
                    username: "IssuerCompany123"
                }
            },
            total_bonds: 1000,
            bond_price: 50 // Assuming each bond is priced at $50
        },
        editData: {
            title: "Municipal Bond 2024", // Editable bond title
            issuer_id: "IssuerCompany123", // Editable issuer ID
            bond_issuerance_amount: 50000, // Editable issuance amount
            task_type: "2024-11-01" // Editable issuance date
        },
        isedit: true, // Toggle for edit mode
        state: {
            issuers: [
                {
                    _id: "Issuer1",
                    user_id: {
                        username: "IssuerCompany123"
                    }
                },
                {
                    _id: "Issuer2",
                    user_id: {
                        username: "BondCorporation"
                    }
                },
                {
                    _id: "Issuer3",
                    user_id: {
                        username: "FinancialPartners"
                    }
                }
            ],
            mission: {
                task_type: "2024-11-01" // Task type, in this case, a date
            }
        }
    };

    const dummyDatatbl = [
        { bondID: 'BOND001', name: 'Bond Alpha', description: 'Corporate bond issued for project financing', issuer: 'Alpha Corp', submissionDate: '2024-01-01', bondAmount: '$5,000,000', type: 'Active' },
        { bondID: 'BOND002', name: 'Bond Beta', description: 'Government bond for infrastructure', issuer: 'Beta Government', submissionDate: '2024-02-15', bondAmount: '$10,000,000', type: 'Inactive' },
        { bondID: 'BOND003', name: 'Bond Gamma', description: 'Municipal bond for urban development', issuer: 'Gamma Municipality', submissionDate: '2024-03-10', bondAmount: '$2,500,000', type: 'Active' },
    ];


    let navigate = useNavigate();

    const edituser = () => {
        setIsEdit(true)
    }

    const editnow = async () => {
        try {
            let response = await axios.patch(`${BASE_URL}/update-bond/${bond?._id}`, editData)
            let issuer = state.issuers.find(u => u?._id == response.data.bond.issuer_id)
            console.log("ISSUER")
            console.log(issuer)
            setBond({
                ...response.data.bond,
                issuer_id: issuer

            })
            setState({
                ...state,
                mission: response.data.mission
            })
            toast.success(response.data.message, { containerId: "bonddetail" })
            setIsEdit(!isedit)
        } catch (e) {
            if (e?.response?.data?.error) {
                toast.error(e?.response?.data?.error, { containerId: "bonddetail" })
            } else {
                toast.error("Client error please try again")
            }
        }
    }

    return (
        <>
            <ToastContainer containerId={"bonddetail"} />
            <div className="h-[100vh]">
                <div className="w-full min-h-[500px]  overflow-x-auto bg-white rounded-[20px] mt-[20px] px-[20px] py-[40px]">
                    {loading ? <div className="flex justify-center items-center">
                        <MoonLoader color="#6B33E3" size={100} />
                    </div> : <>
                        {/* first section */}
                        <div className="flex flex-col gap-[20px] w-full xl:px-[40px]">
                            <h2 className="text-[24px] font-semibold">Bond information</h2>
                            <div className="grid xl:grid-cols-4 grid-cols-2 gap-[20px]">
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Bond ID</h1>
                                    <p className="text-[16px] font-semibold">{bondid?.slice(0, 20)}...</p>
                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Bond Name</h1>
                                    {
                                        isedit ? <input
                                            type="text"
                                            value={editData.title}
                                            onChange={(e) => {
                                                setEditData({
                                                    ...editData,
                                                    title: e.target.value
                                                })
                                            }}
                                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                        /> : <p className="text-[16px] font-semibold">{bond?.title}</p>
                                    }

                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Issuer</h1>
                                    {
                                        isedit ? <select
                                            value={editData.issuer_id}
                                            onChange={(e) => {
                                                setEditData({
                                                    ...editData,
                                                    issuer_id: e.target.value
                                                })
                                            }}
                                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                        >
                                            {state?.issuers
                                                ?.sort((a, b) => {

                                                    if (a._id === bond.issuer_id._id) return -1;
                                                    if (b._id === bond.issuer_id._id) return 1;
                                                    return 0;
                                                })
                                                .map((val, i) => (
                                                    <option key={val._id} value={val._id}>
                                                        {val?.user_id?.username}
                                                    </option>
                                                ))}
                                        </select>
                                            :
                                            <p className="text-[16px] font-semibold">{bond?.issuer_id?.user_id?.username}</p>

                                    }
                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Bond Type</h1>
                                    {
                                        isedit ? <input
                                            value={editData.bond_issuerance_amount}
                                            onChange={(e) => {
                                                setEditData({
                                                    ...editData,
                                                    bond_issuerance_amount: e.target.value
                                                })
                                            }}
                                            type="number"
                                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                        /> :
                                            <p className="text-[16px] font-semibold">${bond?.total_bonds * bond?.bond_price}</p>
                                    }
                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Issuance Date</h1>
                                    {
                                        isedit ? <input
                                            type="date"
                                            value={editData.task_type}
                                            onChange={(e) => {
                                                setEditData({
                                                    ...editData,
                                                    task_type: e.target.value
                                                })
                                            }}
                                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                        /> :
                                            <p className="text-[16px] font-semibold">{state?.mission?.task_type}</p>
                                    }
                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Total Issuance Amount</h1>
                                    {
                                        isedit ? <select
                                            value={editData.issuer_id}
                                            onChange={(e) => {
                                                setEditData({
                                                    ...editData,
                                                    issuer_id: e.target.value
                                                })
                                            }}
                                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                        >
                                            {state?.issuers
                                                ?.sort((a, b) => {

                                                    if (a._id === bond.issuer_id._id) return -1;
                                                    if (b._id === bond.issuer_id._id) return 1;
                                                    return 0;
                                                })
                                                .map((val, i) => (
                                                    <option key={val._id} value={val._id}>
                                                        {val?.user_id?.username}
                                                    </option>
                                                ))}
                                        </select>
                                            :
                                            <p className="text-[16px] font-semibold">{bond?.issuer_id?.user_id?.username}</p>

                                    }
                                </div>



                            </div>

                        </div>
                        <div className="w-full h-[1px] bg-[#EAECF0] my-[20px]"></div>
                        {/* second section */}
                        <div className="flex flex-col gap-[20px] w-full xl:px-[40px]">
                            <h2 className="text-[24px] font-semibold">Cancelation request details</h2>
                            <div className="grid xl:grid-cols-4 grid-cols-2 gap-[20px]">
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Bond ID</h1>
                                    <p className="text-[16px] font-semibold">{bondid?.slice(0, 20)}...</p>
                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Request ID</h1>
                                    {
                                        isedit ? <input
                                            type="text"
                                            value={editData.title}
                                            onChange={(e) => {
                                                setEditData({
                                                    ...editData,
                                                    title: e.target.value
                                                })
                                            }}
                                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                        /> : <p className="text-[16px] font-semibold">{bond?.title}</p>
                                    }

                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Requested Date</h1>
                                    {
                                        isedit ? <select
                                            value={editData.issuer_id}
                                            onChange={(e) => {
                                                setEditData({
                                                    ...editData,
                                                    issuer_id: e.target.value
                                                })
                                            }}
                                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                        >
                                            {state?.issuers
                                                ?.sort((a, b) => {

                                                    if (a._id === bond.issuer_id._id) return -1;
                                                    if (b._id === bond.issuer_id._id) return 1;
                                                    return 0;
                                                })
                                                .map((val, i) => (
                                                    <option key={val._id} value={val._id}>
                                                        {val?.user_id?.username}
                                                    </option>
                                                ))}
                                        </select>
                                            :
                                            <p className="text-[16px] font-semibold">{bond?.issuer_id?.user_id?.username}</p>

                                    }
                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Cancellation Amount</h1>
                                    {
                                        isedit ? <input
                                            value={editData.bond_issuerance_amount}
                                            onChange={(e) => {
                                                setEditData({
                                                    ...editData,
                                                    bond_issuerance_amount: e.target.value
                                                })
                                            }}
                                            type="number"
                                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                        /> :
                                            <p className="text-[16px] font-semibold">${bond?.total_bonds * bond?.bond_price}</p>
                                    }
                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Issuance Date</h1>
                                    {
                                        isedit ? <input
                                            type="date"
                                            value={editData.task_type}
                                            onChange={(e) => {
                                                setEditData({
                                                    ...editData,
                                                    task_type: e.target.value
                                                })
                                            }}
                                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                        /> :
                                            <p className="text-[16px] font-semibold">{state?.mission?.task_type}</p>
                                    }
                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Status</h1>
                                    {
                                        isedit ? <select
                                            value={editData.issuer_id}
                                            onChange={(e) => {
                                                setEditData({
                                                    ...editData,
                                                    issuer_id: e.target.value
                                                })
                                            }}
                                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                        >
                                            {state?.issuers
                                                ?.sort((a, b) => {

                                                    if (a._id === bond.issuer_id._id) return -1;
                                                    if (b._id === bond.issuer_id._id) return 1;
                                                    return 0;
                                                })
                                                .map((val, i) => (
                                                    <option key={val._id} value={val._id}>
                                                        {val?.user_id?.username}
                                                    </option>
                                                ))}
                                        </select>
                                            :
                                            <p className="text-[16px] font-semibold">{bond?.issuer_id?.user_id?.username}</p>

                                    }
                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Reason of cancellation</h1>
                                    {
                                        isedit ? <select
                                            value={editData.issuer_id}
                                            onChange={(e) => {
                                                setEditData({
                                                    ...editData,
                                                    issuer_id: e.target.value
                                                })
                                            }}
                                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                        >
                                            {state?.issuers
                                                ?.sort((a, b) => {

                                                    if (a._id === bond.issuer_id._id) return -1;
                                                    if (b._id === bond.issuer_id._id) return 1;
                                                    return 0;
                                                })
                                                .map((val, i) => (
                                                    <option key={val._id} value={val._id}>
                                                        {val?.user_id?.username}
                                                    </option>
                                                ))}
                                        </select>
                                            :
                                            <p className="text-[16px] font-semibold">{bond?.issuer_id?.user_id?.username}</p>

                                    }
                                </div>

                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Additional notes from issuer</h1>
                                    {
                                        isedit ? <select
                                            value={editData.issuer_id}
                                            onChange={(e) => {
                                                setEditData({
                                                    ...editData,
                                                    issuer_id: e.target.value
                                                })
                                            }}
                                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                        >
                                            {state?.issuers
                                                ?.sort((a, b) => {

                                                    if (a._id === bond.issuer_id._id) return -1;
                                                    if (b._id === bond.issuer_id._id) return 1;
                                                    return 0;
                                                })
                                                .map((val, i) => (
                                                    <option key={val._id} value={val._id}>
                                                        {val?.user_id?.username}
                                                    </option>
                                                ))}
                                        </select>
                                            :
                                            <p className="text-[16px] font-semibold">{bond?.issuer_id?.user_id?.username}</p>

                                    }
                                </div>
                            </div>

                        </div>
                        <div className="flex flex-col gap-[20px] w-full xl:px-[40px]">
                            <h2 className="text-[24px] font-semibold">Issuer contact information</h2>
                            <div className="grid xl:grid-cols-4 grid-cols-2 gap-[20px]">
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Issuer name</h1>
                                    <p className="text-[16px] font-semibold">{bondid?.slice(0, 20)}...</p>
                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Email</h1>
                                    {
                                        isedit ? <input
                                            type="text"
                                            value={editData.title}
                                            onChange={(e) => {
                                                setEditData({
                                                    ...editData,
                                                    title: e.target.value
                                                })
                                            }}
                                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                        /> : <p className="text-[16px] font-semibold">{bond?.title}</p>
                                    }

                                </div>
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Phone Number</h1>
                                    {
                                        isedit ? <select
                                            value={editData.issuer_id}
                                            onChange={(e) => {
                                                setEditData({
                                                    ...editData,
                                                    issuer_id: e.target.value
                                                })
                                            }}
                                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                        >
                                            {state?.issuers
                                                ?.sort((a, b) => {

                                                    if (a._id === bond.issuer_id._id) return -1;
                                                    if (b._id === bond.issuer_id._id) return 1;
                                                    return 0;
                                                })
                                                .map((val, i) => (
                                                    <option key={val._id} value={val._id}>
                                                        {val?.user_id?.username}
                                                    </option>
                                                ))}
                                        </select>
                                            :
                                            <p className="text-[16px] font-semibold">{bond?.issuer_id?.user_id?.username}</p>

                                    }
                                </div>
                            </div>

                        </div>
                        {/* <div className="flex flex-col gap-[20px]">
                    <h2 className="text-[24px] font-semibold">Associated Documents</h2>
                    <div
                        {...getRootProps()}
                        className="flex justify-between items-center w-full p-4 border-[#EAECF0] border rounded-lg cursor-pointer"
                        >
                        <input {...getInputProps()} />
                        <span className="text-left text-lg">Drag & drop PDF files here, or click to select files</span>
                        <FaUpload className="text-2xl" />
                    </div>

                    <div className="mt-4">
                        {files.map((file, index) => (
                            <div
                            key={index}
                            className="flex justify-between items-center w-full p-2 border-[#EAECF0] border rounded-lg mb-2"
                            >
                                <span className="text-lg">{file.name}</span>
                                <FaUpload className="text-2xl" />
                            </div>
                        ))}
                    </div>
                </div> */}
                        {/* table */}
                        <div>
                            {dummyDatatbl.length > 0 ? <table className="min-w-full table-auto border-gray-300 border-collapse mt-4">
                                <thead>
                                    <tr className="bg-[#FDFBFD]">
                                        <th className="p-[10px] text-left border-l border-t border-gray-300">Transaction ID</th>
                                        <th className="p-[10px] text-left border-l border-t border-gray-300">Transaction Date</th>
                                        <th className="p-[10px] text-left border-l border-t border-gray-300">Transaction Type</th>
                                        <th className="p-[10px] text-left border-l border-t border-gray-300">Transaction Amount</th>
                                        <th className="p-[10px] text-left border-l border-t border-gray-300 border-r">Satus</th>


                                    </tr>
                                </thead>
                                <tbody>
                                    {dummyDatatbl.map((user, index) => (
                                        <tr key={user.id} className="border-b">
                                            <td className="p-[10px] border-l border-gray-300">{user.bondID}</td>
                                            <td className="p-[10px] border-l border-gray-300">{user.issuer}</td>
                                            <td className="p-[10px] border-l border-gray-300">{user.type}</td>
                                            <td className="p-[10px] border-l border-gray-300">{user.bondAmount}</td>
                                            <td className="p-[10px] border-l border-gray-300 border-r">{user.submissionDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> : <div className="flex justify-center items-center w-full">
                                <p>No Record Found</p>

                            </div>
                            }
                            <div className='flex justify-end w-full gap-[20px] mt-[40px]'>
                                <button className='border rounded-[20px] px-[20px] py-[10px] text-red-500 border-red-500' onClick={edituser}>Reject Cancellation</button>
                                <button className='border rounded-[20px] px-[20px] py-[10px] text-[#6b33e3] border-[#6b33e3]' onClick={rejectionpopup}>Approve Canellation</button>

                            </div>
                        </div>
                    </>}
                </div>
                {
                    rejectpopup && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={rejectionpopup}>
                        <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                            <h2 className="text-[24px] font-semibold mb-4">Rejection Reason</h2>

                            <div className="mb-4">
                                <label className="text-[18px] font-semibold text-black" htmlFor="rejectionReason">
                                    Select Reason
                                </label>
                                <select
                                    id="rejectionReason"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
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
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    rows="4"
                                    className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                    placeholder="Add additional details here"
                                />
                            </div>

                            <button
                                onClick={handleSendMessage}
                                className="w-full py-3 mt-4 bg-blue-500 text-white rounded-[20px] font-semibold hover:bg-[#6b33e3]"
                            >
                                Send Message
                            </button>
                        </div>
                    </div>
                }
            </div>
        </>
    )
}