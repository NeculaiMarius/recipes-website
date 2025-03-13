import { sql } from '@vercel/postgres';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { options } from '../../auth/[...nextauth]/options';

export async function POST(req:Request) {
  try {
    const body = await req.json(); 
    const { id_recipe, content, rating } = body;
    const session=await getServerSession(options);  

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const reviewExistsResponse=await sql`
      SELECT id FROM l_reviews
      WHERE id_utilizator=${session?.user?.id}
      AND id_reteta=${id_recipe}
    `
    const reviewExists=await reviewExistsResponse.rows[0]

    if(reviewExists){
      await sql`
        UPDATE l_reviews
        SET rating = ${rating}, continut = ${content}
        WHERE id=${reviewExists?.id}
      `
    }
    else{
      const query=`
        INSERT INTO l_reviews (id_reteta,id_utilizator,rating,continut)
        VALUES (${id_recipe}, ${session?.user.id}, ${rating},'${content}')
      `
      await sql.query(query);
    }

    return NextResponse.json("Review saved sucessfully",{status: 201})
  } catch (error) {
    console.error("Error inserting review:", error);
    return NextResponse.json({error:"Failed to save review"},{status:500})
  }
}