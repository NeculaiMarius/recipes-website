import { options } from "@/app/api/auth/[...nextauth]/options";
import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest,{params}:{params:{requestId:string}}) {
  try {
    const session= await getServerSession(options);
    
    if(!session?.user || session.user.role!='admin'){
      return new NextResponse("Unauthorized",{status:401});
    }

    await sql`
      DELETE FROM l_cereri_premium 
      WHERE id=${params.requestId}
    `

    return new NextResponse("Request refused succesfully",{status:200});
  } catch (error) {
    console.error(error);
    return new NextResponse("Error while refusing premium request",{status:500});
  }
}