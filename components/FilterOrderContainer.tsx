"use client"

import { orderFilters } from "@/constants"
import { cn } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FaFlag, FaHeart, FaStar } from "react-icons/fa"

export default function FilterOrderContainer() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("order", term)
    } else {
      params.delete("order")
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="w-full flex justify-center">
      <div className="overflow-x-auto pb-2 max-w-full">
        <div className="flex flex-nowrap gap-4 min-w-min mx-auto">
          {orderFilters.map((order) => {
            return (
              <div
                className={cn("flex  gap-2 items-center bg-gray-100 rounded-md px-4 text-gray-700 py-2 cursor-pointer whitespace-nowrap flex-shrink-0 shadow-md ",
                              order.value==searchParams.get("order")?`${order.color} text-white`:"")}
                onClick={() => handleSearch(order.value)}
                key={order.value}
              >
                {order.value=='rating'?<FaStar size={20}/>:order.value=='numar_aprecieri'?<FaHeart size={20}/>:<FaFlag size={20}/>}
                {order.label}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

