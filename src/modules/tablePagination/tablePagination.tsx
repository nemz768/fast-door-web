import { tableStore } from "@/stores/tableStore";
import "./tablePagination.scss";


interface TablePaginationProps {
  page?: number; // 0-based
  totalPages?: number;
  onPrev?: () => void;
  onNext?: () => void;
  onSetPage?: (page: number) => void;
  size?: number;
  showSizeSelect?: boolean;
  onSizeChange?: (size: number) => void;
}

export default function TablePagination({ page = 0, totalPages, onPrev, onNext, onSetPage, size = 10, showSizeSelect = false, onSizeChange }: TablePaginationProps) {
  const tp = typeof totalPages === 'number' ? totalPages : tableStore.getTotalPages();

  const handlePrev = () => {
    if (onPrev) return onPrev();
    if (onSetPage) return onSetPage(Math.max(0, page - 1));
  }; 

  const handleNext = () => {
    if (onNext) return onNext();
    if (onSetPage) return onSetPage(Math.min(tp ? tp - 1 : page + 1, page + 1));
  };
return (
  <div className="table-pagination">
    <button
      className="table-pagination-button"
      onClick={handlePrev}
      disabled={page <= 0}
    >
      <svg
        className="arrow-icon"
        viewBox="0 0 32 32"
        width="30"
        height="30"
        aria-hidden
      >
        <path d="M20.06 6.06L9.12 16l10.94 9.94 2.12-2.12L13.36 16l8.82-7.82z" />
      </svg>
    </button>

    <p className="table-pagination-current-page">
      Страница {page + 1} из {tp || 1}
    </p>

    <button
      className="table-pagination-button"
      onClick={handleNext}
      disabled={tp ? page >= tp - 1 : false}
    >
      <svg
        className="arrow-icon arrow-icon--right"
        viewBox="0 0 32 32"
        width="30"
        height="30"
        aria-hidden
      >
        <path d="M20.06 6.06L9.12 16l10.94 9.94 2.12-2.12L13.36 16l8.82-7.82z" />
      </svg>
    </button>
      {/* 
      {showSizeSelect && (
        <select value={size} onChange={(e) => onSizeChange?.(Number(e.target.value))}>
          <option value={6}>6</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      )} */}
  </div>
);


}