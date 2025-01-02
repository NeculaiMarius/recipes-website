"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from "./ui/textarea";
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";



const formSchema = z.object({
  file: z.any().refine((value) => {return value && value instanceof FileList && value.length > 0;}, { message: "File is required" }),
  recipeName: z.string().min(1, "Recipe name is required"),
  steps: z.array(
    z.object({
      description: z.string().min(1, "Introduceti descrierea pasului").max(199,"Maxim 200 caractere"),
    })
  ).nonempty({ message: "At least one step is required" }),
  recipeDescription: z.string().min(1).max(1000),
});



const RecipeForm = ({userId}:{userId:string|undefined}) => {
  const router=useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipeName: "",
      steps: [{ description: "" }],
      recipeDescription: "",
    },
  });

  const { control, handleSubmit,formState:{errors} } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  const fileRef = form.register("file");

  const [ingredientQuery, setIngredientQuery] = useState("");
  const [ingredientSuggestions, setIngredientSuggestions] = useState<{ id: string; nume: string; um: string }[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<{ id: string; nume: string; um: string; quantity: number }[]>([]);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);  

  const [isLoading,setIsLoading]=useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); 
      reader.onloadend = () => {
        setSelectedImage(reader.result as string||null); 
        setSelectedFile(file);
      };
    }
  };

  useEffect(() => {
    const fetchIngredients = async () => {
      if (ingredientQuery.trim()) {
        try {
          const response = await fetch(`/api/ingredients?query=${encodeURIComponent(ingredientQuery)}`);
          const data = await response.json();
          setIngredientSuggestions(data.ingredients || []);
        } catch (error) {
          console.error("Failed to fetch ingredients:", error);
        }
      } else {
        setIngredientSuggestions([]);
      }
    };
    fetchIngredients();
  }, [ingredientQuery]);


  const handleAddIngredient = (ingredient: { id: string; nume: string; um: string }) => {
    const isIngredientAlreadySelected = selectedIngredients.some(item => item.id === ingredient.id);
    if (!isIngredientAlreadySelected) {
      setSelectedIngredients((prev) => [...prev, { ...ingredient, quantity: (ingredient.um==="g"||ingredient.um==="ml")?10:1 }]); 
    }
    setIngredientQuery("");
    setIngredientSuggestions([]);
  };

  const handleRemoveIngredient = (id: string) => {
    setSelectedIngredients((prev) => prev.filter(ingredient => ingredient.id !== id));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setSelectedIngredients((prev) =>
      prev.map(ingredient =>
        ingredient.id === id ? { ...ingredient, quantity } : ingredient
      )
    );
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {

    if (!selectedFile || selectedIngredients.length<=0) return;


    const ingredientsWithQuantities = selectedIngredients.map((ingredient) => ({
      id: ingredient.id, 
      quantity: ingredient.quantity, 
    }));



    //IMAGE UPLOAD IN CLOUDINARY 

    const response = await fetch('/api/cloudinary-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: selectedImage }),
    });
    const result=await response.json();
    const imagePublicId=result.id;
    const imageUrl=result.imageUrl;


    // INSERT RECIPE IN DATABASE

    try {
      const response = await fetch('/api/add-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeName: values.recipeName,
          recipeDescription: values.recipeDescription,
          steps: values.steps.map(step => step.description), 
          ingredients: ingredientsWithQuantities,
          imageUrl:imageUrl,
          imagePublicId:imagePublicId,
          userId: userId,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit recipe');
      }
      else{
        router.push("/");
      }
  
    } catch (error) {
      console.error("Submission error:", error);
    }
  }


  return (
    <div className='flex  w-full justify-center'>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-[900px]">
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className={cn('text-lg font-semibold',errors.file?'text-red-500':'')}>Adaugă o imagine</FormLabel>
                  <div>{errors.file?.message as string}</div>
                  <FormControl>
                    <Input 
                      type="file" 
                      placeholder="shadcn" 
                      accept="image/*"
                      className="" 
                      {...fileRef} 
                      onChange={(e) => {
                        fileRef.onChange(e); 
                        handleImageChange(e); 
                      }}
                    />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          {selectedImage && (
                    <div className="mt-4">
                      <Image
                        width={200}
                        height={100}
                        src={selectedImage}
                        alt="Preview Imagine"
                        className="rounded-md max-w-40 max-h-64"
                      />
                    </div>
                  )}


          <FormField
            control={control}
            name="recipeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg font-semibold'>Numele rețetei</FormLabel>
                <FormControl>
                  <Input placeholder="Introdu numele rețetei" maxLength={50} {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          

          <FormField
            control={control}
            name="recipeDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-lg font-semibold'>Descriere</FormLabel>
                <FormControl>
                <Textarea 
                  placeholder="Fă o scurtă descriere rețetei" 
                  className="min-h-[100px]"
                  {...field} 
                />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Ingredient Search */}
          <div className="space-y-2">
            <FormLabel className={cn('text-lg font-semibold',selectedIngredients.length==0?'text-red-600':"")}>Ingrediente</FormLabel>
            <Input
              placeholder="Caută ingrediente"
              value={ingredientQuery}
              onChange={(e) => setIngredientQuery(e.target.value)}
            />
            {ingredientSuggestions.length > 0 && (
              <ul className="border p-2 max-h-40 overflow-y-auto bg-white">
                {ingredientSuggestions.map((ingredient) => (
                  <li
                    key={ingredient.id}
                    className="cursor-pointer p-1 hover:bg-gray-200"
                    onClick={() => handleAddIngredient(ingredient)}
                  >
                    {ingredient.nume} ({ingredient.um})
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap space-x-2 mt-2">
              {selectedIngredients.map((ingredient) => (
                <div key={ingredient.id} className="bg-gray-300 rounded px-2 py-1 text-sm flex items-center space-x-2">
                  <span>{ingredient.nume} ({ingredient.um})</span>
                  <Input
                    type="number"
                    value={ingredient.quantity}
                    onChange={(e) => handleQuantityChange(ingredient.id, parseFloat(e.target.value))}
                    className="w-16"
                    min={(ingredient.um==="g"||ingredient.um==="ml")?10:1}
                    step={(ingredient.um==="g"||ingredient.um==="ml")?10:1}
                  />
                  <Button
                    type="button"
                    onClick={() => handleRemoveIngredient(ingredient.id)}
                    variant="outline"
                    className="bg-red-600 text-white"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className='space-y-4'>
            <h2 className="text-lg font-semibold">Pași de preparare</h2>
            {fields.map((field, index) => (
              <div key={field.id} className="flex space-x-2">
                <FormField
                  control={control}
                  name={`steps.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Pas {index + 1}</FormLabel>
                      <FormControl>
                        <Input placeholder="Descrie pasul de pregătire" maxLength={199} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {fields.length>1?
                <Button type="button" onClick={() => remove(index)} variant="outline" className="self-end bg-red-600 text-white">
                  <span className="material-symbols-outlined">delete</span>
                </Button>
                :null}
              </div>
            ))}
            {fields.length<10?
              <Button
                type="button"
                onClick={() => append({ description: "" })}
                className="mt-2"
              >
                Adauga încă un pas
              </Button>
            :null}
          </div>

          <Button type="submit" className="w-full">
            Adaugă rețeta
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RecipeForm;
