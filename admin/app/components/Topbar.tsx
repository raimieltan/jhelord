"use client"
import { usePathname } from "next/navigation";

export const Topbar = () => {
  const url = usePathname();
  const title = url.split("/")[1].replaceAll("-", " ");
  return (
    <div>
      <div className='w-[75%] h-auto mx-4'>
        <div className="flex justify-start items-center px-6">
          <div className="flex justify-self-start font-bold text-3xl text-green-700 capitalize">{title}</div>
          <div className="flex gap-x-4 h-16 items-center px-4 text-lg text-orange-prominent">
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;