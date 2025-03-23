"use client"
import React from 'react'
import { IoMdSettings } from 'react-icons/io'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Pencil, Trash2 } from 'lucide-react'
import { deleteRecipe } from '@/app/stores/RecipeStore'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'


const RecipeSettingsButton = ({recipeId}:{recipeId:number}) => {
  const router = useRouter(); 

  const deleteRecipeEvent= async() =>{
    try {
      await deleteRecipe(recipeId)
      toast("Rețetă ștearsă", {
        description: 
          <div className='flex flex-col'>
            <span>Această rețetă a fost ștearsă cu succes</span>
            <span>Veți fi redirecționar in 5 secunde...</span>
          </div>,
        duration: 5000
      })
      setTimeout(()=>{
        router.back();
      },5000)
    } catch (error) {
      console.error('Error deleting recipe:', error);
      toast("Rețetă nu a putut fi ștearsă", {
        description: `Vă rog încercați mai târziu`,
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex h-12 w-12 cursor-pointer items-center rounded-md bg-emerald-700 p-2">
          <IoMdSettings className="text-3xl text-white" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 p-0">
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 p-3">
          <h3 className="text-base font-bold text-white">Setări</h3>
          <div className="mt-1 h-0.5 w-10 rounded-full bg-white/30"></div>
        </div>

        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 text-emerald-700 hover:bg-emerald-700/10">
          <Pencil className="h-4 w-4" />
          Editeaza reteta
        </DropdownMenuItem>
        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 text-red-600 hover:bg-red-50"
                          onClick={deleteRecipeEvent}>
          <Trash2 className="h-4 w-4" />
          Sterge reteta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default RecipeSettingsButton