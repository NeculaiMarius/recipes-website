"use client"
import React, { use } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import { deleteRecipe } from '@/app/stores/RecipeStore'
import { toast } from 'sonner'
import { approveRequest } from '@/app/stores/PremiumRequestStore'


const DeleteRecipeAlert = ({requestId, user}:{requestId:number,user:string}) => {
  const approveRequestEvent = async () => {
      try {
        await approveRequest(requestId)
        toast("Cerere aprobată", {
          description: (
            <div className='flex flex-col'>
              <span>Această cerere a fost acceptată cu succes</span>
            </div>
          ),
          duration: 5000
        })
      } catch (error) {
        console.error('Error appriving request:', error)
        toast("Cererea nu a putut fi acceptată", {
          description: `Vă rugăm încercați mai târziu`,
        })
      }
    }
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className='py-1 px-2 bg-green-700 text-white rounded-md'>
          Accepta cererea
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ești sigur că vrei să accepți această cerere?</AlertDialogTitle>
          <AlertDialogDescription>
            
            <div className='flex flex-col gap-2'>
              <p>
                Continuarea va duce la promovarea utlizatorului ${user} la statutul de utilizator premium.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anulare</AlertDialogCancel>
          <AlertDialogAction className='bg-green-700 text-white font-bold' onClick={approveRequestEvent}>Acceptă</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteRecipeAlert