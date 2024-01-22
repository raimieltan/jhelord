import { GrClose } from "react-icons/gr";

const ErrorAlert = () => (
  <div className="fixed w-1/2 -ml-4 -mt-4 text-black z-50 border-l-6 border-[#F87171] bg-boxdark bg-opacity-100 px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-90 md:p-9">
    <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#F87171]">
      <GrClose />
    </div>
    <div className="w-full mt-4">
      <h5 className="mb-3 text-lg font-semibold text-[#F87171]">
        Error
      </h5>
      <p className="text-xl mb-3 font-semibold text-[#B45454]">
        There were errors with your submission
      </p>
    </div>
  </div>
)

export default ErrorAlert;