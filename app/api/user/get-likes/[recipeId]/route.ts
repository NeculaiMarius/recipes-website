import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../../../auth/[...nextauth]/options";

export async function GET(request:Request, { params }: { params: { recipeId: string } }) {
  const session=await getServerSession(options);

  if(!params.recipeId){
    return new NextResponse("No recipe id", { status: 400 });
  }


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
        INNER JOIN l_retete_apreciate ra
          ON u.id = ra.id_utilizator
        left JOIN l_urmariri_utilizatori fu ON u.id = fu.id_utilizator_urmarit
        WHERE ra.id_reteta = ${params.recipeId}
        GROUP BY u.id, u.nume, u.prenume, u.email
      `;
      const likesList = results.rows;
      return NextResponse.json(likesList);
    } catch (error) {
      console.error("Database query error:", error);
      return NextResponse.json({ error: "Failed to fetch ingredients" }, { status: 500 });
    }
}