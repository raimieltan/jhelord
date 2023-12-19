import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface PaginationProps {
  itemsLength: number;
  currentPage: number;
  totalPages: number;
  path?: string
  setCurrentPage: (value: number) => void;
}

const ITEMS_PER_PAGE = 10;

const Pagination = ({
  path,
  itemsLength,
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps) => {
  const usePath = usePathname()
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const router = useRouter();

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      router.push(`${path? path : usePath.split("/")[2]}/?page=${currentPage + 1}`);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      router.push(`${path? path : usePath.split("/")[2]}/?page=${currentPage - 1}`);
    }
  };

  return (
    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between py-4 mx-4">
      <div>
        <p className="text-sm text-black">
          Showing
          <span className="font-medium"> {indexOfFirstItem + 1} </span>
          to
          <span className="font-medium">
            {" "}
            {indexOfLastItem > itemsLength ? itemsLength : indexOfLastItem}{" "}
          </span>
          of
          <span className="font-medium"> {itemsLength} </span>
          results
        </p>
      </div>
      <div className="flex items-center mt-4 gap-x-4 sm:mt-0">
        <a
          onClick={handlePrevPage}
          aria-disabled={currentPage === 1}
          className={`cursor-pointer flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 rtl:-scale-x-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
            />
          </svg>
          <span>previous</span>{" "}
        </a>

        {/* Next Page Button */}
        <a
          onClick={handleNextPage}
          aria-disabled={currentPage === totalPages}
          className={`cursor-pointer flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md sm:w-auto gap-x-2 hover:bg-gray-100 ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span>Next</span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 rtl:-scale-x-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default Pagination;
