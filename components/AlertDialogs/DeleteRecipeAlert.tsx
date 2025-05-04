"use client"
import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import { deleteRecipe } from '@/app/stores/RecipeStore'
import { toast } from 'sonner'


const DeleteRecipeAlert = ({recipeId, author, recipe}:{recipeId:number,author:string, recipe:string}) => {
  const deleteRecipeEvent = async () => {
      try {
        await deleteRecipe(recipeId)
        toast("Rețetă ștearsă", {
          description: (
            <div className='flex flex-col'>
              <span>Această rețetă a fost ștearsă cu succes</span>
            </div>
          ),
          duration: 5000
        })
      } catch (error) {
        console.error('Error deleting recipe:', error)
        toast("Rețetă nu a putut fi ștearsă", {
          description: `Vă rugăm încercați mai târziu`,
        })
      }
    }
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className='py-1 px-2 bg-red-600 text-white rounded-md'>
        Șterge rețeta

        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ești sigur că vrei să stergi rețeta?</AlertDialogTitle>
          <AlertDialogDescription>
            
            <div className='flex flex-col gap-2'>
              <p>
                Această acțiune nu poate fi anulată. Acest lucru va duce la șterge definitivă a rețetei
                de pe serverele noastre.
              </p>
              <span>
                <p>Nume rețetă: {recipe}</p>
                <p>Autor: {author}</p>
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anulare</AlertDialogCancel>
          <AlertDialogAction className='bg-red-600 text-white font-bold' onClick={deleteRecipeEvent}>Șterge</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteRecipeAlert