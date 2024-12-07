import BondTable from "./components/bondtable";
import MissionSubmissionTable from "./components/missionsubmissiontable";

export default function MissionSubmission(){
    return (
        <div className="h-[100vh]">
          <div className="w-full min-h-[500px]  overflow-x-auto bg-white rounded-[20px] mt-[20px] px-[20px] py-[40px]">
            <MissionSubmissionTable />
          </div>
        </div>
      )
}