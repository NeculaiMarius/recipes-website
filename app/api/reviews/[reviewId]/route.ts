import { options } from "@/app/api/auth/[...nextauth]/options";
import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: Request, { params }: { params: { reviewId: string } }) {
  try {
    if(!params.reviewId){
      return new NextResponse("No review id provided",{status:402})
    }

    const reivewResponse=await sql`
      SELECT 
        r.*,
        u.nume,
        u.prenume
      FROM l_reviews r
      INNER JOIN l_utilizatori u ON u.id=r.id_utilizator
      WHERE r.id=${params.reviewId}
    `
    const review=await reivewResponse.rows[0];
    return NextResponse.json(review);
  } catch (error) {
    return new NextResponse("Failed to get review", { status: 500 });
  }
}


export async function DELETE(request: Request, { params }: { params: { reviewId: string } }) {
    const {reviewId}=params
  try {
    const reviewResponse=await sql`SELECT * FROM l_reviews WHERE id=${reviewId}`
    const review = reviewResponse.rows[0];


    if (reviewResponse.rows.length === 0) {
      return new Response("Review not found", { status: 404 });
    }

    const session=await getServerSession(options)

    if (
      !session?.user ||
      (session.user.id !== review.id_utilizator && session.user.role !== "admin")
    ) {
        return new Response("Unauthorized", { status: 401 });
    }

    await sql`DELETE FROM l_reviews WHERE id=${reviewId}`;

    return new NextResponse("Review deleted successfully!", { status: 201 });

  } catch (error) {
    console.error(error)
    return new NextResponse("Failed to delete review", { status: 500 });
  }
}