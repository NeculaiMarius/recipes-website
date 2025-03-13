import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(request:NextRequest) {
  try {
    const {id_recipe,id_user}=await request.json();

    if (!id_recipe || !id_user || typeof id_recipe !== "string" || typeof id_user !== "string") {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const likeRecipe = await sql`
    DELETE FROM l_retete_apreciate
    WHERE id_reteta=${id_recipe} AND id_utilizator=${id_user};
    `;

    return new NextResponse("Recipe unliked successfully!", { status: 201 });

  } catch (error) {
    return new NextResponse("Failed to unlike recipe", { status: 500 });
  }
}