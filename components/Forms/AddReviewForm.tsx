'use client'
import React, { useState } from 'react'
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer'
import { Button } from '../ui/button'
import { Star } from 'lucide-react'
import { Textarea } from '../ui/textarea'
import { addReview } from '@/app/stores/ReviewStore'

const AddReviewForm = ({id_recipe}:{id_recipe:string}) => {
  const [content,setContent]=useState("");
  const [rating,setRating]=useState(5);
  const [error,setError]=useState(false);
  const [isLoading,setIsLoading]=useState(false);
  const [isOpen,setIsOpen]=useState(false)

  const handleClick=async ()=>{
    setIsLoading(true)  
    if(content.length<5){
      setError(true);
      return;
    }
    setError(false);

    try {
      const response=await addReview(id_recipe,content,rating)
      if(response){
        console.log('REview adaugat');
      }
    } catch (error) {
      console.error('Error adding review: ', error);
    }
    finally {
      setIsLoading(false);
      setIsOpen(false);
    }

  }
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger>
        <div className='mt-8 border-4 border-yellow-600 text-yellow-700 font-bold text-xl w-fit px-4 py-2 rounded-md mx-auto shadow-md cursor-pointer'>
          Lasa un review
        </div>
      </DrawerTrigger>
      <DrawerContent className='lg:w-[70%] px-12 mx-auto  '>
        <DrawerHeader>
          <DrawerTitle className='mb-8'>Scrie un review pentru această rețetă</DrawerTitle>
          {/* <DrawerDescription>This action cannot be undone.</DrawerDescription> */}
        </DrawerHeader>
        <div className='px-4 flex flex-col items-center'>
          <span className='text-red-700 my-2'>
            {error?"Trebuie completat acest camp cu minim 5 caractere!":""}
          </span>
          <Textarea maxLength={1000} placeholder='Ce părere ai despre această rețetă?' onChange={(e)=>{setContent(e.target.value)}}></Textarea>
          <div className="flex gap-1 text-gray-400 mt-4 mb-12">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                className={`w-12 h-12 cursor-pointer transition-colors duration-200 ${
                  star <= rating ? "text-yellow-500" : "text-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
        <DrawerFooter>
          <Button className='w-[50%] mx-auto font-semibold bg-emerald-800 text-md' onClick={handleClick}>
            {isLoading?<div className="spinner"></div>:"Postează review"}
          </Button>
          <Button className='w-[50%] mx-auto bg-red-700 font-semibold text-md' onClick={()=>setIsOpen(false)}>
            Anulare
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default AddReviewForm