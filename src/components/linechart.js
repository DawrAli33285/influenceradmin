import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, ResponsiveContainer } from 'recharts';

const data = [
    { name: '10', value: 12 },
    { name: '20', value: 18 },
    { name: '30', value: 22 },
    { name: '40', value: 28 },
    { name: '50', value: 24 },
    { name: '60', value: 27 },
    { name: '70', value: 30 },
    { name: '80', value: 29 },
];

const CumulativeIssuanceChart = ({issuanceAmount}) => {
    return (
        <div className="w-full px-[20px] py-[20px]">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Cumulative Issuance Amount
                </h2>
             
            </div>
            <div className='bg-[#E4E5E7] h-[1px] w-full my-[20px]'></div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={issuanceAmount} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 14 }} />
                    <YAxis
                        tick={{ fontSize: 12 }}
                        domain={[10, 30]}
                        ticks={[10, 15, 20, 25, 30]}
                    />
                    <Tooltip cursor={{ fill: '#F2F7FF' }} />
                    <Area type="monotone" dataKey="value" fill="#F2F7FF" stroke="none" />
                    <Line type="monotone" dataKey="value" stroke="#6B33E3" strokeWidth={8} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CumulativeIssuanceChart;
