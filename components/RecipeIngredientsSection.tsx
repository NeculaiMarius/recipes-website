"use client"
import React, { useState } from 'react'
import { Checkbox } from './ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Image from 'next/image'
import { Label } from './ui/label'
import { IngredientRecipePage } from '@/interfaces/ingredient'
import { FaInfoCircle } from 'react-icons/fa'
import { CheckedState } from '@radix-ui/react-checkbox'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { ImSpoonKnife } from 'react-icons/im'

const RecipeIngredientsSection = ({
  ingredients,
  recipePortions
}: {
  ingredients: IngredientRecipePage[],
  recipePortions: number
}) => {
  const [noPortions, setNoPortions] = useState(recipePortions);
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: CheckedState }>({});

  const toggleChecked = (id: number, state: CheckedState) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: state
    }));
  };

  const portionMultiplier = noPortions / recipePortions;

  return (
    <div className='flex flex-col justify-evenly max-md:py-4'>
      <div className='mx-auto flex gap-4 items-center font-bold'>
        <h1 className='bg-emerald-700 text-white text-2xl w-fit px-4 py-2 rounded-md shadow-md max-md:text-xl'>
          Lista de ingrediente
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger className='h-full'>
            <div className='flex items-center bg-gray-200 h-full px-4 py-2 rounded-full shadow-md gap-2 hover:bg-gray-300 hover:shadow-lg'>
              <span>{noPortions}</span>
              <ImSpoonKnife className='text-emerald-800' size={25} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-lg border-emerald-100 p-1 shadow-lg">
            <DropdownMenuLabel className="px-3 py-2 text-sm font-bold">
              Număr porții
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-emerald-100" />
            <div className="grid grid-cols-2 gap-1 p-1">
              {[1, 2, 3, 4, 5, 8].map((number) => (
                <DropdownMenuItem
                  key={number}
                  className="flex items-center justify-center rounded-md px-3 py-2 text-center font-medium transition-colors"
                  onClick={() => setNoPortions(number)}
                >
                  {number}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='relative w-[80%] mx-auto bg-gray-50 shadow-md py-4 lg:h-[70vh] max-md:w-full'>
        <div className="overflow-auto h-full">
          {ingredients.map(ingredient => {
            const isChecked = checkedItems[ingredient.id] || false;
            const scaledQuantity = ingredient.cantitate * portionMultiplier;
            const computeValue = (value: number) =>
              ingredient.um === 'buc'
                ? value * scaledQuantity
                : value * (scaledQuantity / 100);

            return (
              <React.Fragment key={ingredient.id}>
                <div
                  className={cn('text-xl grid grid-cols-[2fr_4fr_3fr_3fr_13fr_2fr] py-2 px-4 w-full items-center max-md:text-base max-md:py-1',
                    isChecked ? "saturate-0 line-through" : ""
                  )}
                >
                  <Checkbox
                    className='w-5 h-5'
                    checked={isChecked}
                    onCheckedChange={(state) => toggleChecked(ingredient.id, state)}
                  />
                  <Image
                    src={`/svg-icons/${ingredient.categorie}.svg`}
                    height={40}
                    width={40}
                    alt=''
                  />
                  <p>{scaledQuantity}</p>
                  <p>{ingredient.um}</p>
                  <p>{ingredient.nume}</p>
                  <Popover>
                    <PopoverTrigger><FaInfoCircle className='text-gray-500 text-2xl' /></PopoverTrigger>
                    <PopoverContent className='w-fit'>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium leading-none">Valori nutriționale</h4>
                          <p className="text-sm text-muted-foreground">
                            {`Valori pentru ${scaledQuantity.toFixed(2)} ${ingredient.um}`}
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-2 items-center gap-4">
                            <Label>Kcal</Label>
                            <div className='nutrition-field text-red-700'>{computeValue(ingredient.kcal).toFixed(2)}</div>
                          </div>
                          <div className="grid grid-cols-2 items-center gap-4">
                            <Label>Grăsimi</Label>
                            <div className='nutrition-field text-amber-600'>{computeValue(ingredient.grasimi).toFixed(2)} g</div>
                          </div>
                          <div className="grid grid-cols-2 items-center gap-4">
                            <Label>Carbohidrați</Label>
                            <div className='nutrition-field text-pink-700'>{computeValue(ingredient.carbohidrati).toFixed(2)} g</div>
                          </div>
                          <div className="grid grid-cols-2 items-center gap-4">
                            <Label>Proteine</Label>
                            <div className='nutrition-field text-cyan-700'>{computeValue(ingredient.proteine).toFixed(2)} g</div>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className='bg-gray-200 mx-4 h-[2.5px] rounded-full'></div>
              </React.Fragment>
            )
          })}
          <div className='h-10 max-lg:hidden'></div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none max-lg:hidden"></div>
      </div>
    </div>
  );
};

export default RecipeIngredientsSection;
