"use client"

import { Driver } from "@/app/types/driver";
import { useEffect, useState } from "react";


const DriverTable = () => {
  const [drivers, setDrivers] = useState<Driver[]>([])

  const fetchDrivers = async () => {
    const response = await fetch('https://jhelord-backend.onrender.com/api/drivers');
    const data = await response.json();
    console.log(data);
    setDrivers(data);
  }
  
  useEffect(() => {
    fetchDrivers();
  }, [])

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div className="py-6 px-4 md:px-6 xl:px-7.5">
      <h4 className="text-xl font-semibold text-black dark:text-white">
        Drivers
      </h4>
    </div>

    <div className="grid grid-cols-6 gap-x-12 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
      <div className="col-span-2 flex items-center">
        <p className="text-xl font-semibold">Driver Name</p>
      </div>
      <div className="col-span-2 hidden items-center sm:flex">
        <p className="text-xl font-semibold">Address</p>
      </div>
      <div className="col-span-2 flex items-center">
        <p className="text-xl font-semibold">Current Unit</p>
      </div>
      <div className="col-span-1 flex items-center">
        <p className="text-xl font-semibold">Status</p>
      </div>
      <div className="col-span-1 flex items-center">
        <p className="text-xl font-semibold">Review</p>
      </div>
    </div>

    {drivers.map((driver, key) => (
      <div
        className="grid grid-cols-6 border-t gap-x-4 border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
        key={key}
      >
        <div className="col-span-2 flex items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* <div className="h-12.5 w-15 rounded-md">
              <Image
                src={driver.image}
                width={60}
                height={50}
                alt="Product"
              />
            </div> */}
            <p className="text-md text-black dark:text-white">
              {driver.User.firstName} {driver.User.lastName}
            </p>
          </div>
        </div>
        <div className="col-span-2 hidden sm:flex">
          <p className="text-md text-black dark:text-white">
            {driver.address}
          </p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="text-md text-black dark:text-white">
            {driver.unit[driver.unit.length-1].make} {driver.unit[driver.unit.length-1].make} - {driver.unit[driver.unit.length-1].number}
          </p>
        </div>
        <div className="col-span-1 text-center items-center">
          <p className="text-md text-black dark:text-white">
            {driver.status}
          </p>
        </div>
        <div className="col-span-1 text-center items-center">
          <p className="text-md text-meta-3">
            {driver.driverReview.length}
          </p>
        </div>
      </div>
    ))}
  </div>
  );
};

export default DriverTable;
