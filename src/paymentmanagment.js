import BondTable from "./components/bondtable";
import PaymentTable from "./components/paymenttable";

export default function PaymentManagment(){
    return (
        <div className="h-[100vh]">
          <div className="w-full min-h-[500px]  overflow-x-auto bg-white rounded-[20px] mt-[20px] px-[20px] py-[40px]">
            <PaymentTable />
          </div>
        </div>
      )
}