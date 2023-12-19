"use client"

import UnitTable from "@/app/components/unit/UnitTable";
import Map from "@/app/components/map/map";
import { useEffect, useState } from "react";
import { Unit } from "@/app/types/unit";
import OperationTable from "@/app/components/operation/OperationTable";
import { Operation } from "@/app/types/operation";

enum TableType {
  units,
  operations
}

export default function Admin() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [tableToggle, setTableToggle] = useState<TableType>(TableType.units);

  const fetchUnits = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/units`)
      const data = await response.json()
      setUnits(data);

    } catch (error: any) {
      console.log(error)
    }
  }

  const fetchOperations = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/operations`)
      const data = await response.json()
      setOperations(data);

    } catch (error: any) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUnits();
    fetchOperations();
  }, [])

  return (
    <div className="w-full flex flex-col h-full">
      <div className="flex h-96 bg-white w-full">
        <Map units={units} />
      </div>

      <div className="text-black flex flex-row w-full font-semibold">
        <div className="text-center border-2 rounded-2xl p-4 m-4 bg-green-400 shadow-sm shadow-black flex items-center">
          <p>Operational Units: {units.length}</p>
        </div>
        <div className="text-center border-2 rounded-2xl p-4 m-4 bg-blue-400 shadow-sm shadow-black flex items-center">
          <p>Occupied: 2</p>
        </div>
      </div>

      <div>
        <div className="flex flex-row text-2xl font-semibold mx-4 my-4">
          <button
            onClick={() => setTableToggle(TableType.units)}
            disabled={tableToggle === TableType.units}
            className={`shadow-black shadow-sm w-full text-black bg-gray-300 transition-all rounded-md mx-2 ${tableToggle === TableType.units ? "bg-green-600" : "hover:bg-gray-500 bg-gray-400"}`}>
            Units
          </button>
          <button
            onClick={() => setTableToggle(TableType.operations)}
            disabled={tableToggle === TableType.operations}
            className={`shadow-black shadow-sm w-full text-black bg-gray-300 transition-all rounded-md mx-2 ${tableToggle === TableType.operations ? "bg-green-600" : "hover:bg-gray-500 bg-gray-400"}`}>
            Logs
          </button>
        </div>
      </div>

      {
        tableToggle === TableType.units ?
          <div className="flex flex-col mx-4">
            <UnitTable units={units} />
          </div>
          :
          <div className="flex flex-col mx-4">
            <OperationTable operations={operations} />
          </div>
      }
    </div >
  )
}
