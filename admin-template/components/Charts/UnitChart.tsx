import React, { useState, useEffect, Suspense } from 'react';
import { ApexOptions } from 'apexcharts';
import { Unit } from '@/app/types/unit';

const ReactApexChart = React.lazy(() => import('react-apexcharts'));


const options: ApexOptions = {
  chart: {
    type: "donut",
  },
  colors: ["#10B981", "#ED312B"],
  labels: ["Active", "Inactive"],
  legend: {
    show: true,
    position: "bottom",
  },
  plotOptions: {
    pie: {
      donut: {
        size: "65%",
        background: "transparent",
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

interface ChartProps {
  units: Unit[]
}

const UnitChart = ({
  units
}: ChartProps) => {
  const [series, setSeries] = useState<number[]>([]);

  const calculateStatusPercentage = (units: Unit[]) => {
    const totalCount = units.length;
    const activeCount = units.filter(unit => unit.status === "active").length;
    const inactiveCount = totalCount - activeCount;

    const activePercentage = Math.round((activeCount / totalCount) * 100);
    const inactivePercentage = Math.round((inactiveCount / totalCount) * 100);

    return [activePercentage, inactivePercentage]
  };


  useEffect(() => {
    setSeries(calculateStatusPercentage(units))
  }, [units])

  return (
    <div className="col-span-12 rounded-sm w-full border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Unit Status
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="unitChart" className="mx-auto flex justify-center">
          <Suspense fallback={<div>Loading Chart...</div>}>
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
            />
          </Suspense>
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {
          options.labels?.map((label, index) => (
            <div 
            key={index}
            className="w-full px-8 sm:w-1/2"
            >
              <div className="flex w-full items-center">
                <span className={`mr-2 block h-3 w-full max-w-3 rounded-full 
                  ${options.colors ? `bg-[${options.colors[index]}]` : ``}
                `}
                >
                </span>
                <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                  <span> {label} </span>
                  <span> {series[index]}% </span>
                </p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default UnitChart;
