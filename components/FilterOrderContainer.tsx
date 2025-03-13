'use client';

import { orderFilters } from "@/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function FilterOrderContainer() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('order', term);
    } else {
      params.delete('order');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  let timeout: NodeJS.Timeout;

  function handleSearchWithDebounce(term: string) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      handleSearch(term);
    }, 350);
  }

  return (
    <div className="flex gap-4 justify-center">
      {orderFilters.map(order=>{
        return(
          <div className="bg-gray-100 rounded-md px-4 py-2 cursor-pointer"
            onClick={()=>handleSearch(order.value)}
          >
            {order.label}
          </div>
        )
      })}
    </div>
  );
}