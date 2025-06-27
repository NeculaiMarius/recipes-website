// pages/api/ingredients.js
import { sql } from '@vercel/postgres';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { options } from '../../auth/[...nextauth]/options';

export async function POST(req:Request) {
  try {
    const ingredients:SelectedIngredient[] = await req.json();
    const session=await getServerSession(options);  

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const deleteQuery= `
      DELETE FROM l_ingrediente_frigider
      WHERE id_utilizator='${session?.user.id}';
    `
    await sql.query(deleteQuery);

    if(ingredients.length>0){
      const query = `
      INSERT INTO l_ingrediente_frigider (id_ingredient,id_utilizator,cantitate)
      VALUES 
      ${ingredients.map(ingredient => `('${ingredient.id}', '${session?.user.id}', '${ingredient.cantitate}')`).join(', ')}
      ;
    `;

      const result = await sql.query(query);
    }
    

    
    return NextResponse.json("Ingredient saved sucessfully",{status: 201})
  } catch (error) {
    console.error("Error inserting ingredients:", error);
    return NextResponse.json({error:"Failed to save ingredients"},{status:500})
  }
}

interface SelectedIngredient {
  id: string;
  nume: string;
  um: string;
  cantitate: number;
  categorie: string;
}

