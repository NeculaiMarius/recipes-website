'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [value, setValue] = useState(searchParams.get("query")?.toString() || "");

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

  const validCharRegex = /^[a-zA-ZăîâșțĂÎÂȘȚ0-9\s@.,]*$/;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target.value;
    if (validCharRegex.test(input)) {
      setValue(input);
      handleSearchWithDebounce(input);
    }
  }

  return (
    <div className="relative flex flex-1 flex-shrink-0 max-w-[500px]">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        type="text"
        inputMode="text"
        pattern="^[a-zA-ZăîâșțĂÎÂȘȚ0-9\s@.,]+$"
        maxLength={100}
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
