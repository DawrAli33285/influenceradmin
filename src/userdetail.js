import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function UserDetail() {
    const [avatar, setAvatar] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        // Use URL.createObjectURL to preview the image
        const file = acceptedFiles[0];
        if (file) {
            setAvatar(URL.createObjectURL(file));
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        maxFiles: 1,
    });

    return (
        <div className="h-[100vh]">
            <div className="w-full overflow-x-auto bg-white rounded-[20px] mt-[20px] px-[40px] py-[40px] flex flex-col">
                <div className="flex gap-[30px] xl:flex-row flex-col">
                    <div
                        {...getRootProps()}
                        className="w-[150px] h-[150px] rounded-[100%] border-dashed border-2 border-gray-300 xl:m-0 m-auto flex items-center justify-center cursor-pointer"
                    >
                        <input {...getInputProps()} />
                        {avatar ? (
                            <img
                                src={avatar}
                                alt="avatar"
                                className="w-full h-full object-cover rounded-[100%]"
                            />
                        ) : (
                            <p className="text-center text-gray-500">Upload Avatar</p>
                        )}
                    </div>
                    <div className="xl:grid grid-cols-2 xl:w-[80%] w-full flex gap-[20px] xl:flex-row flex-col">
                        <div className="mt-[10px]">
                            <label htmlFor="firstname" className="block text-xl font-semibold text-[#272226]">First Name</label>
                            <input
                                type="text"
                                name="firstname"
                                placeholder="Enter Name"
                                className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                            />
                        </div>
                        <div className="mt-[10px]">
                            <label htmlFor="lastname" className="block text-xl font-semibold text-[#272226]">Last Name</label>
                            <input
                                type="text"
                                name="lastname"
                                placeholder="Enter Last Name"
                                className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
                <div className="xl:grid grid-cols-2  mt-[30px] w-full flex gap-[20px] xl:flex-row flex-col">
                    <div className="mt-[10px]">
                        <label htmlFor="email" className="block text-xl font-semibold text-[#272226]">Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div className="mt-[10px]">
                        <label htmlFor="phonenumber" className="block text-xl font-semibold text-[#272226]">Phone Number</label>
                        <input
                            type="phonenumber"
                            name="phonenumber"
                            placeholder="Enter Last Name"
                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                </div>
                <div className="xl:grid grid-cols-2 mt-[30px] w-full flex gap-[20px] xl:flex-row flex-col">
                    <div className="mt-[10px]">
                        <label htmlFor="usertype" className="block text-xl font-semibold text-[#272226]">UserType</label>
                        <select
                            name="usertype"
                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                        >
                            <option value="">Select User Type</option>
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                        </select>
                    </div>
                    <div className="mt-[10px]">
                        <label htmlFor="status" className="block text-xl font-semibold text-[#272226]">Status</label>
                        <select
                            name="status"
                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                        >
                            <option value="">Select Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="suspended">Suspended</option>
                        </select>
                    </div>
                </div>
                <div className="xl:grid grid-cols-2  mt-[30px] w-full flex gap-[20px] xl:flex-row flex-col">
                    <div className="mt-[10px]">
                        <label htmlFor="createdate" className="block text-xl font-semibold text-[#272226]">Account created date</label>
                        <input
                            type="date"
                            name="createdate"
                            placeholder="Creation Date"
                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    <div className="mt-[10px]">
                        <label htmlFor="lastlogin" className="block text-xl font-semibold text-[#272226]">Last Login</label>
                        <input
                            type="date"
                            name="lastlogin"
                           
                            className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                    
                </div>
                <div className="mt-[30px] w-full">
                        <label htmlFor="lastlogin" className="block text-xl font-semibold text-[#272226]">Notes/Comments</label>
                            <textarea rows={5} className="mt-4 block w-full px-3 py-4 border rounded-[20px] border-gray-300 focus:outline-none focus:ring focus:border-blue-500"></textarea>
                    </div>
            </div>
        </div>
    );
}
