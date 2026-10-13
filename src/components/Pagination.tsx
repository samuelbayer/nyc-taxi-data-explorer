
export function Pagination({ page, pageCount, onPageChange }: { page: number, pageCount: number, onPageChange: (page: number) => void }) {

  return (
    <div className="flex gap-4 my-3">
      <button className="border border-black bg-slate-700 cursor-pointer text-white py-1 px-3 rounded disabled:opacity-40 disabled:cursor-not-allowed" disabled={page === 0} onClick={() => onPageChange(page - 1)}>
        Prev
      </button>
      <button className="border border-black bg-slate-700 cursor-pointer text-white py-1 px-3 rounded disabled:opacity-40 disabled:cursor-not-allowed" disabled={page === pageCount - 1} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
      <p className="my-auto">Page {page + 1} of {pageCount}</p>

    </div>
  )
}