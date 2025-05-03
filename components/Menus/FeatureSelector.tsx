"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation"
import { mainFeatures } from "@/constants"
import Link from "next/link"
import { ArrowRight, Home, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const FeatureSelector = ({userRole}:{userRole:string}) => {
  const pathname = usePathname()
  const curFeature = mainFeatures.find((feature) => feature.route === pathname)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center gap-2 bg-emerald-700 text-white rounded-md px-2 py-1 shadow-md font-semibold">
          {curFeature?.label}
          <Menu size={36}></Menu>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-0 overflow-hidden rounded-xl border-none shadow-lg" align="start">
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 p-3">
          <h3 className="text-base font-bold text-white">Navigare</h3>
          <div className="mt-1 h-0.5 w-10 rounded-full bg-white/30"></div>
        </div>

        <div className="relative p-2 bg-white">
          <div className="absolute inset-0 opacity-5">
            <div className="h-full w-full bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
          </div>

          <div className="relative">
            {mainFeatures.map((feature) => {
              if (feature.label === "ADMINISTRARE" && userRole !== "admin") {
                return null; 
              }            
              return(
              <Link key={feature.label} href={feature.route} className="block">
                <DropdownMenuItem
                  className={cn(
                    "group flex items-center justify-between rounded-lg p-2.5 my-1 cursor-pointer transition-all",
                    pathname === feature.route ? "bg-emerald-100 text-emerald-800" : "hover:bg-emerald-50",
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        pathname === feature.route
                          ? "bg-emerald-700 text-white"
                          : "bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200",
                      )}
                    >
                      {feature.image ? (
                        <Image
                          src={feature.image || "/placeholder.svg"}
                          alt={feature.label}
                          width={24}
                          height={24}
                        />
                      ) : (
                        <Home className="h-4 w-4" />
                      )}
                    </div>
                    <span className="font-medium">{feature.label}</span>
                  </div>
                  <ArrowRight
                    className={cn(
                      "h-4 w-4 transition-transform",
                      pathname === feature.route
                        ? "text-emerald-700"
                        : "text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1",
                    )}
                  />
                </DropdownMenuItem>
              </Link>
            )})}
          </div>
        </div>

        <div className="flex items-center justify-center bg-emerald-50 p-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-300 mx-0.5"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 mx-0.5"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mx-0.5"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 mx-0.5"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-700 mx-0.5"></div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default FeatureSelector

