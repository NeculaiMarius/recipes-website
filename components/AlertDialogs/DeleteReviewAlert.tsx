"use client"
import React from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import { deleteRecipe } from '@/app/stores/RecipeStore'
import { toast } from 'sonner'
import { deleteReview } from '@/app/stores/ReviewStore'


const DeleteReviewAlert = ({reviewId, author, recipe}:{reviewId:number,author:string, recipe:string}) => {
  const deleteReviewEvent = async () => {
      try {
        await deleteReview(reviewId)
        toast("Recenzie ștearsă", {
          description: (
            <div className='flex flex-col'>
              <span>Această recenzie a fost ștearsă cu succes</span>
            </div>
          ),
          duration: 5000
        })
      } catch (error) {
        console.error('Error deleting review:', error)
        toast("Recenzia nu a putut fi ștearsă", {
          description: `Vă rugăm încercați mai târziu`,
        })
      }
    }
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className='py-1 px-2 bg-red-600 text-white rounded-md'>
        Șterge recenzie
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ești sigur că vrei să stergi recenzia?</AlertDialogTitle>
          <AlertDialogDescription>
            <div className='flex flex-col gap-2'>
              <p>
                Această acțiune nu poate fi anulată. Acest lucru va duce la ștergerea definitivă a recenziei
                de pe serverele noastre.
              </p>
              <span>
                <p>Autor recenzie: {author}</p>
                <p>Pentru rețeta: {recipe}</p>
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anulare</AlertDialogCancel>
          <AlertDialogAction className='bg-red-600 text-white font-bold' onClick={deleteReviewEvent}>Șterge</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteReviewAlert