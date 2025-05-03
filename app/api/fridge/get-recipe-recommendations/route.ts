import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("query") || "";
    
    const session=await getServerSession(options);  

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const query =`
    SELECT 
      r.id, 
      r.nume, 
      u.nume AS utilizator, 
      r.image_url, 
      COALESCE(AVG(v.rating), 0) AS rating,
      COUNT(DISTINCT a.id) AS numar_aprecieri,
      COUNT(DISTINCT s.id) AS numar_salvari,
      CASE 
          WHEN EXISTS (
              SELECT 1 FROM l_retete_apreciate a 
              WHERE a.id_reteta = r.id AND a.id_utilizator = ${session.user.id}
          ) THEN TRUE 
          ELSE FALSE 
      END AS liked,
      CASE 
          WHEN EXISTS (
              SELECT 1 FROM l_retete_salvate s 
              WHERE s.id_reteta = r.id AND s.id_utilizator = ${session.user.id}
          ) THEN TRUE 
          ELSE FALSE 
      END AS saved,
      SUM(
          CASE 
              WHEN f.cantitate IS NOT NULL THEN LEAST(f.cantitate / NULLIF(ri.cantitate, 0), 1)
              ELSE 0
          END
      ) AS ingrediente_gasite,
      COUNT(ri.id_ingredient) AS ingrediente_totale,
      COALESCE(
          SUM(
              CASE 
                  WHEN f.cantitate IS NOT NULL THEN LEAST(f.cantitate / NULLIF(ri.cantitate, 0), 1)
                  ELSE 0
              END
          ) / NULLIF(COUNT(ri.id_ingredient), 0),
          0
      ) AS procent_ingrediente
    FROM l_retete r
    JOIN 
      l_utilizatori u ON r.id_utilizator = u.id
    LEFT JOIN 
      l_reviews v ON v.id_reteta = r.id
    LEFT JOIN 
      l_retete_apreciate a ON a.id_reteta = r.id
    LEFT JOIN 
      l_retete_salvate s ON s.id_reteta = r.id
    JOIN l_retete_ingrediente ri ON r.id = ri.id_reteta
    LEFT JOIN l_ingrediente_frigider f 
        ON ri.id_ingredient = f.id_ingredient 
        AND f.id_utilizator = 1
    WHERE
      lower(r.nume) LIKE lower('%${searchQuery}%')
    GROUP BY r.id, r.nume, u.nume, r.image_url
    ORDER BY procent_ingrediente DESC, ingrediente_gasite DESC;
    `;

    const result=await sql.query(query)
    
    const rows = result?.rows;

    return NextResponse.json( rows ); 
  } catch (error) {
    console.error("Database error at recipe recommendation:", error);
    return NextResponse.json({ error: "Failed to fetch recipe recommendations" }, { status: 500 });
  }
}
