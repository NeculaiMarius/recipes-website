
import { options } from '@/app/api/auth/[...nextauth]/options';
import FilterOrderContainer from '@/components/FilterOrderContainer';
import FiltersSheet from '@/components/FiltersSheet';
import PaginationComponent from '@/components/PaginationComponent';
import RecipeDisplayCard from '@/components/RecipeDisplayCard'
import RecipeHistorySection from '@/components/RecipeHistorySection';
import { RecipeDisplay } from '@/interfaces/recipe';
import { sql } from '@vercel/postgres';
import { getServerSession } from 'next-auth';
import React from 'react'


export async function generateMetadata() {
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, must-revalidate, no-cache, max-age=0');

  return { headers };
}


let totalCountCache: number | null = null;

const DiscoverRecipes = async ({ searchParams }: { searchParams: { page?: string,query?:string,order?:string, [key: string]: string | string[] | undefined} }) => {
  const session=await getServerSession(options);

  const ingredients = Array.isArray(searchParams.ingredient)
    ? searchParams.ingredient
    : searchParams.ingredient
    ? [searchParams.ingredient]
    : [];

  const type = Array.isArray(searchParams.type) 
    ? searchParams.type[0]  
    : searchParams.type || ""; 
  const searchQuery = searchParams?.query || '';
  const order = searchParams?.order || ''; 

  const prepTime = searchParams.prepTime? parseInt(searchParams.prepTime as string):null;

  const page = parseInt(searchParams.page || '1', 10); 
  const limit=20;
  const offset = (page - 1) * limit;

  
  const ingredientsQuery = ingredients.length > 0 ? ingredients.join(',') : null;
  const query: string = `
    SELECT 
      r.id, 
      r.nume, 
      u.nume AS nume_utilizator, 
      u.prenume AS prenume_utilizator,
      u.rol,
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
      END AS saved
    FROM 
      l_retete r
    JOIN 
      l_utilizatori u ON r.id_utilizator = u.id
    LEFT JOIN 
      l_reviews v ON v.id_reteta = r.id
    LEFT JOIN 
      l_retete_apreciate a ON a.id_reteta = r.id
    LEFT JOIN 
      l_retete_salvate s ON s.id_reteta = r.id
    LEFT JOIN 
      l_retete_ingrediente ri ON ri.id_reteta = r.id
    LEFT JOIN 
      l_ingrediente i ON i.id = ri.id_ingredient
    WHERE
      r.tip LIKE '%${type}%'
    AND
      lower(r.nume) LIKE lower('%${searchQuery}%')
    ${ingredients.length > 0 ? `AND i.id IN (${ingredientsQuery})` : ''}
    ${prepTime?`AND timp_preparare <= ${prepTime}`:``}
    GROUP BY 
      r.id, r.nume, u.nume, r.image_url, u.prenume, u.rol
    ${ingredients.length > 0 ? `HAVING COUNT(DISTINCT i.id) = ${ingredients.length}` : ''}
    ORDER BY 
      ${order 
    ? `${order} DESC` 
    : `array_position(ARRAY['premium', 'admin', 'regular'], u.rol), r.id DESC`}
    LIMIT ${limit} OFFSET ${offset};
  `;


  const result=await sql.query(query);
  const rows:RecipeDisplay[] = result?.rows as RecipeDisplay[];



  const countQuery = `
    SELECT COUNT(DISTINCT r.id) 
    FROM l_retete r
    JOIN l_utilizatori u ON r.id_utilizator = u.id
    LEFT JOIN l_retete_ingrediente ri ON ri.id_reteta = r.id
    LEFT JOIN l_ingrediente i ON i.id = ri.id_ingredient
    WHERE r.tip LIKE '%${type}%'
    AND lower(r.nume) LIKE lower('%${searchQuery}%')
    AND timp_preparare <= ${prepTime}
    ${ingredients.length > 0 ? `AND i.id IN (${ingredientsQuery})` : ''}
    ${ingredients.length > 0 ? `GROUP BY r.id HAVING COUNT(DISTINCT i.id) = ${ingredients.length}` : ''}
  `;

    const countResult=await sql.query(countQuery);

    totalCountCache = parseInt(countResult?.rows[0]?.count, 10);

  const totalPages = Math.ceil(totalCountCache / limit);

  return (
    <>
      <div className='flex flex-col mt-[80px] w-full'>
        <div className='fixed  h-12 w-12 top-4  z-50 left-6'>
          <FiltersSheet ingredients={ingredients} type={type} prepTime={prepTime as number}/>
        </div>
        <div className='pt-4 text-xs px-4'>
          <FilterOrderContainer />
        </div>
        <div className='justify-center flex flex-wrap pt-4 w-full max-sm:justify-evenly'>
          {rows?.map((recipe) => {
            return (
              <RecipeDisplayCard recipe={recipe} id_user={session?.user.id||''} key={recipe.id}></RecipeDisplayCard>
            );
          })}
        </div>
      </div>
      
      <PaginationComponent totalPages={totalPages} page={page}/>
      <div className='bg-gray-100 py-6 mb-10'>
        <RecipeHistorySection userId={session?.user.id as string}></RecipeHistorySection>
      </div>
    </>
  )
}

export default DiscoverRecipes


