import { useParams } from "react-router-dom"
import { useDropzone } from 'react-dropzone';
import { FaUpload } from 'react-icons/fa';
import axios from "axios";
import { ToastContainer,toast } from "react-toastify";
import { useEffect, useState } from "react";
import { BASE_URL } from "./base_url";
export default function BondDetail() {
    const [files, setFiles] = useState([]);
const [bond,setBond]=useState()
const [state,setState]=useState({
    mission:'',
    transaction:''
})
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

useEffect(()=>{
getBondData();

},[])

const getBondData=async()=>{
try{
let response=await axios.get(`${BASE_URL}/get-bond/${bondid}`)
setBond(response.data.bond)
setState({
    mission:response.data.mission
})
console.log(response.data)
}catch(e){
    if(e?.response?.data?.error){
        toast.error(e?.response?.data?.error,{containerId:"bonddetail"})
    }else{
        toast.error("Client error please try again")
    }
}
}

    return (
        <>
        <ToastContainer containerId={"bonddetail"}/>
        <div className="h-[100vh]">
            <div className="w-full min-h-[500px]  overflow-x-auto bg-white rounded-[20px] mt-[20px] px-[20px] py-[40px]">
                {/* first section */}
                <div className="flex flex-col gap-[20px] w-full xl:px-[40px]">
                    <h2 className="text-[24px] font-semibold">Clean Water Initiative</h2>
                    <div className="grid xl:grid-cols-4 grid-cols-2 gap-[20px]">
                        <div className="flex flex-col gap-[10px]">
                            <h1 className="text-[18px] font-semibold text-[#7E8183]">Bond ID</h1>
                            <p className="text-[16px] font-semibold">{bondid?.slice(0,20)}...</p>
                        </div>
                        <div className="flex flex-col gap-[10px]">
                            <h1 className="text-[18px] font-semibold text-[#7E8183]">Bond Name</h1>
                            <p className="text-[16px] font-semibold">{bond?.title}</p>
                        </div>
                        <div className="flex flex-col gap-[10px]">
                            <h1 className="text-[18px] font-semibold text-[#7E8183]">Issuer</h1>
                            <p className="text-[16px] font-semibold">{bond?.issuer_id?.user_id?.username}</p>
                        </div>
                        <div className="flex flex-col gap-[10px]">
                            <h1 className="text-[18px] font-semibold text-[#7E8183]">Bond Amount</h1>
                            <p className="text-[16px] font-semibold">${bond?.total_bonds*bond?.bond_price}</p>
                        </div>
                        <div className="flex flex-col gap-[10px]">
                            <h1 className="text-[18px] font-semibold text-[#7E8183]">Mission Details</h1>
                            <p className="text-[16px] font-semibold">{state?.mission?.task_type}</p>
                        </div>
                     
                        <div className="flex flex-col gap-[10px]">
                            <h1 className="text-[18px] font-semibold text-[#7E8183]">Validity Period</h1>
                            <p className="text-[16px] font-semibold">{bond?.validity_number} months</p>
                        </div>
                        <div className="flex flex-col gap-[10px]">
                            <h1 className="text-[18px] font-semibold text-[#7E8183]">Status</h1>
                            <p className="text-[16px] font-semibold">{bond?.status}</p>
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
                    <table className="min-w-full table-auto border-gray-300 border-collapse mt-4">
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
                            {dummyData.map((user, index) => (
                                <tr key={user.id} className="border-b">
                                    <td className="p-[10px] border-l border-gray-300">{user.bondID}</td>
                                    <td className="p-[10px] border-l border-gray-300">{user.issuer}</td>
                                    <td className="p-[10px] border-l border-gray-300">{user.type}</td>
                                    <td className="p-[10px] border-l border-gray-300">{user.bondAmount}</td>
                                    <td className="p-[10px] border-l border-gray-300 border-r">{user.submissionDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
                            </> 
    )
}