import { options } from "@/app/api/auth/[...nextauth]/options";
import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(request: Request, { params }: { params: { reviewId: string } }) {
    const {reviewId}=params
  try {
    const reviewResponse=await sql`SELECT * FROM l_reviews WHERE id=${reviewId}`
    const review = reviewResponse.rows[0];


    if (reviewResponse.rows.length === 0) {
      return new Response("Review not found", { status: 404 });
    }

    const session=await getServerSession(options)

    if(!session?.user || session.user.id!=review.id_utilizator){
      return new Response("Unauthorized", { status: 401 });
    }

    await sql`DELETE FROM l_reviews WHERE id=${reviewId}`;

    return new NextResponse("Review deleted successfully!", { status: 201 });

  } catch (error) {
    return new NextResponse("Failed to delete review", { status: 500 });
  }
}