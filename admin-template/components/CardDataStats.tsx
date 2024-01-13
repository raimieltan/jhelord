import React, { ReactNode } from 'react';

interface CardDataStatsProps {
  title: string;
  total: number;
  icon: ReactNode;
  status: string;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  status,
  icon,
}) => {
  let statusColor = '';

  if (status === 'Active') {
    statusColor = 'text-meta-3';
  }

  if (status === 'Inactive') {
    statusColor = 'text-meta-1';
  }

  if (status === 'In Progress') {
    statusColor = 'text-meta-6';
  }

  return (
    <div className="rounded-xl border border-stroke bg-white py-6 px-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className='flex flex-row items-center gap-x-4'>
        <div 
        className={`flex h-12 w-12 items-center justify-center p-4 rounded-full ${statusColor} bg-meta-2 dark:bg-meta-4`}>
          {icon}
        </div>

        <div>
          <span className="text-xl font-medium">{title}</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <h4 className="text-title-md font-bold text-black dark:text-white text-center">
          {total}
        </h4>
      </div>
    </div>
  );
};

export default CardDataStats;
