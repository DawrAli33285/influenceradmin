import React from 'react'


const EmailserviceOverview = () => {
  return (
    <div className="h-[100vh]">
      <div className="w-full min-h-[500px]  overflow-x-auto bg-white rounded-[20px] mt-[20px] px-[20px] py-[40px]">

        <div>
          <h2 className='text-[18px] font-semibold'>
            Support links
          </h2>
          <p className='text-[16px] py-[1rem] leading-[35px]'>
          The Email Service page serves as a central hub for managing all email-based interactions with users, ensuring clear communication, verification, and efficient follow-up for a range of support activities. This service is designed to help administrators verify user email addresses, communicate vital account or transaction updates, and respond to support inquiries with ease.
          </p>

        </div>


        <div className='py-[3rem]'>
          <h2 className='text-[18px] font-semibold'>
            Purpose and benefits
          </h2>
          <p className='text-[16px] py-[1rem] leading-[35px]'>
          Email communication is a cornerstone of effective customer support, offering a reliable and direct way to reach users for important notifications, security verifications, and account assistance. This service enables administrators to perform key tasks like confirming email validity, addressing support requests, and proactively updating users on their account status. With verified email addresses, administrators can enhance both security and user engagement by ensuring that essential messages reach their intended recipients, improving response rates and user trust in the platform.
          </p>

        </div>

        <div>
          <h2 className='text-[18px] font-semibold'>
            User verification
          </h2>
          <p className='text-[16px] py-[1rem] leading-[35px]'>
          Email verification helps confirm that users’ contact information is accurate and secure. Through one-click verification, administrators can prompt users to confirm their email addresses, reducing the risk of fraudulent activity and ensuring communication goes to the correct recipient.
          </p>

        </div>
      </div>
    </div>
  )
}


export default EmailserviceOverview;