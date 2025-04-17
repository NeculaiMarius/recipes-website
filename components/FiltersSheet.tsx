"use client"
import React, { useOptimistic, useTransition } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { useRouter } from 'next/navigation';
import { ingredientsFilters, recipeTypes } from '@/constants';
import { FaFilter, FaQuestion } from 'react-icons/fa';
import Link from 'next/link';
import { Button } from './ui/button';

const FiltersSheet = ({ ingredients ,type}: { ingredients: string[] ,type:string}) => {
  const router = useRouter();
  const [optimisticIngredients, setOptimsticIngredients] = useOptimistic(ingredients);
  const [optimisticType,setOptimisticType]=useOptimistic(type);
  const [pending, startTransition] = useTransition();

  function updateFilters(newIngredients?: string[], newType?: string) {
    const newParams = new URLSearchParams();
  
    (newIngredients || optimisticIngredients).forEach((ingredient) => {
      newParams.append("ingredient", ingredient);
    });
  
    if (newType !== undefined) {
      newParams.set("type", newType);
    } else if (optimisticType) {
      newParams.set("type", optimisticType);
    }
  
    startTransition(() => {
      if (newIngredients !== undefined) setOptimsticIngredients(newIngredients);
      if (newType !== undefined) setOptimisticType(newType);
      router.push(`?${newParams}`);
    });
  }

  const fetchRandomRecipeId = async () => {
    try {
      const response = await fetch('/api/recipe/get-random-recipe-id');
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      const recipeId = data.id;
      if (!recipeId) {
        throw new Error('No recipe ID received');
      }
      router.push(`/Discover-recipes/Recipe-page?recipeId=${recipeId}`);
    } catch (err) {
      console.error('Error fetching random recipe ID:', err);
    }
  };
  return (
    <div>
      <Sheet>
          <SheetTrigger className='h-12 w-12 flex justify-center items-center p-2 bg-emerald-700 text-white rounded-md'>
            <FaFilter className='text-2xl' />
          </SheetTrigger>
          <SheetContent side={'left'} >
            <SheetHeader>
              <SheetTitle>Filtre</SheetTitle>
              <SheetDescription>
                Descoperă rețetele potrivite pentru tine cu ajutorul filtrelor
              </SheetDescription>

              <div className='flex flex-wrap gap-2'>
                {ingredientsFilters.map((ingredient) => {
                  const isSelected = optimisticIngredients.includes(ingredient.id);
                  return (
                    <div
                      key={ingredient.id}
                      className={`cursor-pointer px-3 py-1 rounded-full transition-colors duration-200 
                        ${isSelected ? "bg-emerald-700 text-white" : "bg-gray-200 text-gray-800"}`}
                      onClick={() => {
                        const newGenres = isSelected
                          ? optimisticIngredients.filter((i) => i !== ingredient.id)
                          : [...optimisticIngredients, ingredient.id];
                        updateFilters(newGenres,optimisticType);
                      }}
                    >
                      {ingredient.name}
                    </div>
                  );
                })}

                <button onClick={() => updateFilters([],optimisticType)}>Clear</button>
              </div>

              <div>
                <h1>Tipul rețetei</h1>
                <div className='flex flex-col gap-2'>
                {recipeTypes.map((recipeType) => {
                  const isSelected = optimisticType === recipeType.value;
                  
                  return (
                    <div 
                      key={recipeType.value}
                      className={`cursor-pointer px-4 py-2 rounded-md shadow-sm transition-colors duration-200 
                        ${isSelected ? "bg-emerald-700 text-white" : "bg-gray-100 text-gray-800"}`}
                      onClick={() => updateFilters(undefined, isSelected ? "" : recipeType.value)}
                    >
                      <span>{recipeType.label}</span>
                    </div>
                  );
                })}
                </div>
              </div>
            </SheetHeader>
            <SheetFooter className=''>
              <div className='w-full flex justify-center absolute bottom-6 left-0'>
                <Button variant={'outline'} className='text-emerald-700 border-emerald-700 gap-2' onClick={fetchRandomRecipeId}>
                <FaQuestion /> Surprinde-mă <FaQuestion />
                </Button>
              </div>
              
            </SheetFooter>

          </SheetContent>
        </Sheet>
    </div>
  )
}

export default FiltersSheet