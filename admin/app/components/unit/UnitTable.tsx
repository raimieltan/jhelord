"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Unit } from "../../types/unit";
import Pagination from "../Pagination";
import UnitRow from "./UnitRow";

interface ExpandedRows {
  [key: number]: boolean | undefined;
}
interface UnitTableProps {
  units: Unit[];
}

const ITEMS_PER_PAGE = 10;

const UnitTable = ({ 
  units 
}: UnitTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // const [units, setUnits] = useState<Unit[]>([]);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page") ?? "1")
  );
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const totalPages = Math.ceil(units.length / ITEMS_PER_PAGE);

  

  return (
    <section className=" bg-green-700 rounded-lg">
      <div className="mx-auto">
        <div className="overflow-x-auto">
          <table className="flex flex-col w-full h-full p-4 text-black">
            <thead>
              <tr className="flex text-center">
                <th className="font-bold w-1/4">
                  Driver
                </th>
                <th className="font-bold w-1/4">
                  Unit
                </th>
                <th className="font-bold  w-1/4">
                  Model
                </th>
                <th className="font-bold  w-1/4">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) =>
                <UnitRow
                  key={unit.id}
                  unit={unit}
                />
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          itemsLength={units.length}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </section>
  );
};

export default UnitTable;
