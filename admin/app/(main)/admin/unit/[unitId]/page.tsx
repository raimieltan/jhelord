"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"
import { Unit } from "@/app/types/unit";
import Image from "next/image";
import Map from "@/app/components/map/map";
import UnitMap from "@/app/components/map/unitMap";

export const UnitPage = () => {
  const unitParamsId = usePathname().split("/")[3]
  const [unit, setUnit] = useState<Unit>()

  const fetchUnit = async (unitId: string) => {
    if (unitId) {
      try {
        const response = await fetch(`http://localhost:8000/api/units/get-unit/${unitId}`)
        const data = await response.json()
        console.log("DATA: ", data);
        setUnit(data);

      } catch (error: any) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    fetchUnit(unitParamsId);
  }, [unitParamsId])

  return (
    unit &&
    <div className="flex flex-col bg-white">
      <div className="flex flex-row w-full h-screen">
        <div className="flex flex-col p-4 m-4 rounded-xl bg-gray-300 shadow-black shadow-md border">
          <div className="text-black font-semibold text-center text-2xl my-4">
            <p>Unit Info</p>
          </div>

          <div className="w-80">
            <img src="/taxi_placeholder.webp" alt="driver" />
          </div>

          <div className="text-green-800 font-semibold text-center text-xl my-4">
            <p>View License</p>
          </div>

          <div className="mt-12">
            <div className="bg-gray-400 rounded-xl text-black font-semibold text-center p-2 mx-2">
              <p>{unit.driver.firstName} {unit.driver?.lastName}</p>
            </div>

            <div className="bg-gray-400 rounded-xl text-black font-semibold text-center p-2 m-2">
              <p>{unit.make} {unit.model}</p>
            </div>

            <div className="flex flex-row text-black font-semibold justify-between">
              <div className="bg-gray-400 rounded-xl flex items-center p-2 mx-2">
                <p>Unit {unit.number}</p>
              </div>
              <div className="bg-gray-400 rounded-xl flex items-center p-2 mx-2">
                <p>Plate Number: {unit.plateNumber}</p>
              </div>
            </div>

            <div className={`bg-gray-400 rounded-xl ${unit.status === 'Operational' ? 'text-green-900' : 'text-black'} font-semibold text-center p-2 m-2`}>
              <p>{unit.status}</p>
            </div>
          </div>

        </div>
        <div className="border w-full p-4">
          <UnitMap unit={unit} />
        </div>
      </div>
      {/* <div className="border border-red-500">

      </div> */}
    </div>
  );
};

export default UnitPage;
