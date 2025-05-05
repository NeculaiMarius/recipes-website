import { RecipeDisplay } from '@/interfaces/recipe'
import { sql } from '@vercel/postgres'
import React from 'react'
import RecipeDisplayCard from './RecipeDisplayCard'
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel'

const RecipeRecommendationsSection = async ({recipeId,userId,authorId}:{recipeId:string,userId:string|undefined,authorId:string}) => {
  const recipeSugestionsQuery_1=`
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
            SELECT 1 
            FROM l_retete_apreciate a 
            WHERE a.id_reteta = r.id 
              AND a.id_utilizator = ${userId}
        ) THEN TRUE 
        ELSE FALSE 
    END AS liked,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM l_retete_salvate s 
            WHERE s.id_reteta = r.id 
              AND s.id_utilizator = ${userId}
        ) THEN TRUE 
        ELSE FALSE 
    END AS saved,
    -- Subinterogare pentru numărul de ingrediente comune
    (SELECT COUNT(DISTINCT ri1.id_ingredient)
    FROM l_retete_ingrediente ri1
    JOIN l_retete_ingrediente ri2 ON ri1.id_ingredient = ri2.id_ingredient
    WHERE ri1.id_reteta = r.id
      AND ri2.id_reteta = ${recipeId}) AS numar_ingrediente_comune
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
  WHERE 
      r.id != ${recipeId}  
  GROUP BY 
      r.id, r.nume, u.nume, r.image_url, u.prenume, u.rol
  ORDER BY 
      numar_ingrediente_comune DESC
  LIMIT 10;
  `
  const recipeSugestionsResult_1=await sql.query(recipeSugestionsQuery_1)
  const recipeSugestions_1:RecipeDisplay[]= recipeSugestionsResult_1.rows as RecipeDisplay[]
  
  const recipeSugestionsQuery_2=`
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
              WHERE a.id_reteta = r.id AND a.id_utilizator = ${userId}
          ) THEN TRUE 
          ELSE FALSE 
      END AS liked,
      CASE 
          WHEN EXISTS (
              SELECT 1 FROM l_retete_salvate s 
              WHERE s.id_reteta = r.id AND s.id_utilizator = ${userId}
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
      u.id = ${authorId}
    AND 
      r.id != ${recipeId}
    GROUP BY 
      r.id, r.nume, u.nume, r.image_url, u.prenume, u.rol
    ORDER BY (COUNT(DISTINCT a.id) + COUNT(DISTINCT s.id)) DESC
    LIMIT 10;
  `
  const recipeSugestionsResult_2=await sql.query(recipeSugestionsQuery_2)
  const recipeSugestions_2:RecipeDisplay[]=recipeSugestionsResult_2.rows as RecipeDisplay[]


  return (
    <div className=''>
      <h1 className='pl-[10vw] max-md:pl-4 bg-gray-100 py-2 text-emerald-700 text-2xl max-md:text-xl font-bold'>Rețete cu ingrediente similare</h1>

      <Carousel
        opts={{
          align: "start",
          dragFree:true
        }}
        className="w-full lg:px-20 cursor-grab"
      >
        <CarouselContent className='max-sm:pl-5'>
          {recipeSugestions_1.map((recipe) => (
            <CarouselItem key={recipe.id} className="md:mx-4  flex-[0_0_auto] pl-0 min-w-[170px] max-w-[300px] ">
              <RecipeDisplayCard recipe={recipe as unknown as RecipeDisplay} id_user={userId as string} key={recipe.id} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      
      

      {recipeSugestions_2.length>0 && (
        <>
          <div className='h-8'></div>
          <h1 className='bg-gray-100 py-2 pl-[10vw] max-md:pl-4 text-emerald-700 text-2xl font-bold max-md:text-xl'>Alte rețete de la acest utilizator</h1><Carousel
            opts={{
              align: "start",
              dragFree: true
            }}
            className="w-full lg:px-20 cursor-grab"
          >
            <CarouselContent className='max-sm:pl-5'>
              {recipeSugestions_2.map((recipe) => (
                <CarouselItem key={recipe.id} className="md:mx-4  flex-[0_0_auto] pl-0 min-w-[170px] max-w-[300px] ">
                  <RecipeDisplayCard recipe={recipe as unknown as RecipeDisplay} id_user={userId as string} key={recipe.id} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </>
      )}
    </div>
    
  )
}

export default RecipeRecommendationsSection