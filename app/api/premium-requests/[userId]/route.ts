import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";
import { sql } from "@vercel/postgres";

export async function POST(request:NextRequest,{params}:{params:{userId:string}}) {
  try {
    const session=await getServerSession(options);

    if(!session?.user || session.user.role=='admin'){
      return new NextResponse("Unauthorized",{status:401});
    }

    await sql`
      INSERT INTO l_cereri_premium(id_utilizator)
      VALUES(${params.userId})
    `
    return new NextResponse("Request sent succesfully",{status:200});
  } catch (error) {
    console.error(error);
    return new NextResponse("Error while sending request", {status:500});
  }
}