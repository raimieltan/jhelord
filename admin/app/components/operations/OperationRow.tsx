import { Operation } from "@/app/types/operation"

interface OperationRowProps {
  operation: Operation
}

export const OperationRow = ({
  operation
}: OperationRowProps) => {

  const statusClass = () => {
    if (operation.status === 'In Progress') {
      return 'w-1/4 text-green-500'
    }

    return 'w-1/4 text-red-500'
  } 
  
  return (
    <>
      <tr className="flex w-full border-b text-white text-center hover:bg-gray-700">
        <td className="w-1/4">
          {operation.unit.driver.firstName} {operation.unit.driver.lastName}
        </td>
        <td className="w-1/4">
          {operation.unit.number} - {operation.unit.plateNumber}
        </td>
        <td className="w-1/4">
          {/* TODO: time */}
        </td>
        <td className={statusClass()}>
          {operation.status}
        </td>
      </tr>
    </>
  )
}

export default OperationRow