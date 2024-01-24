"use client"

import { Unit } from "@/app/types/unit";
import { X } from "lucide-react";
import Image from "next/image";

interface ModalProps {
  unit: Unit | null,
  onClose: any,
}

const Modal = ({
  unit, onClose
}: ModalProps) => (

  <div className="absolute z-50 w-full">
    <div className="mx-auto mt-48 rounded-xl border-stroke bg-white
      shadow-xl w-1/3 px-4 py-4 bg-opacity-70
    dark:border-strokedark dark:bg-boxdark dark:bg-opacity-90"
    >
      <div className="flex justify-between text-black dark:text-white">
        <div className="text-2xl font-bold mt-2">
          Unit Details
        </div>
        <button onClick={onClose}>
          <X />
        </button>
      </div>
      <div>
        {unit && (
          <div className="mt-6 text-xl">
            <div className="flex flex-row h-40 w-full items-between">
              <div className="w-full h-full -mr-8">
                <Image
                  src={
                    unit.driver.User.profileImage !== '' ?
                      `https://jhelord-backend.onrender.com/${unit.driver?.User.profileImage?.slice(4)}`
                      :
                      `https://jhelord-backend.onrender.com/uploads/taxi-driver.png`
                  }
                  width={150}
                  height={200}
                  alt="User"
                />
              </div>
              <div className="w-full">
                <div className="grid grid-rows-4 text-sm gap-y-3 text-black dark:text-white">
                  <p>Name: {unit.driver.User.firstName} {unit.driver.User.lastName}</p>
                  <p>License No.: {unit.driver.licenseNumber}</p>
                  <p>Unit: {unit.make} {unit.model}</p>
                  <p>Unit Number: {unit.number}</p>
                  <p>Status: <span className={unit.status === 'ACTIVE' ? 'text-meta-3' : 'text-meta-1'}>{unit.status}</span></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default Modal;