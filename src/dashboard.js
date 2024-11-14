import { useEffect,useState } from "react";
import SponsorBondsBarChart from "./components/barchart";
import BondTable from "./components/bondtable";
import SellerAdminHeader from "./components/header";
import CumulativeIssuanceChart from "./components/linechart";
import SellerNotificationCards from "./components/sellercards";
import { MoonLoader } from 'react-spinners';
import TransactionChart from "./components/transactionchart";
import NewUsersChart from "./components/userchart";
import axios from "axios";
import { BASE_URL } from "./base_url";
export default function Dashboard() {
    const [state,setState]=useState({
        bondGraph:[],
       transactionGraph:[],
       usersGraph:[],
       issuanceAmount:[],
       issuers:0,
       users:0,
       buyers:0

    })
    const [loading,setLoading]=useState(true)
    const getDashboardData=async()=>{
        try{
let response=await axios.get(`${BASE_URL}/getDashboardData`)
console.log("RESPONSE IS")
console.log(response.data)
setLoading(false)
setState(response.data)
        }catch(e){

        }
    }
useEffect(()=>{
    getDashboardData();
},[])

    return (
        <>
     
        <div className={`h-[100vh] ${loading?'flex justify-center items-center':''}`}>
           {loading?<MoonLoader color="#6B33E3" size={100} />: <div className="w-full h-[100vh]  overflow-x-auto  rounded-[20px] mt-[20px] px-[20px] py-[40px]">
                <SellerNotificationCards setState={setState} state={state}/>
                <div className="w-full grid-cols-1 xl:grid-cols-2 grid gap-[20px]">
                    <div className="w-full min-h-[500px] rounded-[20px] mt-[20px] bg-white">
                        <SponsorBondsBarChart setState={setState} bondGraph={state?.bondGraph} />
                    </div>
                    <div className="w-full min-h-[500px] rounded-[20px] mt-[20px] bg-white">
                        <CumulativeIssuanceChart setState={setState} issuanceAmount={state?.issuanceAmount}/>
                    </div>
                </div>
                <div className="w-full grid-cols-1 xl:grid-cols-2 grid gap-[20px]">
                    <div className="w-full min-h-[500px] rounded-[20px] mt-[20px] bg-white">
                        <TransactionChart setState={setState} transactionGraph={state?.transactionGraph}/>
                    </div>
                    <div className="w-full min-h-[500px] rounded-[20px] mt-[20px] bg-white">
                        <NewUsersChart setState={setState} usersGraph={state?.usersGraph
}                        />
                    </div>
                </div>
                <div className="mt-[20px]">
                    <BondTable />
                </div>
            </div>}
        </div>
        </>
    )
}