import { Operation } from "@/app/types/operation"
import { useRouter } from "next/navigation"

interface OperationRowProps {
  operation: Operation
}

export const OperationRow = ({
  operation
}: OperationRowProps) => {

  console.log("OPERATION: ", operation);

  return (
    <>
      <tr 
        className="flex w-full border-b text-black text-center hover:bg-green-900"
      >
        <td className="w-1/4">
          {operation.unit.driver.firstName} {operation.unit.driver.lastName}
        </td>
        <td className="w-1/4">
          Unit {operation.unit.number} - {operation.unit.plateNumber}
        </td>
        <td className="w-1/4">
          {operation.unit.make} {operation.unit.model}
        </td>
        <td className="w-1/4">
          {operation.customer.firstName} {operation.customer.lastName}
        </td>
        <td className="w-1/4">
          {operation.status}
        </td>
      </tr>
    </>
  )
}

export default OperationRow