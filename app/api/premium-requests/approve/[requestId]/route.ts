import { options } from "@/app/api/auth/[...nextauth]/options";
import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest,{ params }: { params: { requestId: string } }) {
  try {
    const session=await getServerSession(options);

    if(!session?.user || session.user.role!='admin'){
      return new NextResponse("Unauthorized",{status:401});
    }

    const userTargetsResponse=await sql`
      SELECT 
        u.id,
        (SELECT COUNT(*) FROM l_urmariri_utilizatori lu WHERE lu.id_utilizator_urmarit = u.id) AS urmaritori,
        (SELECT COUNT(*) FROM l_retete r WHERE r.id_utilizator=u.id) AS numar_retete,
        (SELECT COUNT(*) FROM l_reviews r WHERE r.id_utilizator=u.id) AS numar_recenzii
      FROM l_utilizatori u
      INNER JOIN l_cereri_premium c ON c.id_utilizator=u.id
      WHERE c.id=${params.requestId}
    `
    const userTargets=userTargetsResponse.rows[0]

    if(userTargets.urmaritori<100 || userTargets.numar_retete<10 || userTargets.numar_recenzii<10){
      return new NextResponse("User targets not fulfilled",{status:400});
    }

    await sql`
      UPDATE l_utilizatori SET rol='premium'
      WHERE id=${userTargets.id}
    `

    await sql`
      DELETE FROM l_cereri_premium 
      WHERE id=${params.requestId}
    `

    return new NextResponse("The request has been approved",{status:200});
  } catch (error) {
    console.error(error);
    return new NextResponse("Error while accepting request",{status:500});
  }
}