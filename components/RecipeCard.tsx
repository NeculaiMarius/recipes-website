import React from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import Rating from './Rating'


const RecipeCard = ({name,rating,author,route}:{name:string,rating:string,author:string,route:string}) => {
  return (
    <Card className=" w-[300px] md:aspect-[2/3] h-fit max-md:flex max-md:w-full">
      <div className="relative w-full md:h-[60%] max-md:h-[200px] max-md:w-[200px] max-md:aspect-[1/1]">
        <Image
          src={route}
          alt="Card image"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className='h-[40%] flex flex-col justify-between'>
        <CardHeader>
          <CardTitle className='text-lg'>{name}</CardTitle>
        </CardHeader>

        <CardContent className='flex items-center'>
          <Rating rating={rating} /> <span className='font-semibold ml-2'>{rating}</span>
        </CardContent>
        
        <CardFooter className="py-0">
          <span className="material-symbols-outlined text-[30px]">account_circle</span>
          <p>	&nbsp;{author}</p>
        </CardFooter>
      </div>
      
    </Card>
  )
}

export default RecipeCard