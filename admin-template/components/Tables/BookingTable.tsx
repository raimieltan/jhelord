"use client"

import { Booking } from "@/app/types/booking";
import { useEffect, useState } from "react";


const BookingTable = () => {
  const [bookings, setBookings] = useState<Booking[]>([])

  const fetchBookings = async () => {
    const response = await fetch('https://jhelord-backend.onrender.com/api/bookings');
    // const response = await fetch('https://jhelord-backend.onrender.com/api/bookings');
    const data = await response.json();
    console.log(data);
    setBookings(data);
  }

  useEffect(() => {
    fetchBookings();
  }, [])

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Bookings
        </h4>
      </div>

      <div className="grid grid-cols-6 gap-x-2 border-t border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5">
        <div className="col-span-1 flex items-center">
          <p className="text-md font-semibold">Driver</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-md font-semibold">Unit</p>
        </div>
        <div className="col-span-1 hidden items-center sm:flex">
          <p className="text-md font-semibold">Number</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-md font-semibold">Customer</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-md font-semibold">Contact Number</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="text-md font-semibold">Status</p>
        </div>
      </div>

      {bookings.map((booking, key) => (
        <div
          className="grid grid-cols-6 border-t gap-x-2 border-stroke py-4.5 px-4 dark:border-strokedark md:px-6 2xl:px-7.5"
          key={key}
        >
          <div className="col-span-1 flex items-center">
              <p className="text-md text-black dark:text-white">
                {booking.driver.User.firstName} {booking.driver.User.lastName}
              </p>
          </div>
          <div className="col-span-1 hidden sm:flex">
            <p className="text-md text-black dark:text-white">
              {
                booking.driver.unit.length ?
                  `${booking.driver.unit[0].make} ${booking.driver.unit[0].model}` :
                  'N/A'
              }
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-md text-black dark:text-white">
              {
                booking.driver.unit.length ?
                  `${booking.driver.unit[0].number}` :
                  'N/A'
              }
            </p>
          </div>
          <div className="col-span-1 items-center mr-4">
            <p className="text-md text-black dark:text-white">
              {booking.User.username}
            </p>
          </div>
          <div className="col-span-1 items-center">
            <p className="text-md text-black dark:text-white">
              {booking.User.phoneNumber}
            </p>
          </div>
          <div className="col-span-1 items-center">
            <p className="text-md text-meta-3">
              {booking.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingTable;
