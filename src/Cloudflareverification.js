import React from 'react'


const Cloudflareverification = () => {
  return (
    <div className="h-[100vh]">
      <div className="w-full min-h-[500px]  overflow-x-auto bg-white rounded-[20px] mt-[20px] px-[20px] py-[40px]">

        <div>
          <h2 className='text-[18px] font-semibold'>
            Cloudflare verification Services
          </h2>
          <p className='text-[16px] py-[1rem] leading-[35px]'>
          The Cloudflare Verification Services page provides you with comprehensive tools for managing security settings, verifying user identity, and safeguarding platform integrity. Through Cloudflare’s powerful security solutions, administrators can monitor and control access, validate IPs, and protect against potential threats, ensuring that all users can interact with the platform in a secure environment.
          </p>

        </div>


        <div className='py-[3rem]'>
          <h2 className='text-[18px] font-semibold'>
            Ip validation and tracking
          </h2>
          <p className='text-[16px] py-[1rem] leading-[35px]'>
          Quickly verify and track user IP addresses to monitor for suspicious activity, detect patterns, and take proactive steps to prevent unauthorized access. By examining the origin of user traffic, you can ensure that only legitimate users engage with your platform.  Leverage Cloudflare’s built-in tools to block malicious traffic, prevent DDoS attacks, and identify threats in real-time. The system automatically detects unusual access patterns and provides you with notifications to address issues promptly, keeping your data and users safe.
          </p>

        </div>

        <div>
          <h2 className='text-[18px] font-semibold'>
            Access control
          </h2>
          <p className='text-[16px] py-[1rem] leading-[35px]'>
          Manage user access by setting permissions and restricting certain IPs if necessary. With Cloudflare’s access control, you can easily designate trusted networks and detect risky connections, reinforcing secure access across all sessions.
          </p>

        </div>
      </div>
    </div>
  )
}


export default Cloudflareverification;