
import React, { useEffect, useState } from 'react'

import { RecipeDisplay } from '@/interfaces/recipe';
import RecipeDisplayCard from '@/components/RecipeDisplayCard';
import FilterOrderContainer from '@/components/FilterOrderContainer';
import FridgeIngredientsSections from '@/components/FridgeIngredientsSections';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { sql } from '@vercel/postgres';
import PaginationComponent from '@/components/PaginationComponent';


let totalCountCache: number | null = null;

const MyFridge = async ({ searchParams }: { searchParams: { page?: string,query?:string,order?:string } }) => {
  const session=await getServerSession(options)
  const searchQuery = searchParams?.query || '';
  const order = searchParams?.order || ''; 

  const page = parseInt(searchParams.page || '1', 10); 
  const limit=12;
  const offset = (page - 1) * limit;

  if (totalCountCache === null) {
    const countResult = await sql`SELECT COUNT(*) FROM (
      SELECT 
          r.id
        FROM l_retete r
        JOIN l_utilizatori u ON r.id_utilizator = u.id
        LEFT JOIN l_reviews v ON v.id_reteta = r.id
        LEFT JOIN l_retete_apreciate a ON a.id_reteta = r.id
        LEFT JOIN l_retete_salvate s ON s.id_reteta = r.id
        JOIN l_retete_ingrediente ri ON r.id = ri.id_reteta
        LEFT JOIN l_ingrediente_frigider f 
            ON ri.id_ingredient = f.id_ingredient 
            AND f.id_utilizator = 1 
        WHERE
          lower(r.nume) LIKE lower(${`%${searchQuery}%`})
        GROUP BY r.id, r.nume, u.nume, r.image_url
      );`;
    totalCountCache = parseInt(countResult?.rows[0].count, 10); 
  }

  const totalPages = Math.ceil(totalCountCache / limit);

  const query =`
    SELECT 
      r.id, 
      r.nume, 
      u.nume AS utilizator, 
      r.image_url, 
      COALESCE(AVG(v.rating), 0) AS rating,
      COUNT(DISTINCT a.id) AS numar_aprecieri,
      COUNT(DISTINCT s.id) AS numar_salvari,
      CASE 
          WHEN EXISTS (
              SELECT 1 FROM l_retete_apreciate a 
              WHERE a.id_reteta = r.id AND a.id_utilizator = ${session?.user.id}
          ) THEN TRUE 
          ELSE FALSE 
      END AS liked,
      CASE 
          WHEN EXISTS (
              SELECT 1 FROM l_retete_salvate s 
              WHERE s.id_reteta = r.id AND s.id_utilizator = ${session?.user.id}
          ) THEN TRUE 
          ELSE FALSE 
      END AS saved,
      SUM(
          CASE 
              WHEN f.cantitate IS NOT NULL THEN LEAST(f.cantitate / NULLIF(ri.cantitate, 0), 1)
              ELSE 0
          END
      ) AS ingrediente_gasite,
      COUNT(ri.id_ingredient) AS ingrediente_totale,
      COALESCE(
          SUM(
              CASE 
                  WHEN f.cantitate IS NOT NULL THEN LEAST(f.cantitate / NULLIF(ri.cantitate, 0), 1)
                  ELSE 0
              END
          ) / NULLIF(COUNT(ri.id_ingredient), 0),
          0
      ) AS procent_ingrediente
    FROM l_retete r
    JOIN 
      l_utilizatori u ON r.id_utilizator = u.id
    LEFT JOIN 
      l_reviews v ON v.id_reteta = r.id
    LEFT JOIN 
      l_retete_apreciate a ON a.id_reteta = r.id
    LEFT JOIN 
      l_retete_salvate s ON s.id_reteta = r.id
    JOIN l_retete_ingrediente ri ON r.id = ri.id_reteta
    LEFT JOIN l_ingrediente_frigider f 
        ON ri.id_ingredient = f.id_ingredient 
        AND f.id_utilizator = 1
    WHERE
      lower(r.nume) LIKE lower('%${searchQuery}%')
    GROUP BY r.id, r.nume, u.nume, r.image_url
    ORDER BY procent_ingrediente DESC, (${order?order:'r.id'}) DESC
    LIMIT ${limit} OFFSET ${offset};
    `;

    const result=await sql.query(query)
    const recipes:RecipeDisplay[]=result?.rows 



  return (
    <div className=' pt-[90px] h-screen w-full max-md:h-fit'>
      <div className='w-full h-full grid grid-cols-[35%_65%] rounded-3xl max-md:grid-cols-1 overflow-hidden'>
        <FridgeIngredientsSections />

        <div className='md:hidden bg-emerald-700 py-8 my-10'>
          Rețete sugerate
        </div>

        <div className='flex flex-col-reverse overflow-auto'>
          <PaginationComponent totalPages={totalPages} page={page}/>
          <div className='justify-evenly flex flex-wrap pt-4 w-full'>
            {recipes.map((recipe)=>{
              return(
                <RecipeDisplayCard recipe={recipe} id_user={session?.user.id||''} key={recipe.id} />
              )
            })}
          </div>
          <FilterOrderContainer/>          
        </div>
      </div>
    </div>
  )
}

export default MyFridge



