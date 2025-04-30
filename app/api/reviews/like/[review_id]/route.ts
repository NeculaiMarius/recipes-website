import { options } from "@/app/api/auth/[...nextauth]/options";
import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest,{ params }: { params: { review_id: string } }) {
  try {
    const session= await getServerSession(options);

    if(!session?.user){
      return new NextResponse("Unauthorized",{status:401});
    }

    await sql`
    INSERT INTO l_reviews_apreciate (id_review, id_utilizator)
    VALUES (${params.review_id}, ${session.user.id});
    `;

    return new NextResponse("Review liked successfully!", { status: 201 });

  } catch (error) {
    return new NextResponse("Failed to like review", { status: 500 });
  }
}

export async function DELETE(request:NextRequest,{ params }: { params: { review_id: string } }) {
  try {
    const session= await getServerSession(options);

    if(!session?.user){
      return new NextResponse("Unauthorized",{status:401});
    }

    await sql`
      DELETE FROM l_reviews_apreciate
      WHERE id_review=${params.review_id} 
      AND id_utilizator=${session.user.id}
    `;

    return new NextResponse("Review unliked successfully!", { status: 201 });

  } catch (error) {
    return new NextResponse("Failed to unlike review", { status: 500 });
  }
}