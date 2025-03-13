import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest) {
  try {
    const {id_recipe,id_user}=await request.json();

    if (!id_recipe || !id_user || typeof id_recipe !== "string" || typeof id_user !== "string") {
      return new NextResponse("Invalid input", { status: 400 });
    }

    await sql`
    INSERT INTO l_retete_salvate (id_reteta, id_utilizator)
    VALUES (${id_recipe}, ${id_user});
    `;

    return new NextResponse("Recipe saved successfully!", { status: 201 });

  } catch (error) {
    return new NextResponse("Failed to save recipe", { status: 500 });
  }
}

export async function DELETE(request:NextRequest) {
  try {
    const {id_recipe,id_user}=await request.json();
    console.log(id_recipe,id_user);

    if (!id_recipe || !id_user || typeof id_recipe !== "string" || typeof id_user !== "string") {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const likeRecipe = await sql`
    DELETE FROM l_retete_salvate
    WHERE id_reteta=${id_recipe} AND id_utilizator=${id_user};
    `;

    return new NextResponse("Recipe unsaved successfully!", { status: 201 });

  } catch (error) {
    return new NextResponse("Failed to unsave recipe", { status: 500});
  }
}