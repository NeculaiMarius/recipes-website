"use client"
import { useOptimistic, useState, useTransition } from "react"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Slider } from "./ui/slider"
import { useRouter } from "next/navigation"
import { ingredientsFilters, recipeTypes } from "@/constants"
import { FaFilter, FaQuestion, FaTimes } from "react-icons/fa"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"

const FiltersSheet = ({
  ingredients,
  type,
  prepTime,
}: {
  ingredients: string[]
  type: string
  prepTime: number
}) => {
  const router = useRouter()
  const [optimisticIngredients, setOptimisticIngredients] = useOptimistic(ingredients)
  const [optimisticType, setOptimisticType] = useOptimistic(type)
  const [optimisticPrepTime, setOptimisticPrepTime] = useOptimistic(prepTime)
  const [pending, startTransition] = useTransition()
  const [time,setTime]=useState(optimisticPrepTime);

  function updateFilters(newIngredients?: string[], newType?: string, newPrepTime?: number) {
    const nextIngredients = newIngredients ?? optimisticIngredients
    const nextType = newType ?? optimisticType
    const nextPrepTime = newPrepTime ?? optimisticPrepTime

    const newParams = new URLSearchParams()

    nextIngredients.forEach((ingredient) => {
      newParams.append("ingredient", ingredient)
    })

    if (nextType) {
      newParams.set("type", nextType)
    }

    if (nextPrepTime && nextPrepTime > 0) {
      newParams.set("prepTime", nextPrepTime.toString())
    }

    startTransition(() => {
      setOptimisticIngredients(nextIngredients)
      setOptimisticType(nextType)
      setOptimisticPrepTime(nextPrepTime)
      router.push(`?${newParams.toString()}`)
    })
  }

  const clearAllFilters = () => {
    updateFilters([], "",0)
  }

  const fetchRandomRecipeId = async () => {
    try {
      const response = await fetch("/api/recipe/get-random-recipe-id")
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }
      const data = await response.json()
      const recipeId = data.id
      if (!recipeId) {
        throw new Error("No recipe ID received")
      }
      router.push(`/Discover-recipes/Recipe-page?recipeId=${recipeId}`)
    } catch (err) {
      console.error("Error fetching random recipe ID:", err)
    }
  }

  const activeFiltersCount =
    optimisticIngredients.length + (optimisticType ? 1 : 0) + (optimisticPrepTime ? 1 : 0)

  return (
    <Sheet>
      <SheetTrigger className="relative h-12 w-12 flex justify-center items-center p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
        <FaFilter className="text-xl" />
        {activeFiltersCount > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 hover:bg-red-500 text-xs">
            {activeFiltersCount}
          </Badge>
        )}
      </SheetTrigger>

      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-emerald-100 border-b">
            <SheetTitle className="text-xl font-semibold text-emerald-800">Filtre Rețete</SheetTitle>
            <SheetDescription className="text-emerald-600">Găsește rețetele perfecte pentru tine</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Ingredients Filter */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800">Ingrediente</h3>
                {optimisticIngredients.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateFilters([], optimisticType, optimisticPrepTime)}
                    className="text-emerald-600 hover:text-emerald-700 h-auto p-1"
                  >
                    <FaTimes className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {ingredientsFilters.map((ingredient) => {
                  const isSelected = optimisticIngredients.includes(ingredient.id)
                  return (
                    <button
                      key={ingredient.id}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                        ${
                          isSelected
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                            : "bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                        }`}
                      onClick={() => {
                        const newIngredients = isSelected
                          ? optimisticIngredients.filter((i) => i !== ingredient.id)
                          : [...optimisticIngredients, ingredient.id]
                        updateFilters(newIngredients, optimisticType, optimisticPrepTime)
                      }}
                    >
                      {ingredient.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <Separator />

            {/* Recipe Type Filter */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800">Tipul Rețetei</h3>
                {optimisticType && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateFilters(optimisticIngredients, "", optimisticPrepTime)}
                    className="text-emerald-600 hover:text-emerald-700 h-auto p-1"
                  >
                    <FaTimes className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <div className="grid gap-2">
                {recipeTypes.map((recipeType) => {
                  const isSelected = optimisticType === recipeType.value
                  return (
                    <button
                      key={recipeType.value}
                      className={`px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 border
                        ${
                          isSelected
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                            : "bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                        }`}
                      onClick={() =>
                        updateFilters(optimisticIngredients, isSelected ? "" : recipeType.value, optimisticPrepTime)
                      }
                    >
                      {recipeType.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <Separator />

            {/* Preparation Time Filter */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800">Timp de Preparare</h3>
                {optimisticPrepTime !== 60 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateFilters(optimisticIngredients, optimisticType, 60)}
                    className="text-emerald-600 hover:text-emerald-700 h-auto p-1"
                  >
                    <FaTimes className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">5 minute</span>
                  <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {time} min
                  </div>
                  <span className="text-sm text-gray-600">180 minute</span>
                </div>

                <Slider
                  value={[time]}
                  onValueChange={(value: number[]) => {
                    setTime(value[0]);
                  }}
                  onValueCommit={(value: number[]) => {
                    updateFilters(optimisticIngredients, optimisticType, value[0])
                  }}
                  max={180}
                  min={5}
                  step={5}
                  className="w-full"
                />

                <div className="flex justify-between text-xs text-gray-500">
                  <span>Rapid</span>
                  <span>Mediu</span>
                  <span>Îndelungat</span>
                </div>
              </div>

            <Separator />


              <Button
              onClick={fetchRandomRecipeId}
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-md"
              disabled={pending}
            >
              <FaQuestion className="mr-2" />
              Surprinde-mă!
              <FaQuestion className="ml-2" />
            </Button>
            </div>
          </div>

          <SheetFooter className="p-6 border-t bg-gray-50 space-y-3 w-full">
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="w-full text-gray-600 border-gray-300 hover:bg-gray-100 bg-transparent"
                disabled={pending}
              >
                Șterge toate filtrele
              </Button>
            )}
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default FiltersSheet
