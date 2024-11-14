import React,{useState} from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SponsorBondsBarChart = ({setState, bondGraph }) => {
  const [filter,setFilter]=useState("30 days")


  return (
    <div className="w-full px-[20px] py-[20px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Sponsor Bonds Data Visualization
        </h2>
     
      </div>
      <div className='bg-[#E4E5E7] h-[1px] w-full my-[20px]'></div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={bondGraph} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <XAxis dataKey="name" tick={{ fontSize: 14 }} />
          
        
          <YAxis tick={{ fontSize: 12 }} domain={[0, 'auto']} />

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
