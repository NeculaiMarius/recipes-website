import { sql } from '@vercel/postgres'
import Image from 'next/image'
import React from 'react'

const page = async ({ searchParams }: { searchParams: { recipeId?: string} }) => {
  const response=await sql`SELECT * FRom l_retete WHERE id=${searchParams.recipeId}`;
  const recipe=response?.rows[0];
  return (
    <div className='mt-[80px] bg-yellow-200'>
      <div className='grid grid-cols-2'>
        <div className='bg-red-300'>
          <Image
            src={recipe?.image_url?recipe.image_url:""}
            alt="Card image"
            height={200}
            width={200}
          />
        </div>
        <div className='bg-gray-400'>
          <h1>{recipe?.nume}</h1>
        </div>
      </div>
    </div>
  )
}

export default page