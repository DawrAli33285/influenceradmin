import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const NewUsersChart = ({ usersGraph }) => {
    return (
        <div className="w-full px-[20px] py-[20px]">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    New Users Registered
                </h2>
              
            </div>
            <div className="bg-[#E4E5E7] h-[1px] w-full my-[20px]"></div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usersGraph} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                    
                
                    <YAxis tick={{ fontSize: 12 }} domain={[0, 'auto']} />
                    
                    <Tooltip />

                    <Bar dataKey="bottom" stackId="a" fill="#6E39CB" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="middle" stackId="a" fill="#D3BBFE" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="top" stackId="a" fill="#A877FD" radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default NewUsersChart;
