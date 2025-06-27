'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from 'next/image';
import { ingredientsCategories } from '@/constants';
import { toast } from 'sonner';
import { MdDeleteForever } from "react-icons/md";


const FridgeIngredientsSections = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [categories,setCategories]=useState(ingredientsCategories);
  const [ingredientQuery, setIngredientQuery] = useState("");
  const [ingredientSuggestions, setIngredientSuggestions] = useState<{ id: string; nume: string; um: string; categorie:string }[]>([]);

  useEffect(()=>{
      const fetchSelectedIngredients=async()=>{
        const response= await fetch('/api/fridge/get-ingredients')
        if(!response.ok){
          throw new Error('Failed to fetch selected ingredients');
        }
        const data=await response.json();
  
        if (data && data.rows) {
          const ingredients = data.rows
          setSelectedIngredients(ingredients);
        }
      }
      
      fetchSelectedIngredients();   
    },[]);

    useEffect(() => {
        const fetchIngredients = async () => {
          if (ingredientQuery.trim()) {
            try {
              const response = await fetch(`/api/ingredients?query=${encodeURIComponent(ingredientQuery)}`);
              const data = await response.json();
              setIngredientSuggestions(data.ingredients || []);
              setIsOpen(true)
            } catch (error) {
              console.error("Failed to fetch ingredients:", error);
            }
          } else {
            setIngredientSuggestions([]);
            setIsOpen(false)
          }
        };
        fetchIngredients();
      }, [ingredientQuery]);

    const handleAddIngredient = (ingredient: { id: string; nume: string; um: string; categorie:string }) => {
      const isIngredientAlreadySelected = selectedIngredients.some(item => item.id === ingredient.id);
      if (!isIngredientAlreadySelected) {
        setSelectedIngredients((prev) => [...prev, { ...ingredient, cantitate: (ingredient.um==="g"||ingredient.um==="ml")?10:1 }]);
      }
      setIngredientQuery("");
      setIngredientSuggestions([]);
      
    };
  
    const handleRemoveIngredient = (id: string) => {
      setSelectedIngredients((prev) => prev.filter(ingredient => ingredient.id !== id));
    };
    
  
    const handleQuantityChange = (id: string, cantitate: number) => {
      setSelectedIngredients((prev) =>
        prev.map(ingredient =>
          ingredient.id === id ? { ...ingredient, cantitate } : ingredient
        )
      );
    };
  
  
    const onClickButton=async ()=>{
      try{
        const response=await fetch('/api/fridge/save-ingredients',{
          method:'POST',
          headers:{
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedIngredients),
        })
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Response from API:', data);
      }
      catch(error){
        console.error('Error saving ingredients:', error);
      }
    }
  return (
    <div className='flex flex-col overflow-auto'>
          <div className='pb-5 bg-blue-300 '>
            <div className='flex justify-between items-center sticky'>
              <div className='w-fit bg-blue-500 rounded-r-3xl p-2 pr-3 my-4 text-white font-bold text-3xl'>
                Frigiderul meu
              </div>
              
            </div>
            
            <div className='flex flex-col items-center relative gap-2'>
              <Input 
                className='max-w-[400px] z-20 '
                value={ingredientQuery}
                onChange={(e)=>setIngredientQuery(e.target.value)}
                onFocus={() => ingredientQuery.trim() && setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 500)}
              />
              {isOpen && ingredientSuggestions.length > 0 && (
                <ul className="w-[400px] max-h-[300px] p-2 rounded-md max-h-50 overflow-y-auto bg-white absolute pt-12 shadow-lg border-2 border-gray-200">
                  {ingredientSuggestions.map((ingredient) => (
                    <li
                      key={ingredient.id}
                      className="cursor-pointer p-1 hover:bg-gray-200 flex items-center gap-4"
                      onClick={() => {
                        handleAddIngredient(ingredient);
                        toast("Ingredient adaugat", {
                          description: `${ingredient.nume}`,
                          action: {
                            label: "Anulează",
                            onClick: () => handleRemoveIngredient(ingredient.id),
                          },
                        })
                      }}
                    >
                      <Image
                        src={`/svg-icons/${ingredient.categorie}.svg`}
                        height={30}
                        width={30}
                        alt=''
                      />
                      {ingredient.nume} ({ingredient.um})
                    </li>
                  ))}
                </ul>
              )}



              <Button onClick={onClickButton} className='bg-blue-600 font-bold '>Salveaza modificarile</Button>
            </div>
            

            

          </div>

          <div className=' flex-grow'>
            <Accordion type="multiple">
              {categories?.map(category=>{
                const filteredIngredients=selectedIngredients.filter(ingredient=> ingredient.categorie === category);
                const noIngredients=filteredIngredients.length;
              return (
                <AccordionItem value={category} className='' key={category}>
                <AccordionTrigger className='font-bold px-4 text-gray-800 py-1 '>
                  <div className='flex items-center gap-3'>
                    <Image
                      src={`/svg-icons/${category}.svg`}
                      height={50}
                      width={50}
                      alt=''
                    />
                    {category}
                    
                    <div className={`rounded-full text-white h-6 w-6 ${noIngredients>0?'bg-red-600':'bg-gray-400'}`}>
                      {noIngredients}
                    </div>
                  </div>
                  
                  
                </AccordionTrigger>
                {filteredIngredients
                  .map(filteredIngredient => (
                    <AccordionContent key={filteredIngredient.id} className='flex justify-between px-8 py-1 items-center'>
                      <div>
                      {filteredIngredient.nume}
                      </div>
                      <div className='flex gap-2 items-center'>
                        <span>Cantitate</span>
                        <Input
                          type="number"
                          value={filteredIngredient.cantitate}
                          onChange={(e) => handleQuantityChange(filteredIngredient.id, parseFloat(e.target.value))}
                          className="w-16 px-2 h-9"
                          min={(filteredIngredient.um==="g"||filteredIngredient.um==="ml")?10:1}
                          step={(filteredIngredient.um==="g"||filteredIngredient.um==="ml")?10:1}
                        />
                        <span className='w-10'>{filteredIngredient.um}</span>
                        
                        <div className='flex items-center h-9 self-end bg-white text-red-600 rounded-md p-1 shadow-sm transition duration-300
                                        cursor-pointer  hover:bg-red-600 hover:text-white'
                            onClick={()=>handleRemoveIngredient(filteredIngredient.id)}
                        >
                          <MdDeleteForever size={28} />
                        </div>
                      </div>
                      
                    </AccordionContent>
                  ))}
                
                </AccordionItem>
              )})}

            </Accordion>
          </div>
        </div>
  )
}

export default FridgeIngredientsSections


interface SelectedIngredient {
  id: string;
  nume: string;
  um: string;
  cantitate: number;
  categorie: string;
}

interface IngredientResponse {
  id: string;
  nume: string;
  um: string;
  cantitate: string;
  categorie: string;
}