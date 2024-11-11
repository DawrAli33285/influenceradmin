import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', bottom: 800, middle: 600, top: 400 },
    { name: 'Feb', bottom: 900, middle: 700, top: 600 },
    { name: 'Mar', bottom: 1000, middle: 900, top: 800 },
    { name: 'Apr', bottom: 700, middle: 500, top: 300 },
    { name: 'May', bottom: 900, middle: 800, top: 700 },
    { name: 'Jun', bottom: 800, middle: 700, top: 500 },
    { name: 'Jul', bottom: 1200, middle: 1000, top: 800 },
    { name: 'Aug', bottom: 1000, middle: 900, top: 600 },
];

const NewUsersChart = () => {
    return (
        <div className="w-full px-[20px] py-[20px]">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    New Users Registered
                </h2>
                <select className="bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded">
                    <option>30 days</option>
                    <option>60 days</option>
                    <option>90 days</option>
                </select>
            </div>
            <div className="bg-[#E4E5E7] h-[1px] w-full my-[20px]"></div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                    <YAxis tick={{ fontSize: 12 }} domain={[0, 3000]} ticks={[0, 1000, 2000, 3000]} />
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
