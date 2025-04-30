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

    const {category,details}=await request.json();

    if (!category?.trim() || !details?.trim()) {
      return NextResponse.json({ error: "Category și details sunt obligatorii" }, { status: 400 });
    }

    await sql`
    INSERT INTO l_reviews_raportate (id_review, id_utilizator,categorie,detalii)
    VALUES (${params.review_id}, ${session.user.id},${category},${details});
    `;

    return new NextResponse("Review reported successfully!", { status: 201 });

  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to report review", { status: 500 });
  }
}