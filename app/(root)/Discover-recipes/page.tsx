
import PaginationComponent from '@/components/PaginationComponent';
import RecipeDisplayCard from '@/components/RecipeDisplayCard'
import { sql } from '@vercel/postgres';
import React from 'react'
export const revalidate = 0;

let totalCountCache: number | null = null;

const DiscoverRecipes = async ({ searchParams }: { searchParams: { page?: string} }) => {
  const page = parseInt(searchParams.page || '1', 10); 
  const limit=12;
  const offset = (page - 1) * limit;

  const result= await sql`SELECT r.id,r.nume ,u.nume as utilizator,image_url FROM l_retete r, l_utilizatori u
                          WHERE r.utilizator=u.id LIMIT ${limit} OFFSET ${offset}`;
  const rows = result?.rows;

  if (totalCountCache === null) {
    const countResult = await sql`SELECT COUNT(*) FROM l_retete`;
    totalCountCache = parseInt(countResult?.rows[0].count, 10);
  }

  const totalPages = Math.ceil(totalCountCache / limit);

  return (
    <>
      <div className='mt-[80px] flex flex-wrap justify-center pt-8'>
        {rows?.map((recipe) => {
          return (
            <RecipeDisplayCard name={recipe.nume} rating={"5"} author={recipe.utilizator} route={recipe.image_url} key={recipe.id}></RecipeDisplayCard>
          );
        })}
      </div>
      
      <PaginationComponent totalPages={totalPages} page={page}/>
    </>
  )
}

export default DiscoverRecipes