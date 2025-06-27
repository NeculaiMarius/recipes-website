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


const RecipeCard = ({name,rating,author,imageURL}:{name:string,rating:number,author:string,imageURL:string}) => {
  return (
    <Card className=" w-[300px] h-fit max-md:flex max-md:w-full">
      <div className="relative w-full md:h-[60%] max-md:h-[150px] max-md:w-[150px] max-md:aspect-[1/1]">
        <div className='w-full aspect-[1/1]'>
        <Image
          src={imageURL}
          alt="Card image"
          layout="fill"
          objectFit="cover"
        />
        </div>
        
      </div>
      <div className='h-[40%] flex flex-col justify-between'>
        <CardHeader>
          <CardTitle className='text-lg max-md:text-sm'>{name}</CardTitle>
        </CardHeader>

        <CardContent className='flex items-center'>
          <Rating rating={rating} /> <span className='font-semibold ml-2'>{rating}</span>
        </CardContent>
        
        <CardFooter className="py-0 max-md:text-xs">
          <span className="material-symbols-outlined text-[30px]">account_circle</span>
          <p>	&nbsp;{author}</p>
        </CardFooter>
      </div>
      
    </Card>
  )
}

export default RecipeCard