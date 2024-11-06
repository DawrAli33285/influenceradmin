import BondTable from "./components/bondtable";

export default function BondManagment(){
    return (
        <div className="h-[100vh]">
          <div className="w-full min-h-[500px]  overflow-x-auto bg-white rounded-[20px] mt-[20px] px-[20px] py-[40px]">
            <BondTable />
          </div>
        </div>
      )
}