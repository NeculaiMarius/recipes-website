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
import { Button } from '@/components/ui/button';

const page = async ({ params}:{params:{user:string}}) => {
  const session=await getServerSession(options);

  const userResponse=await sql`SELECT * FROM l_utilizatori WHERE id=${params.user}`
  const user=userResponse.rows[0]
  if(!user) return

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
      l_utilizatori u ON r.id_utilizator = ${params.user}
    LEFT JOIN 
      l_retete_apreciate a ON a.id_reteta = r.id  
  `;
  const rows = result?.rows;
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
              <p className='font-bold text-right max-md:text-center'> Urmăritori </p>
              <p className='text-center text-emerald-800 font-bold'>{999}</p>
              <p className='font-bold text-right max-md:text-center '> Retete </p>
              <p className='text-center text-emerald-800 font-bold'>{rows.length}</p>
            </div>
          </div>
          <div className='flex flex-col items-center text-center'>
            <p className='font-bold text-2xl'>{user.nume}</p>
            <p className='hover:text-blue-500 hover:cursor-pointer hover:underline'>{user?.email}</p>
          </div>

          <div className='flex items-center m-2'>
            <Button className='w-full'>Urmărește</Button>
          </div>
        </div>
        
        </div>

      </div>


      <div className=''>
        <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recipes">Retete proprii</TabsTrigger>
          <TabsTrigger value="followers">Urmaritori</TabsTrigger>
        </TabsList>
        <TabsContent value="recipes">
          <div className='flex flex-wrap justify-center pt-8'>
            {rows?.map((recipe) => {
              return (
                <RecipeDisplayCard id_recipe={recipe.id} name={recipe.nume} rating={"5"} author={recipe.utilizator} route={recipe.image_url} id_user={session?.user.id||""} liked={recipe.id_aprecieri != null} key={recipe.id}></RecipeDisplayCard>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="followers">

        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}

export default page