"use client"
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


const MyFridge = () => {
  const [categories,setCategories]=useState(ingredientsCategories);
  const [ingredientQuery, setIngredientQuery] = useState("");
  const [ingredientSuggestions, setIngredientSuggestions] = useState<{ id: string; name: string; um: string; category:string }[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);

  useEffect(()=>{
    const fetchSelectedIngredients=async()=>{
      const response= await fetch('/api/fridge/get-ingredients')
      if(!response.ok){
        throw new Error('Failed to fetch selected ingredients');
      }
      const data=await response.json();

      if (data && data.rows) {
        const ingredients = data.rows.map((item: any) => ({
          id: item.id,
          name: item.nume,
          um: item.um,
          quantity: parseFloat(item.cantitate), 
          category: item.categorie,
        }));
  
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
        } catch (error) {
          console.error("Failed to fetch ingredients:", error);
        }
      } else {
        setIngredientSuggestions([]);
      }
    };
    fetchIngredients();
  }, [ingredientQuery]);

  const handleAddIngredient = (ingredient: { id: string; name: string; um: string; category:string }) => {
    const isIngredientAlreadySelected = selectedIngredients.some(item => item.id === ingredient.id);
    if (!isIngredientAlreadySelected) {
      setSelectedIngredients((prev) => [...prev, { ...ingredient, quantity: (ingredient.um==="g"||ingredient.um==="ml")?10:1 }]);
    }
    setIngredientQuery("");
    setIngredientSuggestions([]);
    
  };

  const handleRemoveIngredient = (id: string) => {
    setSelectedIngredients((prev) => prev.filter(ingredient => ingredient.id !== id));
  };
  

  const handleQuantityChange = (id: string, quantity: number) => {
    setSelectedIngredients((prev) =>
      prev.map(ingredient =>
        ingredient.id === id ? { ...ingredient, quantity } : ingredient
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
    <div className='p-[1vw] pt-[90px] h-screen w-full max-md:h-fit'>
      <div className='bg-gray-300 w-full h-full grid grid-cols-[40%_60%] rounded-3xl max-md:grid-cols-1 overflow-hidden'>
        <div className='flex flex-col overflow-auto'>
          <div className='pb-5 bg-blue-300 relative'>
            <div className='flex justify-between items-center sticky'>
              <div className='w-fit bg-blue-500 rounded-r-3xl p-2 pr-3 my-4 text-white font-bold text-3xl'>
                Frigiderul meu
              </div>
              <Button onClick={onClickButton} className='bg-green-800'>Salveaza modificarile</Button>
            </div>
            
            
            <Input 
              className='rounded-full w-[400px] mx-auto z-20'
              value={ingredientQuery}
              onChange={(e)=>setIngredientQuery(e.target.value)}
            />

            {ingredientSuggestions.length > 0 && (
              <ul className=" p-2 max-h-40 overflow-y-auto bg-white w-[500px] mx-auto absolute">
                {ingredientSuggestions.map((ingredient) => (
                  <li
                    key={ingredient.id}
                    className="cursor-pointer p-1 hover:bg-gray-200 flex items-center gap-4"
                    onClick={() => {
                      handleAddIngredient(ingredient);
                      toast("Ingredient adaugat", {
                        description: `${ingredient.name}`,
                        action: {
                          label: "Anulează",
                          onClick: () => handleRemoveIngredient(ingredient.id),
                        },
                      })
                    }}
                  >
                    <Image
                      src={`/svg-icons/${ingredient.category}.svg`}
                      height={30}
                      width={30}
                      alt=''
                    />
                    {ingredient.name} ({ingredient.um})
                  </li>
                ))}
              </ul>
            )}

          </div>

          <div className=' flex-grow'>
            <Accordion type="multiple">
              {categories?.map(category=>{
                const filteredIngredients=selectedIngredients.filter(ingredient=> ingredient.category === category);
                const noIngredients=filteredIngredients.length;
              return (
                <AccordionItem value={category} className=''>
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
                      {filteredIngredient.name}
                      </div>
                      <div  
                        onClick={()=>handleRemoveIngredient(filteredIngredient.id)} 
                        className="self-end bg-white text-red-600 rounded-md p-1 cursor-pointer border-red-600 border-2 hover:bg-red-600 hover:text-white"
                      >
                        <span className="material-symbols-outlined line-clamp-1">delete</span>
                      </div>

                    </AccordionContent>
                  ))}
                
                </AccordionItem>
              )})}

            </Accordion>
          </div>
        </div>
        <div className='bg-green-400 h-[200px]'>
          <Button
            variant="outline"
          >
            ceva
          </Button>


        </div>
      </div>
    </div>
  )
}

export default MyFridge

interface SelectedIngredient {
  id: string;
  name: string;
  um: string;
  quantity: number;
  category: string;
}
