import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(request:Request) {
  const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
  
    if (!query) {
      return NextResponse.json({});
    }

    try {
      const results = await sql`
        SELECT 
          u.nume,
          u.id,
          u.prenume,
          u.email,
          COUNT(fu.id) AS urmaritori
        FROM l_utilizatori u
        LEFT JOIN l_urmariri_utilizatori fu ON u.id = fu.id_utilizator_urmarit
        WHERE 
          u.nume ILIKE '%' || ${query} || '%' OR
          u.prenume ILIKE '%' || ${query} || '%' OR
          (u.nume || ' ' || u.prenume) ILIKE '%' || ${query} || '%' OR
          u.email ILIKE '%' || ${query} || '%'
        GROUP BY u.id, u.nume, u.prenume, u.email
        LIMIT 10;
      `;
      const users = results.rows;
      return NextResponse.json(users);
    } catch (error) {
      console.error("Database query error:", error);
      return NextResponse.json({ error: "Failed to fetch ingredients" }, { status: 500 });
    }
}