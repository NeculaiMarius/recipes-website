"use client"
import { useState, useEffect, type ChangeEvent } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { recipeTypes } from "@/constants"
import {
  ChevronsUpDown,
  Check,
  Plus,
  Clock,
  Minus,
  Upload,
  X,
  ChefHat,
  Timer,
  Users,
  FileText,
  Utensils,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  file: z.any().refine(
    (value) => {
      return value && value instanceof FileList && value.length > 0
    },
    { message: "File is required" },
  ),
  recipeName: z.string().min(1, "Numele rețetei este necesar"),
  recipeType: z.string().min(1, "Tipul rețetei este necesar"),
  preparationTime: z.number().min(10, "Timpul de preparare este necesar"),
  portions: z.number().min(1, "Numarul de porții este necesar"),
  steps: z
    .array(
      z.object({
        description: z.string().min(1, "Introduceti descrierea pasului").max(400, "Maxim 400 caractere"),
      }),
    )
    .nonempty({ message: "Este necesar cel putin un pas de preparare" }),
  recipeDescription: z.string().min(1).max(1000),
})

const RecipeForm = ({ userId }: { userId: string | undefined }) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipeName: "",
      recipeType: "",
      portions: 1,
      preparationTime: 10,
      steps: [{ description: "" }],
      recipeDescription: "",
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  })

  const fileRef = form.register("file")

  const [ingredientQuery, setIngredientQuery] = useState("")
  const [ingredientSuggestions, setIngredientSuggestions] = useState<
    { id: string; nume: string; um: string; categorie: string }[]
  >([])
  const [selectedIngredients, setSelectedIngredients] = useState<
    { id: string; nume: string; um: string; cantitate: number }[]
  >([])

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const [isLoading, setIsLoading] = useState(false)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setSelectedImage((reader.result as string) || null)
        setSelectedFile(file)
      }
    }
  }

  useEffect(() => {
    const fetchIngredients = async () => {
      if (ingredientQuery.trim()) {
        try {
          const response = await fetch(`/api/ingredients?query=${encodeURIComponent(ingredientQuery)}`)
          const data = await response.json()
          setIngredientSuggestions(data.ingredients || [])
        } catch (error) {
          console.error("Failed to fetch ingredients:", error)
        }
      } else {
        setIngredientSuggestions([])
      }
    }
    fetchIngredients()
  }, [ingredientQuery])

  const handleAddIngredient = (ingredient: { id: string; nume: string; um: string }) => {
    const isIngredientAlreadySelected = selectedIngredients.some((item) => item.id === ingredient.id)
    if (!isIngredientAlreadySelected) {
      setSelectedIngredients((prev) => [
        ...prev,
        { ...ingredient, cantitate: ingredient.um === "g" || ingredient.um === "ml" ? 10 : 1 },
      ])
    }
    setIngredientQuery("")
    setIngredientSuggestions([])
  }

  const handleRemoveIngredient = (id: string) => {
    setSelectedIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id))
  }

  const handleQuantityChange = (id: string, cantitate: number) => {
    setSelectedIngredients((prev) =>
      prev.map((ingredient) => (ingredient.id === id ? { ...ingredient, cantitate } : ingredient)),
    )
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedFile || selectedIngredients.length <= 0) return

    const ingredientsWithQuantities = selectedIngredients.map((ingredient) => ({
      id: ingredient.id,
      quantity: ingredient.cantitate,
    }))

    //IMAGE UPLOAD IN CLOUDINARY
    setIsLoading(true)
    const response = await fetch("/api/cloudinary-upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: selectedImage }),
    })
    const result = await response.json()
    const imagePublicId = result.id
    const imageUrl = result.imageUrl

    // INSERT RECIPE IN DATABASE
    try {
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeName: values.recipeName,
          recipeDescription: values.recipeDescription,
          recipeType: values.recipeType,
          preparationTime: values.preparationTime,
          portions: values.portions,
          steps: values.steps.map((step) => step.description),
          ingredients: ingredientsWithQuantities,
          imageUrl: imageUrl,
          imagePublicId: imagePublicId,
          userId: userId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit recipe")
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Submission error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 lg:w-[60vw]">
      <Card className="mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-100 to-emerald-50 border-b">
          <CardTitle className="text-2xl font-bold text-emerald-800">Adaugă o rețetă nouă</CardTitle>
          <CardDescription>Completează detaliile pentru a împărtăși rețeta ta cu comunitatea</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Image Upload Section */}
              <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn(
                          "text-lg font-semibold flex items-center gap-2",
                          errors.file ? "text-red-500" : "text-emerald-800",
                        )}
                      >
                        <Upload className="h-5 w-5" /> Adaugă o imagine
                      </FormLabel>
                      <FormMessage />
                      <FormControl>
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-200 rounded-lg p-6 transition-all hover:border-emerald-400 bg-white">
                          {!selectedImage ? (
                            <>
                              <div className="mb-4 text-emerald-500">
                                <Upload className="h-12 w-12 mx-auto" />
                              </div>
                              <p className="text-sm text-center text-muted-foreground mb-2">
                                Trage și plasează sau apasă pentru a încărca
                              </p>
                              <Input
                                type="file"
                                placeholder="shadcn"
                                accept="image/*"
                                className="max-w-xs"
                                {...fileRef}
                                onChange={(e) => {
                                  fileRef.onChange(e)
                                  handleImageChange(e)
                                }}
                              />
                            </>
                          ) : (
                            <div className="relative">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="absolute -top-3 -right-3 rounded-full bg-red-100 hover:bg-red-200 border-red-200"
                                onClick={() => setSelectedImage(null)}
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                              <Image
                                width={300}
                                height={200}
                                src={selectedImage || "/placeholder.svg"}
                                alt="Preview Imagine"
                                className="rounded-md object-cover max-h-64"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Basic Recipe Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="recipeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold flex items-center gap-2 text-emerald-800">
                        <ChefHat className="h-5 w-5" /> Numele rețetei
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Introdu numele rețetei"
                          maxLength={50}
                          {...field}
                          className="border-emerald-200 focus-visible:ring-emerald-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="recipeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold flex items-center gap-2 text-emerald-800">
                        <Utensils className="h-5 w-5" /> Tipul rețetei
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between border-emerald-200",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value
                                ? recipeTypes.find((type) => type.value === field.value)?.label
                                : "Selectați tipul rețetei"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Căutați tipul rețetei..." />
                              <CommandList>
                                <CommandEmpty>Nu s-a găsit niciun tip de rețetă.</CommandEmpty>
                                <CommandGroup>
                                  {recipeTypes.map((type) => (
                                    <CommandItem
                                      key={type.value}
                                      value={type.value}
                                      onSelect={() => {
                                        form.setValue("recipeType", type.value)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          type.value === field.value ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {type.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={control}
                  name="preparationTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold flex items-center gap-2 text-emerald-800">
                        <Timer className="h-5 w-5" /> Timp de preparare
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <div className="relative flex items-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="rounded-r-none border-emerald-200"
                              onClick={() => field.onChange(Math.max(10, (field.value || 0) - 5))}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                              <Input
                                type="number"
                                value={field.value || 0}
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                                className={cn(
                                  "rounded-none border-x-0 pl-10 pr-3 text-center w-[100px] border-emerald-200",
                                  "[-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none",
                                )}
                                min={10}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="rounded-l-none border-emerald-200"
                              onClick={() => field.onChange((field.value || 0) + 5)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <span className="ml-2 font-medium text-emerald-700">minute</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="portions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold flex items-center gap-2 text-emerald-800">
                        <Users className="h-5 w-5" /> Număr de porții
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-r-none border-emerald-200"
                            onClick={() => field.onChange(Math.max(1, (field.value || 0) - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            className="w-16 rounded-none text-center border-x-0 border-emerald-200"
                            type="number"
                            min={1}
                            max={20}
                            {...field}
                            onChange={(e) => {
                              field.onChange(Number.parseFloat(e.target.value))
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-l-none border-emerald-200"
                            onClick={() => field.onChange(Math.min(20, (field.value || 0) + 1))}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <span className="ml-2 font-medium text-emerald-700">porții</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name="recipeDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold flex items-center gap-2 text-emerald-800">
                      <FileText className="h-5 w-5" /> Descriere
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Fă o scurtă descriere rețetei"
                        className="min-h-[100px] border-emerald-200 focus-visible:ring-emerald-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Ingredients Section */}
              <div className="space-y-4 bg-emerald-50 p-6 rounded-lg border border-emerald-100">
                <FormLabel
                  className={cn(
                    "text-lg font-semibold flex items-center gap-2 text-emerald-800",
                    selectedIngredients.length === 0 ? "text-red-600" : "",
                  )}
                >
                  <Utensils className="h-5 w-5" /> Ingrediente
                </FormLabel>

                <div className="relative">
                  <Input
                    placeholder="Caută ingrediente"
                    value={ingredientQuery}
                    onChange={(e) => setIngredientQuery(e.target.value)}
                    className="border-emerald-200 focus-visible:ring-emerald-500"
                  />
                  {ingredientSuggestions.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 border border-emerald-200 rounded-md p-2 max-h-40 overflow-y-auto bg-white shadow-lg">
                      {ingredientSuggestions.map((ingredient) => (
                        <li
                          key={ingredient.id}
                          className="cursor-pointer p-2 hover:bg-emerald-50 rounded-md transition-colors"
                          onClick={() => handleAddIngredient(ingredient)}
                        >
                          {ingredient.nume} ({ingredient.um})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {selectedIngredients.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-emerald-700 mb-2">Ingrediente selectate:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedIngredients.map((ingredient) => (
                        <div
                          key={ingredient.id}
                          className="flex items-center bg-white rounded-lg p-3 border border-emerald-200 shadow-sm"
                        >
                          <div className="flex-grow">
                            <p className="font-medium text-emerald-800">{ingredient.nume}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={ingredient.cantitate}
                              onChange={(e) => handleQuantityChange(ingredient.id, Number.parseFloat(e.target.value))}
                              className="w-20 text-center border-emerald-200"
                              // min={ingredient.um === "g" || ingredient.um === "ml" ? 10 : 1}
                              min={0}
                              // step={ingredient.um === "g" || ingredient.um === "ml" ? 10 : 1}
                            />
                            <span className="text-sm text-emerald-600 w-8">{ingredient.um}</span>
                            <Button
                              type="button"
                              onClick={() => handleRemoveIngredient(ingredient.id)}
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 border-red-200 text-red-500 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedIngredients.length === 0 && (
                  <p className="text-red-500 text-sm">Adăugați cel puțin un ingredient</p>
                )}
              </div>

              {/* Steps Section */}
              <div className="space-y-4 bg-emerald-50 p-6 rounded-lg border border-emerald-100">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-emerald-800">
                  <ChefHat className="h-5 w-5" /> Pași de preparare
                </h2>

                <div className="space-y-6">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="relative bg-white p-4 rounded-lg border border-emerald-200 shadow-sm"
                    >
                      <div className="absolute -left-3 -top-3">
                        <Badge
                          variant="outline"
                          className="bg-emerald-600 text-white border-0 rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold"
                        >
                          {index + 1}
                        </Badge>
                      </div>

                      <FormField
                        control={control}
                        name={`steps.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="ml-6">
                            <FormControl>
                              <Textarea
                                placeholder="Descrie pasul de pregătire"
                                maxLength={400}
                                {...field}
                                className="min-h-[80px] border-emerald-200 focus-visible:ring-emerald-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {fields.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          variant="outline"
                          size="icon"
                          className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-red-100 hover:bg-red-200 border-red-200 text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {fields.length < 100 && (
                  <Button
                    type="button"
                    onClick={() => append({ description: "" })}
                    variant="outline"
                    className="w-full mt-4 border-emerald-300 text-emerald-700 hover:bg-emerald-100"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adaugă încă un pas
                  </Button>
                )}
              </div>

              <Separator className="my-6" />

              <Button
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-6 text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Se procesează..." : "Adaugă rețeta"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default RecipeForm
  