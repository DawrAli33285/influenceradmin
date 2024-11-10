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
    const [cancellationData,setCancellationData]=useState([])
    const rejectBond = async() => {
        try{
let response=await axios.get(`${BASE_URL}/cancelBond/${paymentid}`)
toast.success(response?.data?.message)  
navigate(-1)
        }catch(e){
            if(e?.response?.data?.error){
                toast.error(e?.response?.data?.error,{containerId:"paymentdetail"})
            }else{
                toast.error("Client error please try again",{containerId:"paymentdetail"})
            }
        }
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
        transaction: [],
        cancellation:'',
        issuers: []
    })
    const [loading, setLoading] = useState(true)
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
    const {paymentid}=params;
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
                task_type: "2024-11-01" 
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

  const getSingleCancellation=async()=>{
    try{
let response=await axios.get(`${BASE_URL}/getSingleCancellation/${paymentid}`)
   console.log("GET SINGLE CANCELLATION")
   setState({
    cancellation:response.data.cancellation,
    transaction:response.data.transactions
   })
   setLoading(!loading)
console.log(response.data)
}catch(e){
if(e?.response?.data?.error){
    toast.error(e?.response?.data?.error,{containerId:"paymentdetail"})
}else{
    toast.error("Client error please try again",{containerId:"paymentdetail"})
}
    }
  }


useEffect(()=>{
getSingleCancellation();
},[])

const rejectCancellation=async()=>{
try{
let response=await axios.get(`${BASE_URL}/rejectCancellation/${paymentid}`)
toast.success(response.data.message,{containerId:"paymentdetail"})
navigate('/paymentmanagement')
}catch(e){
    if(e?.response?.data?.error){
        toast.error(e?.response?.data?.error,{containerId:"paymentdetail"})
    }else{
        toast.error("Client error please try again",{containerId:"paymentdetail"})
    }
}
}


    return (
        <>
            <ToastContainer containerId={"paymentdetail"} />
            <div className="h-[100vh]">
                <div className="w-full min-h-[500px]  overflow-x-auto bg-white rounded-[20px] mt-[20px] px-[20px] py-[40px]">
                    {loading ? <div className="flex justify-center items-center">
                        <MoonLoader color="#6B33E3" size={100} />
                    </div> : <>
                        
                        <div className="flex flex-col gap-[20px] w-full xl:px-[40px]">
                            <h2 className="text-[24px] font-semibold">Bond information</h2>
                            <div className="grid xl:grid-cols-4 grid-cols-2 gap-[20px]">
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Bond ID</h1>
                                    <p className="text-[16px] font-semibold">{state?.cancellation?._id?.slice(0, 20)}...</p>
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
                                        /> : <p className="text-[16px] font-semibold">{state?.cancellation?.bond_id?.title}</p>
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
                                            <p className="text-[16px] font-semibold">{state?.cancellation?.bond_id?.issuer_id?.user_id?.username}</p>

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
                                            <p className="text-[16px] font-semibold">{state?.cancellation?.bond_id?.status}</p>
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
<p className="text-[16px] font-semibold">
  {new Date(state?.cancellation?.bond_id?.createdAt).toLocaleDateString('en-us',{
    month:'long',
    day:'numeric',
    year:'numeric'
  })}
</p>

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
                                            <p className="text-[16px] font-semibold">{state?.cancellation?.bond_id?.bond_issuerance_amount}</p>

                                    }
                                </div>



                            </div>

                        </div>
                        <div className="w-full h-[1px] bg-[#EAECF0] my-[20px]"></div>
                      
                        <div className="flex flex-col gap-[20px] w-full xl:px-[40px]">
                            <h2 className="text-[24px] font-semibold">Cancelation request details</h2>
                            <div className="grid xl:grid-cols-4 grid-cols-2 gap-[20px]">
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Bond ID</h1>
                                    <p className="text-[16px] font-semibold">{state?.cancellation?._id?.slice(0, 20)}...</p>
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
                                        /> : <p className="text-[16px] font-semibold">{state?.cancellation?.buyer_id?.slice(0,20)}...</p>
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
                                            <p className="text-[16px] font-semibold">{new Date(state?.cancellation?.createdAt).toLocaleDateString()}</p>

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
                                            <p className="text-[16px] font-semibold">${state?.cancellation?.bond_id?.bond_issuerance_amount}</p>
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
                                            <p className="text-[16px] font-semibold">{new Date(state?.cancellation?.bond_id?.createdAt).toLocaleDateString('en-us',{
                                                month:'long',
                                                day:'numeric',
                                                year:'numeric'
                                            })}</p>
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
                                            <p className="text-[16px] font-semibold">{state?.cancellation?.status}</p>

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
                                            <p className="text-[16px] font-semibold">{state?.cancellation?.reason}</p>

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
                                            <p className="text-[16px] font-semibold">{state?.cancellation?.description}</p>

                                    }
                                </div>
                            </div>

                        </div>
                        <div className="flex flex-col gap-[20px] w-full xl:px-[40px]">
                            <h2 className="text-[24px] font-semibold">Issuer contact information</h2>
                            <div className="grid xl:grid-cols-4 grid-cols-2 gap-[20px]">
                                <div className="flex flex-col gap-[10px]">
                                    <h1 className="text-[18px] font-semibold text-[#7E8183]">Issuer name</h1>
                                    <p className="text-[16px] font-semibold">{state?.cancellation?.bond_id?.issuer_id?.user_id?.username}</p>
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
                                        /> : <p className="text-[16px] font-semibold">{state?.cancellation?.bond_id?.issuer_id?.user_id?.email}</p>
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
                                            <p className="text-[16px] font-semibold">{state?.cancellation?.bond_id?.issuer_id?.user_id?.country_code_id?.country_code+state?.cancellation?.bond_id?.issuer_id?.user_id?.mobile_number}</p>}
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
                                    {state?.transaction?.map((user, index) => (
                                        <tr key={user.id} className="border-b">
                                            <td className="p-[10px] border-l border-gray-300">{user?._id}</td>
                                            <td className="p-[10px] border-l border-gray-300">{new Date(user?.createdAt).toLocaleDateString('en-us',{
                                                month:'long',
                                                day:'numeric',
                                                year:'numeric'
                                            })}</td>
                                            <td className="p-[10px] border-l border-gray-300">{user?.payment_method_id?.method_name}</td>
                                            <td className="p-[10px] border-l border-gray-300">${user?.bond_id?.bond_issuerance_amount}</td>
                                            <td className="p-[10px] border-l border-gray-300 border-r">{user?.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> : <div className="flex justify-center items-center w-full">
                                <p>No Record Found</p>

                            </div>
                            }
                            <div className='flex justify-end w-full gap-[20px] mt-[40px]'>
                                <button className='border rounded-[20px] px-[20px] py-[10px] text-red-500 border-red-500' onClick={rejectCancellation}>Reject Cancellation</button>
                                <button className='border rounded-[20px] px-[20px] py-[10px] text-[#6b33e3] border-[#6b33e3]' onClick={rejectBond}>Approve Canellation</button>

                            </div>
                        </div>
                    </>}
                </div>
             
            </div>
        </>
    )
}