import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

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
