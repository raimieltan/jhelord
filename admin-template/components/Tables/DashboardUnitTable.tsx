"use client"

import { Unit } from "@/app/types/unit";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";

interface UnitTableProps {
  units: Unit[]
}

const DashboardUnitTable = ({
  units,
}: UnitTableProps) => {

  const ITEMS_PER_PAGE = 4; // Set the number of items you want per page
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginatedData, setPaginatedData] = useState<Unit[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Calculate the index of the first and last items on the current page
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // Set the data for the current page
    setPaginatedData(units.slice(startIndex, endIndex));
  }, [currentPage, units]);

  // Function to handle page change
  // const handlePageChange = (newPage: number) => {
  //   setCurrentPage(newPage);
  // };

  // Calculate total number of pages
  const totalPages = Math.ceil(units.length / ITEMS_PER_PAGE);

  const goToPreviousPage = () => {
    setCurrentPage(currentPage => Math.max(1, currentPage - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage => Math.min(totalPages, currentPage + 1));
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Units
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Driver
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Number
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Model
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Status
            </h5>
          </div>
        </div>
      </div>

      {paginatedData.map((unit, key) => (
        <div
          className={`grid grid-cols-4 sm:grid-cols-4 ${key === units.length - 1
            ? ""
            : "border-b border-stroke dark:border-strokedark hover:bg-meta-4 transition-all"
            }`}
          key={key}
          onClick={() => { router.push(`profile/${unit.driver.User.id}`) }}
        >
          <div
            className="flex items-center justify-between p-2.5 xl:p-5 sm:justify-start"
          >
            {/* TODO: Driver Image */}
            <div className="overflow-hidden mr-4">
              <Image
                src={`https://jhelord-backend.onrender.com/${unit.driver.User.profileImage?.slice(4)}`}
                alt="Driver" 
                width={40} 
                height={10} 
                // layout="fill" 
                // objectFit="cover" 
              />
            </div>
            <p className="text-black dark:text-white">
              {unit.driver.User.firstName} {unit.driver.User.lastName}
            </p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-black dark:text-white">{unit.number}</p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className="text-black dark:text-white">
              {unit.make} {unit.model}
            </p>
          </div>

          <div className="flex items-center justify-center p-2.5 xl:p-5">
            <p className={`${unit.status === 'ACTIVE' ? "text-meta-3" : "text-meta-1"}`}>{unit.status}</p>
          </div>
        </div>

      ))}

      {/* Pagination controls */}
      <div className="flex justify-end mt-4 items-center gap-x-8 m-2">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="mx-1 px-3 py-1"
        >
          <FaArrowLeft />
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="mx-1 px-3 py-1"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default DashboardUnitTable;
