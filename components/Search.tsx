'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
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
  
  if (!["/Discover-recipes"].includes(pathname)) {
    return <div className="hidden"></div>;
  }



  return (
    <div className="relative flex flex-1 flex-shrink-0 max-w-[500px]">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearchWithDebounce(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  );
}