import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";

export async function GET(request:Request) {
  const session=await getServerSession(options);

    try {
      const results = await sql`
        SELECT 
          u.nume,
          u.id,
          u.prenume,
          u.email,
          COUNT(fu.id) AS urmaritori,
          CASE 
            WHEN EXISTS (
                SELECT 1 FROM l_urmariri_utilizatori fu 
                WHERE fu.id_utilizator_urmarit = u.id AND fu.id_utilizator = ${session?.user.id}
            ) THEN TRUE 
            ELSE FALSE 
          END AS followed
        FROM l_utilizatori u
        INNER JOIN l_urmariri_utilizatori fu ON u.id = fu.id_utilizator_urmarit
        GROUP BY u.id, u.nume, u.prenume, u.email
      `;
      const followedUsers = results.rows;
      return NextResponse.json(followedUsers);
    } catch (error) {
      console.error("Database query error:", error);
      return NextResponse.json({ error: "Failed to fetch ingredients" }, { status: 500 });
    }
}