export function getPageNumbers(page: number, pageCount: number): (number |'...')[] {
  if (pageCount <= 7) { 
    return [...Array(pageCount).keys()];
  }
  if (page <= 3) {
    return [...Array(5).keys(),'...',pageCount - 1]
  }
  if (page >= pageCount - 4) {
    return [0,'...',pageCount - 5,pageCount - 4,pageCount - 3,pageCount - 2,pageCount -1]
  }
  return [0,'...',page - 1,page,page + 1,'...',pageCount - 1]
} 