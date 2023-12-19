"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Operation } from "../../types/operation";
import Pagination from "../Pagination";
import { OperationRow } from "./OperationRow";

interface ExpandedRows {
  [key: number]: boolean | undefined;
}
interface OperationTableProps {
  operations: Operation[];
}

const ITEMS_PER_PAGE = 10;

const OperationTable = ({ 
  operations 
}: OperationTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page") ?? "1")
  );
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const totalPages = Math.ceil(operations.length / ITEMS_PER_PAGE);
  
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
                  Customer
                </th>
                <th className="font-bold  w-1/4">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {operations.map((operation) =>
                <OperationRow
                  key={operation.id}
                  operation={operation}
                />
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          itemsLength={operations.length}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </section>
  );
};

export default OperationTable;
