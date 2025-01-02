
import { options } from '@/app/api/auth/[...nextauth]/options';
import PaginationComponent from '@/components/PaginationComponent';
import RecipeDisplayCard from '@/components/RecipeDisplayCard'
import { sql } from '@vercel/postgres';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import React from 'react'


export async function generateMetadata() {
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, must-revalidate, no-cache, max-age=0');

  return { headers };
}


let totalCountCache: number | null = null;

const DiscoverRecipes = async ({ searchParams }: { searchParams: { page?: string} }) => {
  const session=await getServerSession(options);
  
  const page = parseInt(searchParams.page || '1', 10); 
  const limit=12;
  const offset = (page - 1) * limit;

  const result = await sql`
    SELECT 
      r.id, 
      r.nume, 
      u.nume AS utilizator, 
      r.image_url, 
      a.id AS id_aprecieri 
    FROM 
      l_retete r
    JOIN 
      l_utilizatori u ON r.id_utilizator = u.id
    LEFT JOIN 
      l_retete_apreciate a ON a.id_reteta = r.id  
    LIMIT ${limit} OFFSET ${offset}
  `;
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
            <RecipeDisplayCard id_recipe={recipe.id} name={recipe.nume} rating={"5"} author={recipe.utilizator} route={recipe.image_url} id_user={session?.user.id||""} liked={recipe.id_aprecieri != null} key={recipe.id}></RecipeDisplayCard>
          );
        })}
      </div>
      
      <PaginationComponent totalPages={totalPages} page={page}/>
    </>
  )
}

export default DiscoverRecipes