import React from 'react'

const ManageCustomerSupport = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center">
      <div
        className="w-full h-full bg-white shadow-lg rounded-2xl p-8 overflow-auto flex flex-col"
      >
       
        <div className="grid grid-cols-2 gap-6 flex-grow">
          <div className="flex flex-col">
            <label className="text-gray-600 mb-2 font-semibold text-lg">Select User</label>
            <input
              type="text"
              className="px-6 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              placeholder="Enter user name"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 mb-2 font-semibold text-lg">Email</label>
            <input
              type="email"
              className="px-6 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              placeholder="Enter user email"
            />
          </div>
        </div>

        
        <div className="flex flex-col flex-grow">
          <label className="text-gray-600 mb-2 font-semibold text-lg">Select User</label>
          <select
            className="px-6 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          >
            <option value="" disabled selected>Select a user</option>
            <option value="Ali">Ali</option>
            <option value="Ahmed">Ahmed</option>
            <option value="Sara">Sara</option>
            <option value="Fatima">Fatima</option>
            <option value="John">John</option>
          </select>
        </div>

       
        <div className="flex flex-col flex-grow">
          <label className="text-gray-600 mb-2 font-semibold text-lg">Description</label>
          <textarea
            className="px-6 py-4 h-64 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-lg"
            placeholder="Enter detailed description"
          ></textarea>
        </div>

  
        <div className="flex justify-end gap-4 mt-auto">
          <button className="px-8 py-4 bg-gray-200 text-gray-700 text-lg rounded-lg hover:bg-gray-300 transition">
            Back
          </button>

          <button className="px-8 py-4 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition shadow-lg">
            Send Message
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageCustomerSupport;
