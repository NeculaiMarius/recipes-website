
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

const PaginationComponent = ({ totalPages, page }: { totalPages: number; page: number }) => {
  return (
    <Pagination className="py-12">
      <PaginationContent>
        <PaginationItem>
          {page > 1 && (
            <a
              href={`?page=${page - 1}`}
              className="pagination-previous"
              
            >
              Previous
            </a>
          )}
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => {
          const isActive = page === i + 1;
          return (
            <a
              key={i}
              href={`?page=${i + 1}`}
              className={cn(
                buttonVariants({
                  variant: isActive ? "outline" : "ghost",
                  size: "default",
                }),
                isActive ? "bg-emerald-700 text-white font-bold" : null
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {i + 1}
            </a>
          );
        })}


        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>

        <PaginationItem>
          {page < totalPages && (
            <a
              href={`?page=${page + 1}`}
              className="pagination-next"
            
            >
              Next
            </a>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
