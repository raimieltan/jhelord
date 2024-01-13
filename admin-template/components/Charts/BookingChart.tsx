import React, { useState, useEffect, Suspense } from 'react';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';


const options: ApexOptions = {
  chart: {
    type: "donut",
  },
  colors: ["#10B981", "#ED312B", "#F0BA26"],
  labels: ["Completed", "Cancelled", "Running"],
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
  bookings: any[]
}

const BookingChart = ({
  bookings
}: ChartProps) => {
  const [series, setSeries] = useState<number[]>([]);

  const calculateBookingPercentage = (bookings: any[]) => {
    const totalCount = bookings.length;
    const completedCount = bookings.filter(booking => booking.status === "COMPLETED").length;
    const runningCount = bookings.filter(booking => booking.status === "PENDING").length;
    const cancelledCount = bookings.filter(booking => booking.status === "CANCELLED").length;


    const completedPercentage = Math.round((completedCount / totalCount) * 100);
    const runningPercentage = Math.round((runningCount / totalCount) * 100);
    const cancelledPercentage = Math.round((cancelledCount / totalCount) * 100);

    return [completedPercentage, runningPercentage, cancelledPercentage]
  };


  useEffect(() => {
    setSeries(calculateBookingPercentage(bookings))
  }, [bookings])

  return (
    <div className="col-span-12 rounded-sm w-full border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Booking Status
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="bookingChart" className="mx-auto flex justify-center">
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

export default BookingChart;
