import { sql } from "@vercel/postgres";

export interface Ingredient{
    id: string,
    quantity: string,
}

export async function POST(request:Request) {
  const {recipeName,recipeDescription,recipeType,steps,ingredients,imageUrl,userId,imagePublicId} = await request.json();

  try {
    const insertRecipeResult= await sql`
      INSERT INTO l_retete (nume,descriere,tip,pasi_preparare,image_url,id_utilizator,image_public_id)
      VALUES (${recipeName},${recipeDescription},${recipeType},${steps.join(";")},${imageUrl},${userId},${imagePublicId})
      RETURNING id`;

    const recipeId=insertRecipeResult.rows[0].id;

    const ingredientInsertions = ingredients.map(async (ingredient:Ingredient) => {
      return await sql`
        INSERT INTO l_retete_ingrediente (id_reteta, id_ingredient, cantitate)
        VALUES (${recipeId}, ${ingredient.id}, ${ingredient.quantity})
      `;
    });

    await Promise.all(ingredientInsertions);

    return new Response("Recipe inserted successfully!", { status: 201 });
  } catch (error) {
    console.error("Error inserting recipe:", error);
    return new Response("Failed to insert recipe", { status: 500 });
  }
}