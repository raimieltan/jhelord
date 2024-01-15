
"use client";
import React, { useEffect, useState } from 'react';
import { BsPersonFillCheck } from "react-icons/bs";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { BsPersonFillX } from "react-icons/bs";
import { FaCarSide } from "react-icons/fa6";
import { FaClipboardUser } from "react-icons/fa6";
import { LuClipboardCheck } from "react-icons/lu";
import { LuClipboardPaste } from "react-icons/lu";
import { LuClipboardX } from "react-icons/lu";

import CardDataStats from "../CardDataStats";
import { Unit } from '@/app/types/unit';
import { Driver } from '@/app/types/driver';
import Map from '../Map/map';
import UnitChart from '../Charts/UnitChart';
import BookingChart from '../Charts/BookingChart';
import DashboardUnitTable from '../Tables/DashboardUnitTable';

const Dashboard = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  const fetchUnits = async () => {
    try {
      // const response = await fetch('https://jhelord-backend.onrender.com/api/units');
      const response = await fetch('https://jhelord-backend.onrender.com/api/units');
      const data = await response.json();
      setUnits(data);

    } catch (error: any) {
      console.log(error.message);
    }
  }

  const fetchDrivers = async () => {
    try {
      // const response = await fetch('https://jhelord-backend.onrender.com/api/drivers');
      const response = await fetch('https://jhelord-backend.onrender.com/api/drivers');
      const data = await response.json();
      setDrivers(data);

    } catch (error: any) {
      console.log(error.message);
    }
  }

  const fetchBookings = async () => {
    try {
      // const response = await fetch('https://jhelord-backend.onrender.com/api/bookings');
      const response = await fetch('https://jhelord-backend.onrender.com/api/bookings');
      const data = await response.json();
      setBookings(data);

    } catch (error: any) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    const startFetching = () => {
      fetchUnits();
      fetchDrivers();
      fetchBookings();
    };

    // Start fetching immediately on component mount
    startFetching();

    // Set an interval to fetch data every 30 seconds
    const intervalId = setInterval(startFetching, 30000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [])

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Registered Drivers"
          total={drivers ? drivers.length : 0}
          status="Active"
          icon={<BsFillPersonVcardFill />}
        />

        <CardDataStats
          title="Active Units"
          total={units ? units.filter(unit =>
            unit.status === "ACTIVE"
          ).length : 0}
          status="Active"
          icon={<BsPersonFillCheck />}
        />

        <CardDataStats
          title="Inactive Units"
          total={units ? units.filter(unit =>
            unit.status === "INACTIVE"
          ).length : 0}
          status="Inactive"
          icon={<BsPersonFillX />}
        />

        <CardDataStats
          title="Total Units"
          total={units.length}
          status="Active"
          icon={<FaCarSide />}
        />

        <CardDataStats
          title="Total Bookings"
          total={bookings ? bookings.length : 0}
          status="Active"
          icon={<FaClipboardUser />}
        />

        <CardDataStats
          title="Completed Bookings"
          total={bookings ? bookings.filter(booking =>
            booking.status === "COMPLETED"
          ).length : 0}
          status="Active"
          icon={<LuClipboardCheck />}
        />
        <CardDataStats
          title="Running Bookings"
          total={bookings ? bookings.filter(booking =>
            booking.status === "PENDING"
          ).length : 0}
          status="In Progress"
          icon={<LuClipboardPaste />}
        />
        <CardDataStats
          title="Cancelled Bookings"
          total={bookings ? bookings.filter(booking =>
            booking.status === "CANCELLED"
          ).length : 0}
          status="Inactive"
          icon={<LuClipboardX />}
        />
      </div>

      <div className="flex h-[600px] bg-white w-full my-4">
        <Map units={units} />
        {/* <UnitMap /> */}
      </div>

      <div className="col-span-8 xl:col-span-full">
        <DashboardUnitTable units={units} />
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="flex flex-row col-span-8 gap-x-4 xl:col-span-12">
          <UnitChart units={units} />
          <BookingChart bookings={bookings} />
        </div>
      </div>
    </>
  );
};

export default Dashboard;