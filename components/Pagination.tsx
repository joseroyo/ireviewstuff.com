import Button from "./Button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 mt-3 p-2 bg-window-bg border-1 border-window-border-color rounded-md">
      <Button
        variant="secondary"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >&lt;</Button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="secondary"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >&gt;</Button>
    </div>
  );
}