import { sql } from '@vercel/postgres'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Bookmark, Star } from "lucide-react" 
import { IngredientRecipePage } from '@/interfaces/ingredient'
import NutritionChart from '@/components/Charts/NutririonChart'
import MacronutrientRadarChart from '@/components/Charts/MacronutrientsRadarChart'
import IngredientCategoryCard from '@/components/Charts/IngredientsCategoryChart'
import { ReviewDistributionChart } from '@/components/Charts/ReviewDistributionChart'
import { ReviewSentimentDistribution } from '@/components/Charts/ReviewSentimentDistribution'

const page = async ({ params}:{params:{recipeId:string}}) => {
  const recipeResponse= await sql
  `
  SELECT 
    r.*,
    COALESCE(AVG(v.rating), 0) AS rating_reteta,
    COUNT(DISTINCT a.id) AS numar_aprecieri,
    COUNT(DISTINCT s.id) AS numar_salvari
  FROM l_retete r
  LEFT JOIN 
    l_retete_apreciate a ON a.id_reteta = r.id  
  LEFT JOIN
    l_retete_salvate s ON s.id_reteta = r.id
  LEFT JOIN 
    l_reviews v ON v.id_reteta = r.id 
  WHERE r.id= ${params.recipeId}
  GROUP BY 
    r.id
  `

  const recipe=recipeResponse.rows[0];


  const ingredientsResult=await sql`
      SELECT 
        i.*,
        cantitate
      FROM l_ingrediente i ,l_retete_ingrediente ri
      WHERE i.id=ri.id_ingredient
      AND ri.id_reteta=${params.recipeId}
    `
    const ingredients :IngredientRecipePage[]=ingredientsResult?.rows as IngredientRecipePage[];

  let carbs=0;
  let fats=0;
  let proteins=0;
  let kcal=0;
  for(const ingredient of ingredients){
    if(ingredient.um==='buc'){
      kcal+=ingredient.kcal*ingredient.cantitate / recipe.numar_portii
      carbs+=ingredient.carbohidrati*ingredient.cantitate / recipe.numar_portii;
      fats+=ingredient.grasimi*ingredient.cantitate / recipe.numar_portii;
      proteins+=ingredient.proteine*ingredient.cantitate / recipe.numar_portii;
    }
    else{
      kcal+=parseFloat((ingredient.kcal*(ingredient.cantitate/100)/ recipe.numar_portii).toFixed(2))
      fats+=parseFloat((ingredient.grasimi*(ingredient.cantitate/100)/ recipe.numar_portii).toFixed(2))
      proteins+=parseFloat((ingredient.proteine*(ingredient.cantitate/100)/ recipe.numar_portii).toFixed(2))
      carbs+=parseFloat((ingredient.carbohidrati*(ingredient.cantitate/100)/ recipe.numar_portii).toFixed(2))
    }
  }
  const totalKcal=kcal.toFixed(2)

  const ratingDistributionRespose= await sql`
    SELECT COUNT(*), rating FROM l_reviews WHERE id_reteta=${params.recipeId} GROUP BY rating;
  `
  const ratingDistribution=ratingDistributionRespose.rows;

  const ratingChartData = [1, 2, 3, 4, 5].map((rating) => {
    const found = ratingDistribution.find((row) => row.rating === rating)
    return {
      rating: `⭐ ${rating}`,
      count: found ? Number(found.count) : 0,
    }
  })

  const sentimentScoreResponse= await sql`
    SELECT COUNT(*), scor_sentiment 
    FROM l_reviews 
    WHERE id_reteta=${params.recipeId} 
    AND scor_sentiment IS NOT NULL GROUP BY scor_sentiment;
  `
  const sentimentScoreDistribution= sentimentScoreResponse.rows;

  const sentimentScoreData = [1, 2, 3, 4, 5].map((rating) => {
    const found = sentimentScoreDistribution.find((row) => row.scor_sentiment == rating)
    return {
      score: `${rating}`,
      count: found ? Number(found.count) : 0,
    }
  })


  return (
    <div className="pt-[80px] px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6">{recipe?.titlu || "Recipe Details"}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Likes Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aprecieri</CardTitle>
            <Heart className="h-5 w-5 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{recipe?.numar_aprecieri || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Persoane care au apreciat această rețetă</p>
          </CardContent>
        </Card>

        {/* Saves Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Salvări</CardTitle>
            <Bookmark className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{recipe?.numar_salvari || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Persoane care au salvat această rețetă</p>
          </CardContent>
        </Card>

        {/* Rating Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{recipe?.rating_reteta ? recipe.rating_reteta.toFixed(1) : "0.0"}</div>
            <div className="flex items-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(recipe?.rating_reteta || 0) ? "text-amber-500 fill-amber-500" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-2">Bazat pe recenzii</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-2 gap-4 my-4 w-full'>
        <ReviewDistributionChart chartData={ratingChartData}></ReviewDistributionChart>
        <ReviewSentimentDistribution chartData={sentimentScoreData}></ReviewSentimentDistribution>
      </div>

      <div className='flex justify-evenly gap-4 my-4 max-md:flex-col items-center'>
        <NutritionChart
          totalKcal={totalKcal}
          data={[
            { name: "Carbohidrați", value: carbs, fill: "hsl(37.7 92.1% 50.2%)" },
            { name: "Proteine", value: proteins, fill: "hsl(173.4 80.4% 40%)" },
            { name: "Grăsimi", value: fats, fill: "hsl(333.3 71.4% 50.6%)" },
          ]}
        />
        <MacronutrientRadarChart proteins={proteins} carbs={carbs} fats={fats} totalKcal={totalKcal} />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col items-center justify-center rounded-lg border p-4">
          <div className="text-2xl font-bold text-cyan-700">{proteins.toFixed(1)}g</div>
          <div className="text-sm text-muted-foreground ">Proteine</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border p-4">
          <div className="text-2xl font-bold text-amber-600">{carbs.toFixed(1)}g</div>
          <div className="text-sm text-muted-foreground">Carbohidrați</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border p-4">
          <div className="text-2xl font-bold text-pink-700">{fats.toFixed(1)}g</div>
          <div className="text-sm text-muted-foreground">Grăsimi</div>
        </div>
      </div>
      
      <div className='my-4'>
        <IngredientCategoryCard ingredients={ingredients} ></IngredientCategoryCard>
      </div>

    </div>
  )
}

export default page