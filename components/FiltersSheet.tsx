"use client"
import React, { useOptimistic, useTransition } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { useRouter } from 'next/navigation';
import { ingredientsFilters, recipeTypes } from '@/constants';

const FiltersSheet = ({ ingredients ,type}: { ingredients: string[] ,type:string}) => {
  const router = useRouter();
  const [optimisticIngredients, setOptimsticIngredients] = useOptimistic(ingredients);
  const [optimisticType,setOptimisticType]=useOptimistic(type);
  const [pending, startTransition] = useTransition();

  function updateIngredients(genres: string[],type:string) {
    let newParams = new URLSearchParams(
      genres.map((genre) => ["ingredient", genre])
    );
    startTransition(() => {
      setOptimsticIngredients(ingredients);
      router.push(`?${newParams}`);
    });
  }


  function updateFilters(newIngredients?: string[], newType?: string) {
    let newParams = new URLSearchParams();
  
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
  return (
    <div>
      <Sheet>
          <SheetTrigger className='flex items-center p-2 bg-emerald-700 text-white rounded-md'>
            <span className="material-symbols-outlined bold-symbol text-4xl">menu</span></SheetTrigger>
          <SheetContent side={'left'}>
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
                        let newGenres = isSelected
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
          </SheetContent>
        </Sheet>
    </div>
  )
}

export default FiltersSheet