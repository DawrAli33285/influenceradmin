
import { MoonLoader } from 'react-spinners';
export default function SellerNotificationCards({ state, loading }) {
    const filterBondCount = (filterName) => {
        return state?.bondList?.filter(bond => bond?.status === filterName)?.length

    }
    const filterMissionCount = (filterName) => {
        return state?.missionList?.filter(mission => mission?.status === filterName)?.length

    }

    return (
        <div className="w-full grid xl:grid-cols-3 md:grid-cols-2 h-fit grid-cols-1 gap-[10px]">

            {loading ? <div className='flex justify-center items-center'>
                <MoonLoader color="#6B33E3" size={100} />
            </div> : <>
                <div className="bg-white rounded-[20px] p-[20px] flex gap-[10px] custom-inset-shadow">
                    <div className="flex justify-center items-center p-[20px] rounded-[20px] bg-[#F1EBFE]">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.16666 11.9054C2.62385 12.586 1.66666 13.5344 1.66666 14.5834C1.66666 16.6545 5.39762 18.3334 9.99999 18.3334C14.6024 18.3334 18.3333 16.6545 18.3333 14.5834C18.3333 13.5344 17.3761 12.586 15.8333 11.9054M15 6.66675C15 10.0532 11.25 11.6667 9.99999 14.1667C8.74999 11.6667 4.99999 10.0532 4.99999 6.66675C4.99999 3.90532 7.23857 1.66675 9.99999 1.66675C12.7614 1.66675 15 3.90532 15 6.66675ZM10.8333 6.66675C10.8333 7.12699 10.4602 7.50008 9.99999 7.50008C9.53975 7.50008 9.16666 7.12699 9.16666 6.66675C9.16666 6.20651 9.53975 5.83341 9.99999 5.83341C10.4602 5.83341 10.8333 6.20651 10.8333 6.66675Z" stroke="#6B33E3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-[16px] text-[#344054]">Total Active Members</h1>
                        <h2 className="text-[18px] font-semibold">{state?.users}</h2>
                    </div>
                </div>
                <div className="bg-white rounded-[20px] p-[20px] flex gap-[10px] custom-inset-shadow">
                    <div className="flex justify-center items-center p-[20px] rounded-[20px] bg-[#F1EBFE]">
                        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.5 7.75L7.16667 9.41667L10.9167 5.66667M14.6667 16.5V5.5C14.6667 4.09987 14.6667 3.3998 14.3942 2.86502C14.1545 2.39462 13.7721 2.01217 13.3016 1.77248C12.7669 1.5 12.0668 1.5 10.6667 1.5H5.33334C3.9332 1.5 3.23314 1.5 2.69836 1.77248C2.22795 2.01217 1.8455 2.39462 1.60582 2.86502C1.33334 3.3998 1.33334 4.09987 1.33334 5.5V16.5L3.625 14.8333L5.70834 16.5L8 14.8333L10.2917 16.5L12.375 14.8333L14.6667 16.5Z" stroke="#6B33E3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>


                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-[16px] text-[#344054]">Total Issuer Members</h1>
                        <h2 className="text-[18px] font-semibold">{state?.issuers}</h2>
                    </div>

                </div>
                <div className="bg-white rounded-[20px] p-[20px] flex gap-[10px] custom-inset-shadow">
                    <div className="flex justify-center items-center p-[20px] rounded-[20px] bg-[#F1EBFE]">
                        <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.5 7.75L7.16667 9.41667L10.9167 5.66667M14.6667 16.5V5.5C14.6667 4.09987 14.6667 3.3998 14.3942 2.86502C14.1545 2.39462 13.7721 2.01217 13.3016 1.77248C12.7669 1.5 12.0668 1.5 10.6667 1.5H5.33334C3.9332 1.5 3.23314 1.5 2.69836 1.77248C2.22795 2.01217 1.8455 2.39462 1.60582 2.86502C1.33334 3.3998 1.33334 4.09987 1.33334 5.5V16.5L3.625 14.8333L5.70834 16.5L8 14.8333L10.2917 16.5L12.375 14.8333L14.6667 16.5Z" stroke="#6B33E3" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>


                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-[16px] text-[#344054]">Total Buyer Members</h1>
                        <h2 className="text-[18px] font-semibold">{state?.buyers}</h2>
                    </div>
                </div>

            </>}
        </div>
    )
}