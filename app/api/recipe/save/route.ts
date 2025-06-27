import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";


export async function POST(request:NextRequest) {
  try {
    const session=await getServerSession(options);
    const {id_recipe}=await request.json();

    if (!id_recipe || !session?.user.id || typeof id_recipe !== "string") {
      return new NextResponse("Invalid input", { status: 400 });
    }

    await sql`
    INSERT INTO l_retete_salvate (id_reteta, id_utilizator)
    VALUES (${id_recipe}, ${session.user.id});
    `;

    return new NextResponse("Recipe saved successfully!", { status: 201 });

  } catch (error) {
    return new NextResponse("Failed to save recipe", { status: 500 });
  }
}

export async function DELETE(request:NextRequest) {
  try {
    const session=await getServerSession(options);
    const {id_recipe}=await request.json();

    if (!id_recipe || !session?.user.id || typeof id_recipe !== "string" ) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const likeRecipe = await sql`
    DELETE FROM l_retete_salvate
    WHERE id_reteta=${id_recipe} AND id_utilizator=${session.user.id};
    `;

    return new NextResponse("Recipe unsaved successfully!", { status: 201 });

  } catch (error) {
    return new NextResponse("Failed to unsave recipe", { status: 500});
  }
}