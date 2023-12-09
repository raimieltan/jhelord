import { OperationTable } from "@/app/components/operations/OperationTable";

export default function Admin() {
  return (
    <div className="flex w-full h-full bg-white">
      <div className="flex flex-col w-full">
        <div className="flex flex-row border border-black m-4 text-2xl font-semibold">
          <button
            className="border border-red-500 w-full text-black bg-gray-300">
            {/* TODO: onclick toggle */}
            Operations
          </button>
          <button className="border border-blue-500 w-full text-black bg-gray-300">
            {/* TODO: onclick toggle */}
            Logs
          </button>
        </div>

        <div className="w-full h-100% p-4">
          <OperationTable />
        </div>
      </div>
    </div>
  )
}
