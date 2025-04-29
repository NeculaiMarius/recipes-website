import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { options } from "../../../auth/[...nextauth]/options";

export async function GET(request:Request, { params }: { params: { userId: string } }) {
  const session=await getServerSession(options);

  if(!params.userId){
    return new NextResponse("No user id", { status: 400 });
  }


    try {
      const results = await sql`
        SELECT 
        u.id,
        u.nume,
        u.prenume,
        u.email,
        COUNT(fu.id_utilizator) AS urmaritori,
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM l_urmariri_utilizatori 
            WHERE id_utilizator = ${session?.user.id} AND id_utilizator_urmarit = u.id
          ) THEN TRUE
          ELSE FALSE
        END AS followed
        FROM l_urmariri_utilizatori urm
        JOIN l_utilizatori u ON u.id = urm.id_utilizator
        LEFT JOIN l_urmariri_utilizatori fu ON fu.id_utilizator_urmarit = u.id
        WHERE urm.id_utilizator_urmarit = ${params.userId}
        GROUP BY u.id, u.nume, u.prenume, u.email
      `;
      const followersList = results.rows;
      return NextResponse.json(followersList);
    } catch (error) {
      console.error("Database query error:", error);
      return NextResponse.json({ error: "Failed to fetch ingredients" }, { status: 500 });
    }
}