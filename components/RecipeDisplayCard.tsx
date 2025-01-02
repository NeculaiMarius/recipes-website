import React from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import Image from 'next/image'
import Rating from './Rating'
import LikeButton from './LikeButton'
import Link from 'next/link'


const RecipeDisplayCard = ({id_recipe,name,rating,author,route,id_user,liked}:{id_recipe:string,name:string,rating:string,author:string,route:string,id_user:string,liked:boolean}) => {
  return (
    <Card className='flex flex-col hover:shadow-md m-2 w-[300px] h-[450px] max-md:w-[200px] max-md:h-[350px] max-md:text-sm max-sm:w-[170px] max-sm:m-1 overflow-hidden relative'>

      <LikeButton id_user={id_user} id_recipe={id_recipe} liked={liked} key={id_recipe}/>

      <div className='relative aspect-[1/1] bg-gray-200'>
        <Link href={`/Discover-recipes/Recipe-page?recipeId=${id_recipe}`}>
        <Image
          src={route?route:""}
          alt="Card image"
          layout="fill"
          objectFit="cover"
        />
        </Link>
      </div>

      <div className='flex flex-col flex-1 justify-between px-[5%] '>
        <Link href={`/Discover-recipes/Recipe-page?recipeId=${id_recipe}`}>
        <CardHeader className='p-1 font-bold text-gray-700 hover:text-emerald-600'>
          {name}
        </CardHeader>
        </Link> 

        <CardContent className='flex items-center p-1'>
          <Rating rating={rating} /> <span className='font-semibold ml-2'>{rating}</span>
        </CardContent>

        <CardFooter className="p-1 max-md:text-xs relative bottom-0">
          <span className="material-symbols-outlined text-[30px]">account_circle</span>
          <p>	&nbsp;{author}</p>
        </CardFooter>
      </div>
    </Card>
  )
}

export default RecipeDisplayCard