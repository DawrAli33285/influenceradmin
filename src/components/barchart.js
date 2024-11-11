import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 120 },
  { name: 'Feb', value: 210 },
  { name: 'Mar', value: 320 },
  { name: 'Apr', value: 150 },
  { name: 'May', value: 180 },
  { name: 'Jun', value: 240 },
  { name: 'Jul', value: 270 },
];

const SponsorBondsBarChart = () => {
  return (
    <div className="w-full px-[20px] py-[20px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Sponsor Bonds Data Visualization
        </h2>
        <select className="bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded">
          <option>30 days</option>
          <option>60 days</option>
          <option>90 days</option>
        </select>
      </div>
        <div className='bg-[#E4E5E7] h-[1px] w-full my-[20px]'></div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }} barCategoryGap="40%">
          <XAxis dataKey="name" tick={{ fontSize: 14 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            domain={[0, 400]}
            ticks={[0, 100, 200, 300, 400]}
          />
          <Tooltip cursor={{ fill: '#F2F7FF' }} />
          <Bar
            dataKey="value"
            fill="#6B33E3"
            background={{ fill: '#F2F7FF' }}
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SponsorBondsBarChart;
