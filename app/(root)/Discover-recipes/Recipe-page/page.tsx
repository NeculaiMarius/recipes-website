import SaveButtonBig from '@/components/Buttons/SaveButtonBig';
import { sql } from '@vercel/postgres'
import Image from 'next/image'
import React from 'react'
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from '@/components/ui/separator';
import Rating from '@/components/Rating';
import FavouriteButtonBig from '@/components/Buttons/FavouriteButtonBig';
import { FaFlag, FaHeart, FaInfoCircle, FaRegUserCircle, FaStar } from 'react-icons/fa';
import AddReviewForm from '@/components/Forms/AddReviewForm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import NutritionChart from '@/components/Charts/NutririonChart';
import Link from 'next/link';
import { RecipePage } from '@/interfaces/recipe';
import { IngredientRecipePage } from '@/interfaces/ingredient';
import { ReviewRecipePage } from '@/interfaces/review';
import RecipeSettingsButton from '@/components/Buttons/RecipeSettingsButton';
import { AlertTriangle } from 'lucide-react';
import RecipeRecommendationsSection from '@/components/RecipeRecommendationsSection';
import SaveRecipeLS from '@/components/SaveRecipeLS';
import RecipeIngredientsSection from '@/components/RecipeIngredientsSection';
import LikesList from '@/components/Dialogs/LikesList';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';



const page = async ({ searchParams }: { searchParams: { recipeId: string} }) => {
  const session=await getServerSession(options);
  
  const recipeResult = await sql`
      SELECT 
        r.*,
        u.nume AS utilizator, 
        COALESCE(AVG(v.rating), 0) AS rating_reteta,
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
        l_retete_apreciate a ON a.id_reteta = r.id  
      LEFT JOIN
        l_retete_salvate s ON s.id_reteta = r.id
      LEFT JOIN 
        l_reviews v ON v.id_reteta = r.id
      WHERE 
        r.id = ${searchParams.recipeId}
      GROUP BY 
        r.id, u.nume
    `;
  const recipe: RecipePage = recipeResult?.rows[0] as RecipePage;

  if(!recipe){
    return (
      <div className="pt-[80px] h-screen bg-gray-500  flex items-center">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">Rețetă indisponibilă</h2>
        <p className="mb-6 text-center text-gray-600">
          Rețeta pe care ați accesat-o nu există sau este posibil să fi fost ștearsă de utilizatorul care a postat-o.
        </p>
        <Link href={"/Discover-recipes"} className="rounded-md bg-emerald-700 px-4 py-2 text-white transition-colors hover:bg-emerald-800">
          Înapoi la rețete
        </Link>
      </div>
    </div>
    )
  }


  const ingredientsResult=await sql`
    SELECT 
      i.*,
      cantitate
    FROM l_ingrediente i ,l_retete_ingrediente ri
    WHERE i.id=ri.id_ingredient
    AND ri.id_reteta=${searchParams.recipeId}
  `
  const ingredients :IngredientRecipePage[]=ingredientsResult?.rows as IngredientRecipePage[];
  const pasi_preparare=recipe.pasi_preparare.split(';')

  const reviewsResult=await sql`
    SELECT u.nume, u.prenume, r.* 
    FROM l_reviews r, l_utilizatori u 
    WHERE r.id_utilizator=u.id
    AND  id_reteta=${searchParams.recipeId}
  `
  const reviews:ReviewRecipePage[]=reviewsResult?.rows as ReviewRecipePage[];


  let carbs=0;
  let fats=0;
  let proteins=0;
  let kcal=0;
  for(const ingredient of ingredients){
    if(ingredient.um==='buc'){
      kcal+=ingredient.kcal*ingredient.cantitate
      carbs+=ingredient.carbohidrati*ingredient.cantitate;
      fats+=ingredient.grasimi*ingredient.cantitate;
      proteins+=ingredient.proteine*ingredient.cantitate;
    }
    else{
      kcal+=parseFloat((ingredient.kcal*(ingredient.cantitate/100)).toFixed(2))
      fats+=parseFloat((ingredient.grasimi*(ingredient.cantitate/100)).toFixed(2))
      proteins+=parseFloat((ingredient.proteine*(ingredient.cantitate/100)).toFixed(2))
      carbs+=parseFloat((ingredient.carbohidrati*(ingredient.cantitate/100)).toFixed(2))
    }
  }
  const totalKcal=kcal.toFixed(2)

  const currentUserReviewResponse=await sql`SELECT * FROM l_reviews 
    WHERE id_reteta=${searchParams?.recipeId}
    AND id_utilizator=${session?.user.id}
  `
  const currentUserReview:ReviewRecipePage=await currentUserReviewResponse.rows[0] as ReviewRecipePage;

  return (
    <div className='pt-[80px] '>
    
      <SaveRecipeLS recipe={recipe}/>

      {
        recipe.id_utilizator==session?.user.id?
        <div className='fixed top-4 left-6 z-50 '>
          <RecipeSettingsButton recipeId={recipe.id}/>
        </div>
        :null
      }
      

      <div className='grid grid-cols-2 h-[calc(100vh-80px)] 
                      max-lg:flex max-lg:flex-col max-lg:h-fit'>
        {/* COL 1 */}
        <div className='px-10 flex flex-col justify-evenly
                        max-md:px-2'>
          <h1 className='text-2xl font-bold'>{recipe?.nume}</h1>
          <div className='px-24 bg-gray-100 max-sm:px-2'>
            <AspectRatio ratio={4/3} className=''>
              <Image
                src={recipe?.image_url?recipe.image_url:""}
                alt="Card image"
                fill
                className="object-cover" 
              />
            </AspectRatio>
          </div>

          <div className='flex justify-between items-center bg-gray-100 p-2 rounded-md'>
            <span className='flex items-center'>
              <span className="material-symbols-outlined text-[3rem] flex justify-center">account_circle</span>
              <span>{recipe?.utilizator}</span>
            </span>
            <LikesList recipeId={searchParams.recipeId} noLikes={recipe.numar_aprecieri} userId={session?.user.id as string} ></LikesList>
            <span className='flex gap-2 items-center'>
              <FaFlag size={20} className='text-blue-700'/>
              {recipe.numar_salvari}
            </span>
            <span className='flex items-center gap-2'>
              <span className='font-semibold ml-2'>{recipe.rating_reteta}</span>
              <Rating rating={recipe.rating_reteta} /> 
            </span>
          </div>

          <div className='max-md:my-4 flex justify-evenly'>
            <SaveButtonBig id_user={session?.user.id||""} id_recipe={recipe.id} isLiked={recipe.saved} />
            <FavouriteButtonBig id_user={session?.user.id||""} id_recipe={recipe.id} isLiked={recipe.liked}/>
            <a href='#review'>
              <div className='like-button font-bold px-4 py-2 shadow-xl w-[170px] justify-around text-lg bg-yellow-600 text-gray-100  max-md:w-[90px]'>
                <span className='max-md:hidden'>Review-uri</span> <FaStar size={25}></FaStar>
              </div>
            </a>
          </div>
        </div>
        {/* COL 2 */}
        <RecipeIngredientsSection ingredients={ingredients} recipePortions={recipe.numar_portii}></RecipeIngredientsSection>
      </div>

      <Separator className='mt-8'></Separator>

      <Accordion type="single" className='mb-8' collapsible>
        <AccordionItem value="item-1 flex items-center ">
          <AccordionTrigger className='flex flex-1'>
          <div className='bg-red-400 text-white font-bold text-2xl w-fit px-4 py-2 rounded-md mx-auto shadow-md'>
            Valori nutriționale
          </div>
          </AccordionTrigger>
          <AccordionContent className='flex justify-center'>
            <NutritionChart
              totalKcal={totalKcal}
              data={[
                { name: "Carbohidrați", value: carbs, fill: "hsl(37.7 92.1% 50.2%)" },
                { name: "Proteine", value: proteins, fill: "hsl(173.4 80.4% 40%)" },
                { name: "Grăsimi", value: fats, fill: "hsl(333.3 71.4% 50.6%)" },
              ]}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div>
        <div className='bg-emerald-700 text-white font-bold text-2xl w-fit px-4 py-2 rounded-md mx-auto shadow-md'>
          Pașii de preparare a rețetei
        </div>

        <Separator className='bg-transparent my-4'></Separator>

        <div className='flex flex-col gap-4  w-[70%] mx-auto
                        max-md:w-full max-md:px-4'>
          {pasi_preparare.map((pas:string,index:number)=>{
            return(
              <div className='grid grid-cols-[1fr_3fr] text-lg -4 rounded-md border-gray-100 bg-gray-50 shadow-md px-4 py-2 items-center
                              hover:shadow-lg transition
                              max-lg:mr-4 max-md:text-base'
                key={index}
              >
                <span className='align-middle h-fit w-full flex justify-center items-center gap-2 '>
                  <span className='font-bold text-emerald-800 max-md:hidden'>Pasul </span>
                  <span className='border-4 border-dashed border-emerald-700 rounded-full px-3 py-1'>{index+1}</span>
                </span>
                <span>{pas}</span> 
              </div>
            )
          })}
        </div>
      </div>

      <Separator className='my-8'></Separator>

      <div>
        <div id='review' className='bg-emerald-700 text-white font-bold text-2xl w-fit px-4 py-2 rounded-md mx-auto shadow-md'>
          Review-urile utilizatorilor noștri
        </div>

        <div className='mx-auto w-fit'>
          <AddReviewForm id_recipe={searchParams.recipeId} currentReview={currentUserReview}></AddReviewForm>
        </div>


        <Separator className='my-8'></Separator>
        <div className='grid grid-cols-2 w-[80%] mx-auto gap-x-4 gap-y-4
                        max-md:w-full max-md:grid-cols-1'>
          {reviews?.map(review=>{
            return(
            <div className="flex items-center gap-3 p-4 bg-gray-50 shadow-md rounded-lg" key={review.id}>
              <Link href={`/Account/${review.id_utilizator}`}>
                <Avatar className="h-12 w-12 border">
                  <AvatarFallback>{(review.nume[0]+review.prenume[0]).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link> 
              <div>
                <Link href={`/Account/${review.id_utilizator}`}>
                <span 
                  className="block font-semibold text-gray-900 hover:text-emerald-700 hover:underline"
                >
                  {review.nume+" "+review.prenume}
                </span>
                </Link>
                <Rating rating={review.rating} />
                <p className="text-gray-700">{review.continut}</p>
              </div>
            </div>
            )
          })}
        </div>
      </div>
      <Separator className='my-8'></Separator>

      <RecipeRecommendationsSection recipeId={searchParams.recipeId} userId={session?.user.id} authorId={recipe.id_utilizator}/>

      <Separator className='my-8'></Separator>
    </div>
  )
}

export default page