"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings } from "lucide-react"
import { signOut } from "next-auth/react"
import { GoAlertFill } from "react-icons/go";


export default function UserEditModal({
  currentFirstName,
  currentLastName,
  currentEmail,
  id,
}: { currentFirstName: string; currentLastName: string; currentEmail: string; id: string }) {
  const [open, setOpen] = useState(false)

  const [firstName, setFirstName] = useState(currentFirstName)
  const [lastName, setLastName] = useState(currentLastName)
  const [email, setEmail] = useState(currentEmail)
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setInvalidEmail(false)
    setIsLoading(true)

    try {
      const response = await fetch(`/api/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email }),
      })

      if (response.status === 409) {
        setInvalidEmail(true)
      } else {
        setOpen(false)
        signOut();
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-emerald-700/10 hover:text-emerald-700">
        <Settings className="h-5 w-5" />
        Editează profilul
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Editează profilul</DialogTitle>
            <DialogDescription>
              <div className="mt-2 flex items-center p-3 border border-red-200 bg-red-50 rounded-md">
                <GoAlertFill className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div className="ml-3">
                  <span className="font-semibold text-red-700">ATENȚIE: </span>
                  <span className="text-gray-700">La modificarea datelor este necesară logarea din nou pe site</span>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                Prenume
              </Label>
              <Input
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Nume de familie
              </Label>
              <Input
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className={"grid grid-cols-4 items-center gap-4 "}>
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={"col-span-3 " + (invalidEmail ? " text-red-700" : "")}
                required
              />
              {invalidEmail && (
                <p className="col-start-2 col-span-3 text-red-700 text-sm">Acest email este deja folosit</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-emerald-700 text-emerald-700 hover:bg-emerald-700/10"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-emerald-700 hover:bg-emerald-800 text-white">
              {isLoading ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Se salvează...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

