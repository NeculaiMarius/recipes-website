import AddRecipeForm from '@/components/AddRecipeForm'
import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from '@/components/ui/separator'
import { getServerSession } from 'next-auth'
import { options } from '@/app/api/auth/[...nextauth]/options'

const AddRecipe = async () => {
  const session=await getServerSession(options);
  const userId=session?.user.id  
  return (
    <div className='mt-[80px] justify-center p-[1px] bg-emerald-700'>
      <Card className='max-w-fit w-[98%] mx-auto my-[80px]'>
        <CardHeader>
          <CardTitle className='text-center'>Adaugă o nouă rețetă</CardTitle>
        </CardHeader>
        <Separator className='w-[80%] mx-auto mb-6 bg-emerald-700 h-[3px]' />
        <CardContent>
        <AddRecipeForm userId={userId} />
        </CardContent>
      </Card>
        
      

    </div>
  )
}

export default AddRecipe