import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  if (!query) { return NextResponse.json({ ingredients: [] }); }

  try {
    const results = await sql`
      SELECT nume, id, um, categorie 
      FROM l_ingrediente 
      WHERE 
        nume ILIKE ${'%' + query + '%'} 
      LIMIT 10
    `;
    return NextResponse.json({ ingredients: results.rows });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json({ error: "Failed to fetch ingredients" }, { status: 500 });
  }
}
