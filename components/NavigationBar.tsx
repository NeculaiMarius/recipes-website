import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import FeatureSelector from "./Menus/FeatureSelector"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { options } from "@/app/api/auth/[...nextauth]/options"
import Search from "./Search"
import MobileNavigation from "./Menus/MobileNavigation"
import NavBarLogo from "./NavBarLogo"
import { Separator } from "./ui/separator"
import { LogOut, Settings, User } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import UserEditModal from "./Forms/UserEditModal"

const NavigationBar = async () => {
  const session = await getServerSession(options)
  const username = session?.user.lastName
  console.log(session?.user.lastName)

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

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="h-auto p-0 hover:bg-emerald-700/10 hover:text-emerald-700">
              <div className="flex items-center">
                <span className="material-symbols-outlined flex justify-center text-[3rem]">account_circle</span>
                <span className="max-sm:hidden">{username}</span>
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[300px] border-l-emerald-700 sm:w-[400px]">
            <SheetHeader>
              <SheetTitle className="text-emerald-700">Setări cont</SheetTitle>
            </SheetHeader>

            <div className="py-6">
              <div className="flex items-center gap-4 pb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-700/10 text-emerald-700">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-medium text-emerald-700">{username}</h3>
                  <p className="text-sm text-muted-foreground">{session?.user.email}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <Link
                  href={`/Account/${session?.user.id}`}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-emerald-700/10 hover:text-emerald-700"
                >
                  <User className="h-5 w-5" />
                  Contul meu
                </Link>

                <UserEditModal id={session?.user.id as string} currentEmail={session?.user.email as string} currentFirstName={session?.user.firstName as string} currentLastName={session?.user.lastName as string}/>

                <Separator className="my-4" />

                <Link
                  href="/api/auth/signout"
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-5 w-5" />
                  Delogare
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile Navigation - only visible on small screens */}
      <MobileNavigation />
    </>
  )
}

export default NavigationBar

