"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"
import { Unit } from "@/app/types/unit";

export const UnitPage = () => {
  const unitParamsId = usePathname().split("/")[3]
  const [unit, setUnit] = useState<Unit>()

  const fetchUnit = async (unitId: string) => {
    if (unitId) {
      try {
        const response = await fetch(`http://localhost:8000/api/units/${unitId}`)
        const data = await response.json()
        setUnit(data);

        console.log(data)

      } catch (error: any) {
        console.log(error)
      }
    }
  }

  console.log(unit?.driver);

  useEffect(() => {
    fetchUnit(unitParamsId);
  }, [])

  return (
    unit &&
    <div className="flex w-full h-full bg-white">
      <div className="flex flex-col w-full">
        <div className="flex flex-col border border-black h-full m-4 text-2xl font-semibold">
          <div className="flex flex-row border border-red-500 m-4 text-black justify-between">
            <div className="flex flex-row border border-blue-500">
              <div className="p-28">
                Driver Image
              </div>
              {
                unit ?
                  <div className="flex flex-col">
                    <p className="my-2">Driver: {unit.driver?.firstName} {unit.driver?.lastName}</p>
                    <p className="my-2">Number: Unit Number</p>
                    <p className="my-2">Plate Number: Unit Plate Number</p>
                    <p className="my-2">Make and Model: Unit make and model</p>
                    <p className="my-2"> View License </p>
                  </div>
                  : ''
              }
            </div>
            <div className="border border-yellow-300 mx-4">
              <p className="my-2">Status: Unit Status</p>
            </div>
          </div>

          <div className="border border-yellow-500 m-4 h-full text-black">
            Map
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitPage;
