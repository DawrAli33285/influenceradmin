import { useParams } from "react-router-dom"
import { useDropzone } from 'react-dropzone';
import { FaUpload } from 'react-icons/fa';
import axios from "axios";
import { MoonLoader } from 'react-spinners';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "./base_url";
export default function BondDetail() {
    const [isedit, setIsEdit] = useState(false)
    const [files, setFiles] = useState([]);
    const [bond, setBond] = useState()
    const [editData,setEditData]=useState({
        title:'',
        bond_price:0,
        total_bonds:0,
        validity_number:0,
        status:'',
        issuer_id:'',
        task_type:'',
        bond_issuerance_amount:0
    })
    const [state, setState] = useState({
        mission: '',
        transaction: [],
        issuers:[]
    })
    const [loading,setLoading]=useState(true)
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
    const dummyData = [
        { bondID: 'BOND001', name: 'Bond Alpha', description: 'Corporate bond issued for project financing', issuer: 'Alpha Corp', submissionDate: '2024-01-01', bondAmount: '$5,000,000', type: 'Active' },
        { bondID: 'BOND002', name: 'Bond Beta', description: 'Government bond for infrastructure', issuer: 'Beta Government', submissionDate: '2024-02-15', bondAmount: '$10,000,000', type: 'Inactive' },
        { bondID: 'BOND003', name: 'Bond Gamma', description: 'Municipal bond for urban development', issuer: 'Gamma Municipality', submissionDate: '2024-03-10', bondAmount: '$2,500,000', type: 'Active' },
    ];

    useEffect(() => {
        getBondData();

    }, [])
let navigate=useNavigate();
    const getBondData = async () => {
        try {
            let response = await axios.get(`${BASE_URL}/get-bond/${bondid}`)
         
            setBond(response.data.bond)
            setEditData({
                title:response.data.bond.title,
                validity_number:response.data.bond.validity_number,
                status:response.data.bond.status,
                bond_issuerance_amount:response.data.bond.bond_issuerance_amount,
                issuer_id:response.data.bond.issuer_id._id,
                task_type:response.data.mission.task_type

            })

            const bondId = response.data.bond._id; 
            console.log("Bond ID:", bondId); 
            
            let sortedIssuers = response.data.issuers.sort((a, b) => {
                console.log(a)
                console.log("A ABOVE")
              console.log("Comparing:", a._id, "with", bondId);
            
              if (a?._id == bondId) {
                return -1; 
              } else if (b?._id == bondId) {
                return 1; 
              }
              return 0; 
            });
     

            setState({
                mission: response.data.mission,
                issuers:sortedIssuers,
                transaction:response.data.transaction
            })
    setLoading(false)
    console.log("ALLDATA")
            console.log(response.data)
        } catch (e) {
            if (e?.response?.data?.error) {
                toast.error(e?.response?.data?.error, { containerId: "bonddetail" })
            } else {
                toast.error("Client error please try again")
            }
        }
    }
    const edituser = () => {
        setIsEdit(true)
    }

const editnow=async()=>{
try{
let response=await axios.patch(`${BASE_URL}/update-bond/${bond?._id}`,editData)
let issuer=state.issuers.find(u=>u?._id==response.data.bond.issuer_id)
console.log("ISSUER")
console.log(issuer)
setBond({
    ...response.data.bond,
    issuer_id:issuer
    
})
setState({
    ...state,
    mission:response.data.mission,
    

})
toast.success(response.data.message,{containerId:"bonddetail"})
setIsEdit(!isedit)
}catch(e){
 if(e?.response?.data?.error){
    toast.error(e?.response?.data?.error,{containerId:"bonddetail"})
 }else{
    toast.error("Client error please try again")
 }   
}
}


useEffect(()=>{
console.log("STATE")
console.log(state)
},[state])



    return (
        <>
            <ToastContainer containerId={"bonddetail"} />
            <div className="h-[100vh]">
                <div className="w-full min-h-[500px]  overflow-x-auto bg-white rounded-[20px] mt-[20px] px-[20px] py-[40px]">
                {loading?   <div className="flex justify-center items-center">
                        <MoonLoader color="#6B33E3" size={100} />
                    </div>:<>
                   {/* first section */}
                   <div className="flex flex-col gap-[20px] w-full xl:px-[40px]">
                        <h2 className="text-[24px] font-semibold">Clean Water Initiative</h2>
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
                                        onChange={(e)=>{
                                            setEditData({
                                                ...editData,
                                                title:e.target.value
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
                                    onChange={(e)=>{
                                        setEditData({
                                            ...editData,
                                            issuer_id:e.target.value
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
                                <h1 className="text-[18px] font-semibold text-[#7E8183]">Bond Amount</h1>
                                {
                                    isedit ? <input
                                    value={editData.bond_issuerance_amount}
                                    onChange={(e)=>{
                                        setEditData({
                                            ...editData,
                                            bond_issuerance_amount:e.target.value
                                        })
                                    }}
                                        type="number"
                                        className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                    /> :
                                        <p className="text-[16px] font-semibold">${bond?.bond_issuerance_amount}</p>
                                }
                            </div>
                            <div className="flex flex-col gap-[10px]">
                                <h1 className="text-[18px] font-semibold text-[#7E8183]">Mission Details</h1>
                                {
                                    isedit ? <input
                                        type="text"
                                        value={editData.task_type}
                                        onChange={(e)=>{
                                            setEditData({
                                                ...editData,
                                                task_type:e.target.value
                                            })
                                        }}
                                        className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                                    /> :
                                        <p className="text-[16px] font-semibold">{state?.mission?.task_type}</p>
                                }
                            </div>

                            <div className="flex flex-col gap-[10px]">
                                <h1 className="text-[18px] font-semibold text-[#7E8183]">Validity Period</h1>
                                {
                                    isedit ? <>
                                    
                                    <select
    value={editData.validity_number}
    onChange={(e)=>{
       setEditData({
        ...editData,
        validity_number:e.target.value
       })
    }}
    className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
>
    <option value="">Select validity</option>
    {Array.from({ length: 16 }, (_, index) => {
        const number = index + 2; // Start from 2
        return (
            number <= 18 && ( // Restrict range to 18
                <option key={number} value={number}>
                    {number} months
                </option>
            )
        );
    })}
</select>

                                    </>
                                     :
                                        <p className="text-[16px] font-semibold">{bond?.validity_number} months</p>
                                }
                            </div>
                            <div className="flex flex-col gap-[10px]">
                                <h1 className="text-[18px] font-semibold text-[#7E8183]">Status</h1>
                                {
                                    isedit ? <>
                                   <select
    value={editData.status} 
    onChange={(e) => setEditData({ ...editData, status: e.target.value })} // Update handler if controlled component
    className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
>
    <option value="">Select status</option>
    {['PENDING', 'REJECTED', 'APPROVED', 'COMPLETED', 'WAITING FOR EXCHANGE', 'IN PROGRESS'].map((status) => (
        <option key={status} value={status}>
            {status}
        </option>
    ))}
</select>

                                    
                                    </> :
                                        <p className="text-[16px] font-semibold">{bond?.status}</p>
                                }
                            </div>


                        </div>

                    </div>
                    <div className="w-full h-[1px] bg-[#EAECF0] my-[20px]"></div>
                    {/* second section */}
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
                      {state?.transaction?.length>0?<table className="min-w-full table-auto border-gray-300 border-collapse mt-4">
                            <thead>
                                <tr className="bg-[#FDFBFD]">
                                    <th className="p-[10px] text-left border-l border-t border-gray-300">Transaction ID</th>
                                    <th className="p-[10px] text-left border-l border-t border-gray-300">Issuer</th>
                                    <th className="p-[10px] text-left border-l border-t border-gray-300">Transaction Type</th>
                                    <th className="p-[10px] text-left border-l border-t border-gray-300">Amount</th>
                                    <th className="p-[10px] text-left border-l border-t border-gray-300 border-r">Transaction Date</th>


                                </tr>
                            </thead>
                            <tbody>
                                {state?.transaction?.map((transaction, index) => (
                                    <tr key={transaction?._id} className="border-b">
                                        <td className="p-[10px] border-l border-gray-300">{transaction?.bond_id?._id}</td>
                                        <td className="p-[10px] border-l border-gray-300">{transaction?.bond_id?.issuer_id?.user_id?.username}</td>
                                        <td className="p-[10px] border-l border-gray-300">{transaction?.status}</td>
                                        <td className="p-[10px] border-l border-gray-300">{transaction?.bond_id?.bond_issuerance_amount}</td>
                                        <td className="p-[10px] border-l border-gray-300 border-r">{transaction?.createdAt ? new Date(transaction.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
}) : "N/A"}
</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>:<div className="flex justify-center items-center w-full">
                             <p>No Record Found</p>

                            </div>
                            }
                        <div className='flex justify-end w-full gap-[20px] mt-[40px]'>
                            {!isedit?<button className='border rounded-[20px] px-[20px] py-[10px] text-[#6b33e3] border-[#6b33e3]' onClick={edituser}>Edit Bond</button>:<button className='border rounded-[20px] px-[20px] py-[10px] text-[#6b33e3] border-[#6b33e3]' onClick={editnow}>Update Bond</button>}
                            {!isedit?<button onClick={()=>{
                                navigate(-1)
                            }} className='border rounded-[20px] px-[20px] py-[10px] text-red-500 border-red-500' >Cancel</button>:<button onClick={()=>{
                                setIsEdit(!isedit)
                            }} className='border rounded-[20px] px-[20px] py-[10px] text-red-500 border-red-500' >Cancel Update</button>}
                        </div>
                    </div>
                </>}
                </div>
            </div>
        </>
    )
}