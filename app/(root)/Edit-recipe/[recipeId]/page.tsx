import EditRecipeForm, { Recipe } from '@/components/Forms/EditRecipeForm'
import { sql } from '@vercel/postgres'
import React from 'react'

const page = async ({ params}:{params:{recipeId:string}}) => {
  const recipeResponse= await sql`SELECT * FROM l_retete WHERE id=${params.recipeId}`;
  const recipe:Recipe=recipeResponse.rows[0] as Recipe;
  

  return (
    <div className='mt-[80px]'>
      <EditRecipeForm recipe={recipe} userId={undefined}></EditRecipeForm>
    </div>
  )
}

export default page