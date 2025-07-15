"use client"

import { useState, type ChangeEvent } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
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
  Save,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Recipe type definition
export interface Recipe{
  id:number,
  nume:string,
  descriere:string,
  image_url:string,
  image_public_id:string
  pasi_preparare:string,
  id_utilizator:string,
  tip:string,
  numar_portii:number,
  timp_preparare:number,
}

const formSchema = z.object({
  file: z.any().optional(),
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

interface EditRecipeFormProps {
  recipe: Recipe
  userId: string | undefined
}

const EditRecipeForm = ({ recipe, userId }: EditRecipeFormProps) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipeName: recipe.nume,
      recipeType: recipe.tip,
      portions: recipe.numar_portii,
      preparationTime: recipe.timp_preparare,
      steps: recipe.pasi_preparare.split(';').map((step) => ({ description: step })),
      recipeDescription: recipe.descriere,
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
  const [selectedImage, setSelectedImage] = useState<string | null>(recipe.image_url)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageChanged, setImageChanged] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setSelectedImage((reader.result as string) || null)
        setSelectedFile(file)
        setImageChanged(true)
      }
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setSelectedFile(null)
    setImageChanged(true)
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    let imageUrl = recipe.image_url
    let imagePublicId = recipe.image_public_id

    // Only upload new image if it was changed
    if (imageChanged && selectedFile && selectedImage) {
      try {
        const response = await fetch("/api/cloudinary-upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: selectedImage }),
        })
        const result = await response.json()
        imagePublicId = result.id
        imageUrl = result.imageUrl
      } catch (error) {
        console.error("Image upload error:", error)
        setIsLoading(false)
        return
      }
    } else if (imageChanged && !selectedImage) {
      // Image was removed
      imageUrl = ""
      imagePublicId = ""
    }

    // UPDATE RECIPE IN DATABASE
    try {
      const response = await fetch(`/api/recipe/${recipe.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id:recipe.id,
          nume: values.recipeName,
          descriere: values.recipeDescription,
          tip: values.recipeType,
          timp_preparare: values.preparationTime,
          numar_portii: values.portions,
          pasi_preparare: values.steps.map((step) => step.description).join(";"),
          image_public_id: imagePublicId,
          image_url:imageUrl
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update recipe")
      } else {
        router.push(`/Discover-recipes/Recipe-page?recipeId=${recipe.id}`)
      }
    } catch (error) {
      console.error("Update error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 lg:w-[60vw]">
      <Card className="mx-auto shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 border-b">
          <CardTitle className="text-2xl font-bold text-blue-800">Editează rețeta</CardTitle>
          <CardDescription>Modifică detaliile rețetei tale</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Image Upload Section */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn(
                          "text-lg font-semibold flex items-center gap-2",
                          errors.file ? "text-red-500" : "text-blue-800",
                        )}
                      >
                        <Upload className="h-5 w-5" /> Imagine rețetă
                      </FormLabel>
                      <FormMessage />
                      <FormControl>
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-lg p-6 transition-all hover:border-blue-400 bg-white">
                          {!selectedImage ? (
                            <>
                              <div className="mb-4 text-blue-500">
                                <Upload className="h-12 w-12 mx-auto" />
                              </div>
                              <p className="text-sm text-center text-muted-foreground mb-2">
                                Trage și plasează sau apasă pentru a încărca o imagine nouă
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
                                onClick={handleRemoveImage}
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
                              <div className="mt-2 text-center">
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
                              </div>
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
                      <FormLabel className="text-lg font-semibold flex items-center gap-2 text-blue-800">
                        <ChefHat className="h-5 w-5" /> Numele rețetei
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Introdu numele rețetei"
                          maxLength={50}
                          {...field}
                          className="border-blue-200 focus-visible:ring-blue-500"
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
                      <FormLabel className="text-lg font-semibold flex items-center gap-2 text-blue-800">
                        <Utensils className="h-5 w-5" /> Tipul rețetei
                      </FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between border-blue-200",
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
                      <FormLabel className="text-lg font-semibold flex items-center gap-2 text-blue-800">
                        <Timer className="h-5 w-5" /> Timp de preparare
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <div className="relative flex items-center">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="rounded-r-none border-blue-200 bg-transparent"
                              onClick={() => field.onChange(Math.max(10, (field.value || 0) - 5))}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-500" />
                              <Input
                                type="number"
                                value={field.value || 0}
                                onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                                className={cn(
                                  "rounded-none border-x-0 pl-10 pr-3 text-center w-[100px] border-blue-200",
                                  "[-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none",
                                )}
                                min={10}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="rounded-l-none border-blue-200 bg-transparent"
                              onClick={() => field.onChange((field.value || 0) + 5)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <span className="ml-2 font-medium text-blue-700">minute</span>
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
                      <FormLabel className="text-lg font-semibold flex items-center gap-2 text-blue-800">
                        <Users className="h-5 w-5" /> Număr de porții
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="rounded-r-none border-blue-200 bg-transparent"
                            onClick={() => field.onChange(Math.max(1, (field.value || 0) - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            className="w-16 rounded-none text-center border-x-0 border-blue-200"
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
                            className="rounded-l-none border-blue-200 bg-transparent"
                            onClick={() => field.onChange(Math.min(20, (field.value || 0) + 1))}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <span className="ml-2 font-medium text-blue-700">porții</span>
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
                    <FormLabel className="text-lg font-semibold flex items-center gap-2 text-blue-800">
                      <FileText className="h-5 w-5" /> Descriere
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Fă o scurtă descriere rețetei"
                        className="min-h-[100px] border-blue-200 focus-visible:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Steps Section */}
              <div className="space-y-4 bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-800">
                  <ChefHat className="h-5 w-5" /> Pași de preparare
                </h2>
                <div className="space-y-6">
                  {fields.map((field, index) => (
                    <div key={field.id} className="relative bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                      <div className="absolute -left-3 -top-3">
                        <Badge
                          variant="outline"
                          className="bg-blue-600 text-white border-0 rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold"
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
                                className="min-h-[80px] border-blue-200 focus-visible:ring-blue-500"
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
                    className="w-full mt-4 border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adaugă încă un pas
                  </Button>
                )}
              </div>

              <Separator className="my-6" />

              <div className="flex gap-4">
                <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
                  Anulează
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-6 text-lg"
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-5 w-5" />
                  {isLoading ? "Se salvează..." : "Salvează modificările"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditRecipeForm
