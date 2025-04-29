import { options } from '@/app/api/auth/[...nextauth]/options'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getServerSession } from 'next-auth'
import React from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { sql } from '@vercel/postgres';
import RecipeDisplayCard from '@/components/RecipeDisplayCard';
import { RecipeDisplay } from '@/interfaces/recipe';
import FollowButton from '@/components/Buttons/FollowButton';
import { GiCookingPot } from "react-icons/gi";
import { FaFlag, FaHeart } from 'react-icons/fa';
import { RiUserFollowFill, RiUserFollowLine } from 'react-icons/ri';
import FollowersList from '@/components/Dialogs/FollowersList';


const page = async ({ params}:{params:{user:string}}) => {
  const session=await getServerSession(options);

  const userResponse=await sql`
    SELECT u.*, 
      CASE 
      WHEN EXISTS (
          SELECT 1 FROM l_urmariri_utilizatori u 
          WHERE u.id_utilizator = ${session?.user.id} 
          AND u.id_utilizator_urmarit = ${params.user}
      ) THEN TRUE 
      ELSE FALSE 
      END AS followed,
      (SELECT COUNT(*) FROM l_urmariri_utilizatori lu WHERE lu.id_utilizator_urmarit = ${params.user}) AS followers_count
    FROM l_utilizatori u WHERE id=${params.user}`
  const user=userResponse.rows[0]
  if(!user) return


  const result = await sql`
    SELECT 
      r.id, 
      r.nume, 
      u.nume AS utilizator, 
      r.image_url, 
      (SELECT COALESCE(AVG(v.rating), 0) FROM l_reviews v WHERE v.id_reteta = r.id) AS rating,
      (SELECT COUNT(*) FROM l_retete_apreciate a WHERE a.id_reteta = r.id) AS numar_aprecieri,
      (SELECT COUNT(*) FROM l_retete_salvate s WHERE s.id_reteta = r.id) AS numar_salvari,
      EXISTS (
          SELECT 1 FROM l_retete_apreciate a 
          WHERE a.id_reteta = r.id AND a.id_utilizator = ${session?.user.id}
      ) AS liked,
      EXISTS (
          SELECT 1 FROM l_retete_salvate s 
          WHERE s.id_reteta = r.id AND s.id_utilizator = ${session?.user.id}
      ) AS saved
    FROM 
      l_retete r
    JOIN 
      l_utilizatori u ON r.id_utilizator = u.id
    WHERE
      r.id_utilizator=${params.user}
    ORDER BY 
      r.id DESC;
`;

  const rows:RecipeDisplay[] = result?.rows as RecipeDisplay[];


  const resultLikedRecipes = await sql`
    SELECT 
      r.id, 
      r.nume, 
      u.nume AS utilizator, 
      r.image_url, 
      (SELECT COALESCE(AVG(v.rating), 0) FROM l_reviews v WHERE v.id_reteta = r.id) AS rating,
      (SELECT COUNT(*) FROM l_retete_apreciate a WHERE a.id_reteta = r.id) AS numar_aprecieri,
      (SELECT COUNT(*) FROM l_retete_salvate s WHERE s.id_reteta = r.id) AS numar_salvari,
      EXISTS (
          SELECT 1 FROM l_retete_salvate s 
          WHERE s.id_reteta = r.id AND s.id_utilizator = ${session?.user.id}
      ) AS saved,
      TRUE as liked
    FROM 
      l_retete r
    JOIN 
      l_utilizatori u ON r.id_utilizator = u.id
    JOIN 
      l_retete_apreciate a ON a.id_reteta = r.id  -- Se alătură doar rețetele apreciate
    WHERE 
      a.id_utilizator = ${session?.user.id}  -- Filtrăm doar pentru utilizatorul curent
    ORDER BY 
      r.id DESC;
  `;
  const likedRecipes:RecipeDisplay[] = resultLikedRecipes?.rows as RecipeDisplay[];


  const resultSavedRecipes = await sql`
    SELECT 
      r.id, 
      r.nume, 
      u.nume AS utilizator, 
      r.image_url, 
      (SELECT COALESCE(AVG(v.rating), 0) FROM l_reviews v WHERE v.id_reteta = r.id) AS rating,
      (SELECT COUNT(*) FROM l_retete_apreciate a WHERE a.id_reteta = r.id) AS numar_aprecieri,
      (SELECT COUNT(*) FROM l_retete_salvate s WHERE s.id_reteta = r.id) AS numar_salvari,
      EXISTS (
          SELECT 1 FROM l_retete_apreciate a 
          WHERE a.id_reteta = r.id AND a.id_utilizator = ${session?.user.id}
      ) AS liked,
      TRUE AS saved -- Adaugă direct coloana saved ca TRUE
    FROM 
      l_retete r
    JOIN 
      l_utilizatori u ON r.id_utilizator = u.id
    JOIN 
      l_retete_salvate s ON s.id_reteta = r.id
    WHERE 
      s.id_utilizator = ${session?.user.id}
    ORDER BY 
      r.id DESC;
  `;

  const savedRecipes:RecipeDisplay[] = resultSavedRecipes?.rows as RecipeDisplay[];
  
  return (
    <div className='pt-[80px] w-full'>
      
      <div className="flex justify-center bg-[url('/images/fundal.png')] bg-cover ">
      <div className='card flex m-4 p-4'>

        <div className='grid grid-cols-2  grid-rows-[auto_auto]'>
          <div className="p-2 flex items-center justify-center">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-white">
                CN
              </AvatarFallback>
            </Avatar>
          </div>
          <div className='h-32 m-2 flex flex-col justify-center'>
            <div className='bg-gray-100 p-4 grid grid-cols-2 grid-rows-2 rounded-lg gap-2 max-md:grid-cols-1 max-md:gap-0'>
              {/* <p className='font-bold text-right max-md:text-center hover:bg-white px-1 hover:text-emerald-800 rounded-md cursor-pointer'> Urmăritori </p> */}
              <FollowersList sessionId={session?.user.id as string} userId={params.user} noFollowers={user.followers_count}></FollowersList>
              <p className='text-center text-emerald-800 font-bold'>{user.followers_count}</p>
              <p className='font-bold text-right max-md:text-center '> Retete </p>
              <p className='text-center text-emerald-800 font-bold'>{rows.length}</p>
            </div>
          </div>
          <div className='flex flex-col items-center text-center'>
            <p className='font-bold text-2xl'>{user.nume}</p>
            <p className='hover:text-blue-500 hover:cursor-pointer hover:underline'>{user?.email}</p>
          </div>


          {
          user.id!=session?.user.id?
            <div className='flex items-center m-2'>
              <FollowButton id_user={session?.user.id || ""} id_followed_user={params.user} followed={user.followed}></FollowButton>
            </div>:null
          }
          
        </div>
        
        </div>

      </div>


      <div className=''>
        <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recipes"> <GiCookingPot size={20}/> Retete proprii</TabsTrigger>
          <TabsTrigger value="likes"><FaHeart />Apreciate</TabsTrigger>
          <TabsTrigger value="saves"><FaFlag/>Salvate</TabsTrigger>
        </TabsList>

        <TabsContent value="recipes">
          <div className='flex flex-wrap justify-center pt-8'>
            {rows?.map((recipe) => {
              return (
                <RecipeDisplayCard recipe={recipe} id_user={session?.user.id||''} key={recipe.id}></RecipeDisplayCard>
              );
            })}
          </div>
        </TabsContent>


        <TabsContent value='likes'>
          <div className='flex flex-wrap justify-center pt-8'>
            {likedRecipes?.map((recipe) => {
              return (
                <RecipeDisplayCard recipe={recipe} id_user={session?.user.id||''} key={recipe.id}></RecipeDisplayCard>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value='saves'>
          <div className='flex flex-wrap justify-center pt-8'>
            {savedRecipes?.map((recipe) => {
              return (
                <RecipeDisplayCard recipe={recipe} id_user={session?.user.id||''} key={recipe.id}></RecipeDisplayCard>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}

export default page