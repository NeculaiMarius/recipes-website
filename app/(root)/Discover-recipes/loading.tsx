import Rating from '@/components/Rating';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'

const loading = () => {
  return (
    <>
      <div className='mt-[80px] flex flex-wrap justify-center pt-8 '>
        {Array.from({ length: 12 }).map((_, index) => {
          return (
            <Card className='flex flex-col hover:shadow-md m-2 w-[300px] h-[450px] max-md:w-[200px] max-md:h-[350px] max-md:text-sm max-sm:w-[170px] max-sm:m-1 overflow-hidden relative' key={index}>


              <Skeleton className='relative aspect-[1/1] bg-gray-200'></Skeleton>
              

              <div className='flex flex-col flex-1 justify-between px-[5%] '>
                <CardHeader className='p-1 font-bold text-gray-500'>
                  <Skeleton className='w-[100px]'>Loading...</Skeleton>
                </CardHeader>

                <CardContent className='flex items-center p-1'>

                  {/* <Rating /> <span className='font-semibold ml-2'>{}</span> */}
                </CardContent>

                <CardFooter className="p-1 max-md:text-xs relative bottom-0 text-gray-500">
                  <span className="material-symbols-outlined text-[30px] ">account_circle</span>
                  <Skeleton >&nbsp;Loading...&nbsp;</Skeleton>
                </CardFooter>
              </div>
            </Card>
          );
        })}
      </div>
      
    </>   
  )
}

export default loading