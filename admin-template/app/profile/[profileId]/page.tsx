"use client"

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DriverBookingTable from "@/components/Tables/DriverBookingTable";
import { useEffect, useState } from "react";
import { Driver } from "../../types/driver";
import { usePathname } from "next/navigation";

const Profile = () => {
  const [driver, setDriver] = useState<Driver>();
  const driverId = usePathname().split("/")[2]

  const fetchDriver = async () => {
    const response = await fetch(`http://192.168.1.101:8000/api/drivers/${driverId}`)
    const data = await response.json();
    setDriver(data);
    console.log("RPOFLE: ", data)
  }

  useEffect(() => {
    fetchDriver();
  }, []);

  return (
    <>
      <Breadcrumb pageName="Profile" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-10 md:h-30">
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2">
              {/* <Image
                src={"/taxi-driver.png"}
                width={160}
                height={160}
                alt="profile"
              /> */}
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {driver?.User.firstName} {driver?.User.lastName}
              {/* name */}
            </h3>
            <p className="font-medium">
              {driver?.User.username}
              {/* username */}
            </p>
            <p className="font-medium">
              License: {driver?.licenseNumber}
              {/* licenseNumber */}
            </p>
            <div className="mx-auto mt-4.5 mb-5.5 grid max-w-94 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="text-sm">
                  Unit: {driver?.unit[0].number}
              </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                   {driver?.booking.length}
                </span>
                <span className="text-sm">Bookings</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                <span className="font-semibold text-black dark:text-white">
                  {driver?.driverReview.length !== 0 ? driver?.driverReview[0].rating : 0}/5
                </span>
                <span className="text-sm">Ratings</span>
              </div>
            </div>

            <DriverBookingTable bookings={driver?.booking} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
