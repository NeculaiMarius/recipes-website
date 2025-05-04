"use client"
import React, { use } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog'
import { toast } from 'sonner'
import { approveRequest, refuseRequest } from '@/app/stores/PremiumRequestStore'


const DeleteRecipeAlert = ({requestId, user}:{requestId:number,user:string}) => {
  const refuseRequestEvent = async () => {
      try {
        await refuseRequest(requestId)
        toast("Cerere respinsă", {
          description: (
            <div className='flex flex-col'>
              <span>Această cerere a fost respinsă cu succes</span>
            </div>
          ),
          duration: 5000
        })
      } catch (error) {
        console.error('Error appriving request:', error)
        toast("Cererea nu a putut fi refuzată", {
          description: `Vă rugăm încercați mai târziu`,
        })
      }
    }
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div className='py-1 px-2 bg-red-700 text-white rounded-md'>
          Refuză cererea
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ești sigur că vrei să refuzi această cerere?</AlertDialogTitle>
          <AlertDialogDescription>
            
            <div className='flex flex-col gap-2'>
              <p>
                Continuarea va duce la refuzarea cererii utlizatorului ${user} .
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anulare</AlertDialogCancel>
          <AlertDialogAction className='bg-red-600 text-white font-bold' onClick={refuseRequestEvent}>Refuză</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteRecipeAlert