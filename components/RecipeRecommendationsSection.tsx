import { RecipeDisplay } from '@/interfaces/recipe'
import { sql } from '@vercel/postgres'
import React from 'react'
import RecipeDisplayCard from './RecipeDisplayCard'

const RecipeRecommendationsSection = async ({recipeId,userId,authorId}:{recipeId:string,userId:string|undefined,authorId:string}) => {
  const recipeSugestionsQuery_1=`
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
      r.id, r.nume, u.nume, r.image_url
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
      u.nume AS utilizator, 
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
    GROUP BY 
      r.id, r.nume, u.nume, r.image_url
    ORDER BY (COUNT(DISTINCT a.id) + COUNT(DISTINCT s.id)) DESC
    LIMIT 10;
  `
  const recipeSugestionsResult_2=await sql.query(recipeSugestionsQuery_2)
  const recipeSugestions_2:RecipeDisplay[]=recipeSugestionsResult_2.rows as RecipeDisplay[]


  return (
    <div>
      <h1 className='pl-[10vw]'>Rețete cu ingrediente similare</h1>

      <div className="w-[80%] max-sm:w-[95%] mx-auto overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex flex-nowrap gap-2 md:gap-4 ">
          {recipeSugestions_1.map((recipe, index) => (
            <div key={recipe.id || index} className="flex-none">
              <RecipeDisplayCard recipe={recipe} id_user={userId as string} />
            </div>
          ))}
        </div>
      </div>

      <div className="w-[80%] max-sm:w-[95%] mx-auto overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex flex-nowrap gap-2 md:gap-4 ">
          {recipeSugestions_2.map((recipe, index) => (
            <div key={recipe.id || index} className="flex-none">
              <RecipeDisplayCard recipe={recipe} id_user={userId as string} />
            </div>
          ))}
        </div>
      </div>
    </div>
    
  )
}

export default RecipeRecommendationsSection