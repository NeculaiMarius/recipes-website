import { AspectRatio } from '@/components/ui/aspect-ratio'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaFlag } from 'react-icons/fa6'
import Rating from '@/components/Rating'
import SaveButtonBig from '@/components/Buttons/SaveButtonBig'
import FavouriteButtonBig from '@/components/Buttons/FavouriteButtonBig'
import { FaHeart, FaStar } from 'react-icons/fa'

const loading = () => {
  return (
    <div className='mt-[80px]'>

    
    <div className='grid grid-cols-2 h-[calc(100vh-80px)] 
                      max-lg:flex max-lg:flex-col max-lg:h-fit'>
    <div className='px-10 flex flex-col justify-evenly
                        max-md:px-2'>
          <h1 className='text-2xl font-bold max-md:py-4 max-md:text-xl max-md:pl-2'></h1>
          <div className='px-24 bg-gray-100 max-sm:px-2'>
            <AspectRatio ratio={4/3} className=''>
              <div className='bg-gray-100'></div>
            </AspectRatio>
          </div>

          <div className='flex justify-between items-center bg-gray-100 p-2 rounded-md'>
            {/* <Link href={`/Account/${recipe.id_utilizator}`}> */}
            <span className='flex items-center'>
              <span className="material-symbols-outlined text-[3rem] flex justify-center">account_circle</span>
              {/* <span>{recipe?.nume_utilizator+ " "+recipe?.prenume_utilizator}</span> */}
            </span>
            {/* </Link> */}

            <span className='flex gap-2 items-center hover:bg-white rounded-md px-2 py-1 cursor-pointer'>
              <FaHeart size={20} className='text-red-600'/>
              0
            </span>

            <span className='flex gap-2 items-center'>
              <FaFlag size={20} className='text-blue-700'/>
              0
            </span>
            <span className='flex items-center gap-2'>
              <span className='font-semibold ml-2'>0</span>
              <Rating rating={0} /> 
            </span>
          </div>

          <div className='max-md:my-4 flex justify-evenly'>
            <div className='like-button font-bold px-4 py-2 shadow-xl w-[170px] justify-around text-lg max-md:w-[90px] bg-gray-200 text-gray-700'>Salvează</div>
            <div className='like-button font-bold px-4 py-2 shadow-xl w-[170px] justify-around text-lg max-md:w-[90px] bg-gray-200 text-gray-700'>Apreciază</div>
            
            <Link href='#review'>
              <div className='like-button font-bold px-4 py-2 shadow-xl w-[170px] justify-around text-lg bg-yellow-600 text-gray-100  max-md:w-[90px]'>
                <span className='max-md:hidden'>Review-uri</span> <FaStar size={25}></FaStar>
              </div>
            </Link>
          </div>
        </div>
        {/* COL 2 */}
        {/* // <RecipeIngredientsSection ingredients={ingredients} recipePortions={recipe.numar_portii} prepTime={recipe.timp_preparare}></RecipeIngredientsSection> */}
      </div>
      </div>
  )
}

export default loading