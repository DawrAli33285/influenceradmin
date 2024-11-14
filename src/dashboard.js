import SponsorBondsBarChart from "./components/barchart";
import BondTable from "./components/bondtable";
import SellerAdminHeader from "./components/header";
import CumulativeIssuanceChart from "./components/linechart";
import SellerNotificationCards from "./components/sellercards";
import TransactionChart from "./components/transactionchart";
import NewUsersChart from "./components/userchart";

export default function Dashboard() {
    return (
        <div className="h-[100vh]">
            <div className="w-full h-[100vh]  overflow-x-auto  rounded-[20px] mt-[20px] px-[20px] py-[40px]">
                <SellerNotificationCards />
                <div className="w-full grid-cols-1 xl:grid-cols-2 grid gap-[20px]">
                    <div className="w-full min-h-[500px] rounded-[20px] mt-[20px] bg-white">
                        <SponsorBondsBarChart />
                    </div>
                    <div className="w-full min-h-[500px] rounded-[20px] mt-[20px] bg-white">
                        <CumulativeIssuanceChart />
                    </div>
                </div>
                <div className="w-full grid-cols-1 xl:grid-cols-2 grid gap-[20px]">
                    <div className="w-full min-h-[500px] rounded-[20px] mt-[20px] bg-white">
                        <TransactionChart />
                    </div>
                    <div className="w-full min-h-[500px] rounded-[20px] mt-[20px] bg-white">
                        <NewUsersChart />
                    </div>
                </div>
                <div className="mt-[20px]">
                    <BondTable />
                </div>
            </div>
        </div>
    )
}