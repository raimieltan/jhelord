import { Unit } from "@/app/types/unit"
import { useRouter } from "next/navigation"

interface UnitRowProps {
  unit: Unit
}

export const UnitRow = ({
  unit
}: UnitRowProps) => {
  const router = useRouter();
  const statusClass = () => {
    if (unit.status === 'Operational') {
      return 'w-1/4 text-green-500'
    }
    return 'w-1/4 text-red-500'
  }

  return (
    <>
      <tr 
        className="flex w-full border-b text-white text-center hover:bg-gray-700"
        onClick={() => router.push(`/admin/unit/${unit.id}`)}
      >
        <td className="w-1/4">
          {unit.driver.firstName} {unit.driver.lastName}
        </td>
        <td className="w-1/4">
          {unit.number} - {unit.plateNumber}
        </td>
        <td className="w-1/4">
          {/* TODO: time */}
        </td>
        <td className={statusClass()}>
          {unit.status}
        </td>
      </tr>
    </>
  )
}

export default UnitRow