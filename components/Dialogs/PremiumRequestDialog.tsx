"use client"

import { useEffect, useState } from "react"
import { Check, X } from "lucide-react"

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
import { getUserDetails } from "@/app/stores/UserStore"
import { sendRequest } from "@/app/stores/PremiumRequestStore"
import { MdWorkspacePremium } from "react-icons/md"

// Define the type for user details
interface UserDetails {
  numar_retete: number
  numar_recenzii: number
  urmaritori: number
  rol: string
}

export function PremiumRequestDialog({ userId }: { userId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const MIN_RECIPES = 10
  const MIN_FOLLOWERS = 100
  const MIN_REVIEWS = 10

  const isRecipeRequirementMet = userDetails ? userDetails.numar_retete >= MIN_RECIPES : false
  const isFollowersRequirementMet = userDetails ? userDetails.urmaritori >= MIN_FOLLOWERS : false
  const isReviewsRequirementMet = userDetails ? userDetails.numar_recenzii >= MIN_REVIEWS : false

  const isAdmin = userDetails?.rol === "admin"

  const allRequirementsMet = isRecipeRequirementMet && isFollowersRequirementMet && isReviewsRequirementMet && !isAdmin

  const handleSubmit = async () => {
    if (!allRequirementsMet) return

    setIsSubmitting(true)
    try {
      await sendRequest(userId);
    } catch (error) {
      setError("A apărut o eroare la trimiterea cererii. Încearcă din nou.")
      console.error("Error submitting request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const getUserDetailsEffect = async () => {
      setIsLoading(true)
      try {
        const userDetailsFetched = await getUserDetails(userId)
        setUserDetails(userDetailsFetched)
      } catch (error) {
        console.error("Error fetching user details:", error)
        setError("Nu am putut încărca detaliile utilizatorului")
      } finally {
        setIsLoading(false)
      }
    }

    getUserDetailsEffect()
  }, [userId])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-800 text-white  hover:text-white w-full h-full
                          hover:bg-blue-600 transition-all duration-300 ">Devino bucatar verificat</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 -m-6 p-6 rounded-t-lg">
          <DialogHeader className="text-center">
            <DialogTitle className="text-3xl font-bold text-white">Poti deveni bucatar verificat</DialogTitle>
            <DialogDescription className="text-gray-200">
              Trimite cererea ta pentru a deveni un bucatar premium verificat
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center my-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <MdWorkspacePremium size={60} className="text-white"/>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <h2 className="text-xl font-semibold mb-4">Indeplineste cerintele si aplica:</h2>

          {isLoading ? (
            <div className="text-center py-4">Se încarcă...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <div className="space-y-4">
              <div
                className={`flex items-center gap-2 p-3 rounded-md ${isRecipeRequirementMet ? "bg-green-50" : "bg-red-50"}`}
              >
                {isRecipeRequirementMet ? (
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-medium">Peste {MIN_RECIPES} retete publicate</p>
                  <p className={`text-sm ${isRecipeRequirementMet ? "text-green-600" : "text-red-600"}`}>
                    Curent: {userDetails?.numar_retete || 0} retete
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-2 p-3 rounded-md ${isFollowersRequirementMet ? "bg-green-50" : "bg-red-50"}`}
              >
                {isFollowersRequirementMet ? (
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-medium">Minim {MIN_FOLLOWERS} urmaritori</p>
                  <p className={`text-sm ${isFollowersRequirementMet ? "text-green-600" : "text-red-600"}`}>
                    Curent: {userDetails?.urmaritori || 0} urmaritori
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center gap-2 p-3 rounded-md ${isReviewsRequirementMet ? "bg-green-50" : "bg-red-50"}`}
              >
                {isReviewsRequirementMet ? (
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="font-medium">Cel putin {MIN_REVIEWS} review-uri acordate</p>
                  <p className={`text-sm ${isReviewsRequirementMet ? "text-green-600" : "text-red-600"}`}>
                    Curent: {userDetails?.numar_recenzii || 0} review-uri
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          {!isLoading && !error && (
            <>
              {isAdmin && (
                <p className="text-sm text-amber-600 mb-2 w-full text-center">
                  Administratorii nu pot trimite cereri de verificare.
                </p>
              )}
              {!isAdmin && !allRequirementsMet && (
                <p className="text-sm text-red-500 mb-2 w-full text-center">
                  Trebuie să îndeplinești toate cerințele pentru a aplica
                </p>
              )}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isSuccess || !allRequirementsMet || isAdmin}
                className={`w-full ${
                  allRequirementsMet && !isAdmin
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-400 cursor-not-allowed text-white"
                }`}
              >
                {isAdmin
                  ? "Administratorii nu pot aplica"
                  : isSubmitting
                    ? "Se trimite..."
                    : isSuccess
                      ? "Cerere trimisă!"
                      : "Aplica acum"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
