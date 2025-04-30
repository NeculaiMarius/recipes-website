import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest) {
  try {
    const {id_recipe,id_user}=await request.json();

    if (!id_recipe || !id_user || typeof id_recipe !== "string" || typeof id_user !== "string") {
      return new NextResponse("Invalid input", { status: 400 });
    }

    await sql`
    INSERT INTO l_retete_apreciate (id_reteta, id_utilizator)
    VALUES (${id_recipe}, ${id_user});
    `;

    return new NextResponse("Recipe liked successfully!", { status: 201 });

  } catch (error) {
    return new NextResponse("Failed to like recipe", { status: 500 });
  }
}