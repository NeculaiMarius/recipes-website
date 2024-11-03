import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from '@/lib/utils'



const PaginationComponent = ({totalPages,page}:{totalPages:number,page:number}) => {
  console.log(page);
  return (
    <Pagination className='py-12'>
      <PaginationContent>
        <PaginationItem>
          {page>1 &&(
            <PaginationPrevious href={`?page=${page - 1}`} />
          )}
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => (
          <PaginationItem key={i}>
            <PaginationLink 
              href={`?page=${i+1}`} 
              className={cn(page==i+1?"bg-emerald-700 text-white font-bold":null)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationEllipsis>
            
          </PaginationEllipsis>
        </PaginationItem>
        
        <PaginationItem>
          {page<totalPages &&(
            <PaginationNext href={`?page=${page + 1}`} />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationComponent