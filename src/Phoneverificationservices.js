import React from 'react'


const Phoneverificationservice = () => {
        return (
                <div className="h-[100vh]">
                        <div className="w-full min-h-[500px]  overflow-x-auto bg-white rounded-[20px] mt-[20px] px-[20px] py-[40px]">

                                <div>
                                        <h2 className='text-[18px] font-semibold'>
                                                Phone verification Services
                                        </h2>
                                        <p className='text-[16px] py-[1rem] leading-[35px]'>
                                        The Phone Verification Services page provides you with the tools needed to confirm the identity and contact details of users through reliable phone-based verification methods. Verifying users’ phone numbers is a critical step in enhancing platform security, improving user account integrity, and ensuring accurate communication.
                                        </p>

                                </div>


                                <div className='py-[3rem]'>
                                        <h2 className='text-[18px] font-semibold'>
                                                Why phone verification matters
                                        </h2>
                                        <p className='text-[16px] py-[1rem] leading-[35px]'>
                                        Phone verification serves as an essential safeguard in today’s digital landscape. By confirming phone numbers, we reduce the risk of unauthorized access and fraudulent activity, enabling a more secure environment for both users and administrators. Verified contact numbers allow for effective communication in scenarios requiring urgent updates, password recovery, transaction confirmations, and other essential notifications. This approach reinforces user trust and strengthens the overall security and reliability of the platform.
                                        </p>


                                </div>

                                <div>
                                        <h2 className='text-[18px] font-semibold'>
                                                One-Time Password(OTP)verification
                                        </h2>
                                        <p className='text-[16px] py-[1rem] leading-[35px]'>
                                        Send a unique, time-sensitive code via SMS to the user’s registered phone number. The OTP must be entered by the user within a limited timeframe, providing quick and reliable verification.
                                        </p>


                                </div>
                        </div>
                </div>
        )
}


export default Phoneverificationservice;