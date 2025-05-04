import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { options } from "../../auth/[...nextauth]/options";

export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(options);
    const { firstName, lastName, email } = await request.json();

    if (session?.user.id != params.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!firstName || !lastName || !email) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const existingUser = await sql`
      SELECT id FROM l_utilizatori WHERE email = ${email} AND id != ${session.user.id};
    `;

    if (existingUser.rows.length > 0) {
      return new NextResponse("Email already in use", { status: 409 });
    }

    await sql`
      UPDATE l_utilizatori
      SET nume = ${lastName},
          prenume = ${firstName},
          email = ${email}
      WHERE id = ${session.user.id};
    `;


    session.user.firstName = firstName;
    session.user.lastName = lastName;
    session.user.email = email;

    return new NextResponse("User data updated successfully!", { status: 201 });

  } catch (error) {
    console.error(error); // Logare eroare detaliată
    return new NextResponse("Failed to update user data", { status: 500 });
  }
}

export async function GET(request:NextRequest,{params}:{params:{userId:string}}) {
  try {
    const session = await getServerSession(options);

    if (session?.user.id != params.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userResponse=await sql`
      SELECT 
        u.nume,
        u.prenume,
        u.email,
        u.rol,
        u.id,
        (SELECT COUNT(*) FROM l_urmariri_utilizatori lu WHERE lu.id_utilizator_urmarit = u.id) AS urmaritori,
        (SELECT COUNT(*) FROM l_retete r WHERE r.id_utilizator=u.id) AS numar_retete,
        (SELECT COUNT(*) FROM l_reviews r WHERE r.id_utilizator=u.id) AS numar_recenzii
      FROM l_utilizatori u
      WHERE u.id=${params.userId}
    `
    const user= userResponse.rows[0];
    if(!user){
      return new NextResponse("User not found",{status:404});
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return new NextResponse("Error while retriving user details",{status:500})
  }
}
