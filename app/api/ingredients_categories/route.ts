import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET(request: Request) {
  try {
    const results = await sql`SELECT DISTINCT categorie FROM l_ingrediente`;

    const categories = results.rows.map(row => row.categorie);

    return NextResponse.json({ categories }); 
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch ingredients" }, { status: 500 });
  }
}
