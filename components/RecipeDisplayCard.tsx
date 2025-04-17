import React from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import Image from 'next/image'
import Rating from './Rating'
import LikeButton from './Buttons/LikeButton'
import Link from 'next/link'
import SaveButton from './Buttons/SaveButton'
import { RecipeDisplay } from '@/interfaces/recipe'
import { FaFlag, FaHeart } from 'react-icons/fa'




const RecipeDisplayCard = ({recipe,id_user}:{recipe:RecipeDisplay,id_user:string}) => {
  return (
    <Card className='select-none group flex flex-col hover:shadow-md m-2 w-[300px] h-[450px] max-md:w-[200px] max-md:h-[350px] max-md:text-sm max-sm:w-[170px] max-sm:m-1 overflow-hidden relative'>

      <LikeButton id_user={id_user} id_recipe={recipe.id} liked={recipe.liked} key={recipe.id}/>
      <div className='hidden group-hover:block'>
        <SaveButton id_user={id_user} id_recipe={recipe.id} saved={recipe.saved} key={recipe.id}/>
      </div>

      <div className='relative aspect-[1/1] bg-gray-200'>
        <Link href={`/Discover-recipes/Recipe-page?recipeId=${recipe.id}`}>
        <Image
          src={recipe.image_url?recipe.image_url:""}
          alt="Card image"
          layout="fill"
          objectFit="cover"
        />
        </Link>
      </div>

      <div className='flex flex-col flex-1 justify-between px-[5%] '>
        <Link href={`/Discover-recipes/Recipe-page?recipeId=${recipe.id}`}>
        <CardHeader className='p-1 font-bold text-gray-700 hover:text-emerald-600'>
          {recipe.nume}
        </CardHeader>
        </Link> 

        <CardContent className='flex flex-col md:flex-row p-1 md:justify-between gap-2'>
          <div className='flex items-center'>
            <Rating rating={recipe.rating} /> <span className='font-semibold ml-2'>{recipe.rating}</span>
          </div>
          <div className='flex items-center'>
            <FaHeart className='text-red-600' /><span>{recipe.numar_aprecieri}</span>
            <div className='w-4'></div>
            <FaFlag className='text-blue-600'/><span>{recipe.numar_salvari  }</span>
          </div>
        </CardContent>

        <CardFooter className="p-1 max-md:text-xs relative bottom-0">
          <span className="material-symbols-outlined text-[30px]">account_circle</span>
          <p>	&nbsp;{recipe.utilizator}</p>
        </CardFooter>
      </div>
    </Card>
  )
}

export default RecipeDisplayCard