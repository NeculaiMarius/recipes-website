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
