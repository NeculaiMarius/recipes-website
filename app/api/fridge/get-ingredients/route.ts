import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

export async function GET(request: Request) {
  try {
    const session=await getServerSession(options);  

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const result = await sql`
      SELECT i.id,nume,um,cantitate,categorie FROM l_ingrediente i,l_ingrediente_frigider f
      WHERE i.id=f.id_ingredient
      AND id_utilizator=${session?.user.id}
    ;`;

    const rows = result?.rows;

    return NextResponse.json({ rows }); 
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch selected ingredients" }, { status: 500 });
  }
}
