"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const PaginationComponent = ({ totalPages, page }: { totalPages: number; page: number }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false }); // Evită scroll-ul la top
  };

  return (
    <Pagination className="py-12">
      <PaginationContent>
        <PaginationItem>
          {page > 1 && (
            <button onClick={() => updatePage(page - 1)} className="pagination-previous">
              Previous
            </button>
          )}
        </PaginationItem>

        {Array.from({ length: totalPages }, (_, i) => {
          const isActive = page === i + 1;
          return (
            <button
              key={i}
              onClick={() => updatePage(i + 1)}
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
            </button>
          );
        })}

        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>

        <PaginationItem>
          {page < totalPages && (
            <button onClick={() => updatePage(page + 1)} className="pagination-next">
              Next
            </button>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationComponent;
