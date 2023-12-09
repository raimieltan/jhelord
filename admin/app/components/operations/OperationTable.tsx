"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Operation } from "../../types/operation";
import Pagination from "../Pagination";
import OperationRow from "./OperationRow";

interface ExpandedRows {
  [key: number]: boolean | undefined;
}

const ITEMS_PER_PAGE = 10;

export const OperationTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [operations, setOperations] = useState<Operation[]>([]);
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page") ?? "1")
  );
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const totalPages = Math.ceil(operations.length / ITEMS_PER_PAGE);

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
    fetchOperations();
  }, [])

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto">
        <div className="overflow-x-auto">
          <table className="flex flex-col w-full h-full mt-4 p-4">
            <thead>
              <tr className="flex text-center">
                <th className="font-bold w-1/4">
                  Driver
                </th>
                <th className="font-bold w-1/4">
                  Unit
                </th>
                <th className="font-bold  w-1/4">
                  Runtime
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
