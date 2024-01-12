"use client"

import { Unit } from "@/app/types/unit";
import { useEffect, useState } from "react";


const UnitTable = () => {
  const [units, setUnits] = useState<Unit[]>([])

  const fetchUnits = async () => {
    const response = await fetch('http://localhost:8000/api/units');
    const data = await response.json();
    console.log(data);
    setUnits(data);
  }

  useEffect(() => {
    fetchUnits();
  }, [])

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Units
        </h4>
      </div>

      <div className="grid grid-cols-6 border-t gap-x-2 border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-2 flex items-center">
          <p className="text-xl font-semibold">Model</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-xl font-semibold">Number</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="text-xl font-semibold">Plate Number</p>
        </div>
        <div className="col-span-2 flex items-center">
          <p className="text-xl font-semibold">Status</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-xl font-semibold">Current Driver</p>
        </div>
      </div>

      {units.map((unit, key) => (
        <div
          className="grid grid-cols-6 border-t gap-x-2 border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-2 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* <div className="h-12.5 w-15 rounded-md">
              <Image
                src={unit.image}
                width={60}
                height={50}
                alt="Product"
              />
            </div> */}
              <p className="text-md text-black dark:text-white">
                {unit.make} {unit.model}
              </p>
            </div>
          </div>
          <div className="col-span-1 hidden sm:flex">
            <p className="text-md text-black dark:text-white">
              {unit.number}
            </p>
          </div>
          <div className="col-span-2 items-center">
            <p className="text-md text-black dark:text-white">
              {unit.plateNumber}
            </p>
          </div>
          <div className="col-span-2 items-center">
            <p className="text-md text-black dark:text-white">
              {unit.status}
            </p>
          </div>
          <div className="col-span-1 items-center">
            <p className="text-md text-meta-3">
              {unit.driver.firstName} {unit.driver.firstName}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UnitTable;
