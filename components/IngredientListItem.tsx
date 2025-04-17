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


const IngredientListItem = ({ingredient}:{ingredient:IngredientRecipePage}) => {
  const [checked,setChecked]=useState<CheckedState>(false);
  return (
    <div
      className={cn('text-xl grid grid-cols-[2fr_4fr_3fr_3fr_13fr_2fr] py-2 px-4 w-full items-center max-md:text-base max-md:py-1',
        checked?"saturate-0 line-through":""
      )}
      key={ingredient.id}
    >
      <Checkbox className='w-5 h-5 ' checked={checked} onCheckedChange={setChecked}/>
      <Image
        src={`/svg-icons/${ingredient.categorie}.svg`}
        height={40}
        width={40}
        alt='' 
      />
      <p>{ingredient.cantitate}</p>
      <p>{ingredient.um}</p>
      <p>{ingredient.nume}</p>
      <Popover>
        <PopoverTrigger><FaInfoCircle className='text-gray-500 text-2xl' /></PopoverTrigger>
        <PopoverContent className='w-fit'>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Valori nutriționale</h4>
              <p className="text-sm text-muted-foreground">
                {`Valori pentru ${ingredient.cantitate} ${ingredient.um}`}
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="width">Kcal</Label>
                <div className='nutrition-field text-red-700'>{(ingredient.um=='buc'?ingredient.kcal*ingredient.cantitate:ingredient.kcal*(ingredient.cantitate/100)).toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="maxWidth">Grasimi</Label>
                <div className='nutrition-field text-amber-600'>{(ingredient.um=='buc'?ingredient.grasimi*ingredient.cantitate:ingredient.grasimi*(ingredient.cantitate/100)).toFixed(2)} g</div>
              </div>
              <div className="grid grid-cols-2  items-center gap-4">
                <Label htmlFor="height">Carbohidrați</Label>
                <div className='nutrition-field text-pink-700'>{(ingredient.um=='buc'?ingredient.carbohidrati*ingredient.cantitate:ingredient.carbohidrati*(ingredient.cantitate/100)).toFixed(2)} g</div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="maxHeight">Proteine</Label>
                <div className='nutrition-field text-cyan-700'>{(ingredient.um=='buc'?ingredient.proteine*ingredient.cantitate:ingredient.proteine*(ingredient.cantitate/100)).toFixed(2)} g</div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default IngredientListItem