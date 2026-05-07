export default function Pagination({ page, total, pageSize, onPageChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>
      <span className="text-sm">
        Page {page} of {totalPages}
      </span>
      <button
        className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}
