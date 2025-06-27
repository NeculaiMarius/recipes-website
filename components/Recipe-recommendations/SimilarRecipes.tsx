import { RecipeDisplay, RecipeForCS } from '@/interfaces/recipe';
import { buildVocabulary, calcTfIdfVector, cosineSimilarity, recommendRecipes, tokenize } from '@/lib/cosine-similarity-functions';
import { sql } from '@vercel/postgres'
import React from 'react'
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';
import RecipeDisplayCard from '../RecipeDisplayCard';

const SimilarRecipes = async ({recipeId,userId}:{recipeId:number,userId:string}) => {

  const currentRecipeResponse=await sql`
    SELECT * FROM l_retete WHERE id=${recipeId}
  `
  const currentRecipe=currentRecipeResponse.rows[0];

  const allRecipesResponse=await sql`
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
    ARRAY_AGG(DISTINCT i.nume) AS ingrediente,
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
  GROUP BY 
    r.id, r.nume, u.nume, r.image_url, u.prenume, u.rol
  ORDER BY 
    (COUNT(DISTINCT a.id) + COUNT(DISTINCT s.id)) DESC
  LIMIT 100;
  `
  const allRecipes=allRecipesResponse.rows;

  const recommendations = recommendRecipes(currentRecipe as RecipeForCS, allRecipes as RecipeForCS[]);



  return (
  <>
    {recommendations.length>0 && (
      <>
        <div className='h-8'></div>
        <h1 className='bg-gray-100 py-2 pl-[10vw] max-md:pl-4 text-emerald-700 text-2xl font-bold max-md:text-xl'>
          Rețete similare
        </h1>
        <Carousel
          opts={{
            align: "start",
            dragFree: true
          }}
          className="w-full lg:px-20 cursor-grab"
        >
          <CarouselContent className='max-sm:pl-5'>
            {recommendations.map((recipe) => (
              <CarouselItem
                key={recipe.id}
                className="md:mx-4 flex-[0_0_auto] pl-0 min-w-[170px] max-w-[300px]"
              >
                <RecipeDisplayCard
                  recipe={recipe as unknown as RecipeDisplay}
                  id_user={userId as string}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </>
    )}
  </>
);

  }


export default SimilarRecipes