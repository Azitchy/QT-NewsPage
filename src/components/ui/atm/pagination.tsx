import { ArrowLeft, ArrowRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalItems === 0 || totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`flex flex-col items-center mt-6 gap-2 ${className}`}>
      <div className="flex items-center gap-2 bg-card border border-[#EBEBEB] rounded-full px-2 py-1">
        {/* Previous */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-primary hover:bg-muted disabled:text-gray-400 disabled:hover:bg-transparent cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={1.6} />
        </button>

        {/* Current Page */}
        <div className="w-8 h-8 flex items-center justify-center text-primary body-text2-500">
          {currentPage}
        </div>

        {/* Next */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-primary hover:bg-muted disabled:text-gray-400 disabled:hover:bg-transparent cursor-pointer"
        >
          <ArrowRight className="w-6 h-6" strokeWidth={1.6} />
        </button>
      </div>

      {/* Range */}
      <p className="body-text2-400 text-muted-foreground">
        {startItem}–{endItem} of {totalItems}
      </p>
    </div>
  );
}
