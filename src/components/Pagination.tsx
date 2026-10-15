import { getPageNumbers } from "../lib/pagination"

const BUTTON_CLASS = "cursor-pointer py-1 px-2 rounded min-w-10 text-center tabular-nums"

export function Pagination({ page, pageCount, onPageChange }: { page: number, pageCount: number, onPageChange: (page: number) => void }) {
  const pageNumbers = getPageNumbers(page, pageCount)
  return (
    <div className="flex gap-2 justify-center border-t border-slate-700 pt-3">
      <button className={`${BUTTON_CLASS} disabled:opacity-40 disabled:cursor-not-allowed text-slate-400`} disabled={page === 0} onClick={() => onPageChange(page - 1)}>
        ← Prev
      </button>
      {pageNumbers.map((n, index) => {
        if (n === '...') {
          return <span key={index} className='px-1 text-slate-500 self-center min-w-10 text-center'>{n}</span>
        }
        return <button key={index} disabled={page === n} aria-current={page === n ? 'page' : undefined} className={`${BUTTON_CLASS} ${n === page ? 'text-blue-400 font-semibold bg-blue-500/15 rounded' : 'hover:text-white text-slate-400'}`} onClick={() => onPageChange(n)}>{n + 1}</button>
      })}
      <button className={`${BUTTON_CLASS} disabled:opacity-40 disabled:cursor-not-allowed text-slate-400`} disabled={page === pageCount - 1} onClick={() => onPageChange(page + 1)}>
        Next →
      </button>


    </div>
  )
}