import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import FeatureSelector from "./FeatureSelector"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { options } from "@/app/api/auth/[...nextauth]/options"
import Search from "./Search"
import MobileNavigation from "./MobileNavigation"
import NavBarLogo from "./NavBarLogo"

const NavigationBar = async () => {
  const session = await getServerSession(options)
  const username = session?.user.firstName

  return (
    <>
      <div className="flex w-full items-center justify-between fixed top-0 left-0 h-[80px] bg-gray-100  p-6 z-50">

        <div className="flex items-center">
        <NavBarLogo />
          <div className="h-12 min-w-12"></div>
          <div className="max-md:hidden pl-4">
            <FeatureSelector />
          </div>
        </div>
        
        
        <div className="md:max-w-[500px] w-full mx-4">
          <Search placeholder="Caută o rețetă..."></Search>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex items-center">
              <span className="material-symbols-outlined text-[3rem] flex justify-center">account_circle</span>
              <span className="max-sm:hidden">{username}</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Contul meu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href={`/Account/${session?.user.id}`}>
              <DropdownMenuItem>Contul meu</DropdownMenuItem>
            </Link>
            <Link href="/api/auth/signout">
              <DropdownMenuItem>Delogare</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Navigation - only visible on small screens */}
      <MobileNavigation />
    </>
  )
}

export default NavigationBar

