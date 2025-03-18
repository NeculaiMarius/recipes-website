import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";


export async function POST(request:NextRequest) {
  try {
    const session=await getServerSession(options)
    const {id_user,id_followed_user}=await request.json();

    if(session?.user.id!=id_user){
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!id_user || !id_followed_user ) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    await sql`
    INSERT INTO l_urmariri_utilizatori (id_utilizator, id_utilizator_urmarit)
    VALUES (${id_user}, ${id_followed_user});
    `;

    return new NextResponse("User followed successfully!", { status: 201 });

  } catch (error) {
    return new NextResponse("Failed to follow user", { status: 500 });
  }
}

export async function DELETE(request:NextRequest) {
  try {
    const {id_user,id_followed_user}=await request.json();

    if (!id_user || !id_followed_user ) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const likeRecipe = await sql`
    DELETE FROM l_urmariri_utilizatori
    WHERE id_utilizator=${id_user} AND id_utilizator_urmarit=${id_followed_user};
    `;

    return new NextResponse("User unfollowed successfully!", { status: 201 });

  } catch (error) {
    return new NextResponse("Failed to unfollow user", { status: 500});
  }
}