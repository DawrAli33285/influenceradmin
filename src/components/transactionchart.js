import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', value: 300 },
    { name: 'Feb', value: 800 },
    { name: 'Mar', value: 1200 },
    { name: 'Apr', value: 900 },
    { name: 'May', value: 1000 },
    { name: 'Jun', value: 1100 },
    { name: 'Jul', value: 1500 },
    { name: 'Aug', value: 1300 },
];

const TransactionChart = () => {
    return (
        <div className="w-full px-[20px] py-[20px]">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Sponsor Bond Transactions
                </h2>
                <select className="bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded">
                    <option>30 days</option>
                    <option>60 days</option>
                    <option>90 days</option>
                </select>
            </div>
            <div className="bg-[#E4E5E7] h-[1px] w-full my-[20px]"></div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        domain={[0, 1500]}
                        ticks={[0, 500, 1000, 1500]}
                    />
                    <Tooltip cursor={{ fill: '#F2F7FF' }} />
                    <Area type="monotone" dataKey="value" fill="#F2F7FF" stroke="none" />
                    <Line type="monotone" dataKey="value" stroke="#6B33E3" strokeWidth={4} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TransactionChart;
