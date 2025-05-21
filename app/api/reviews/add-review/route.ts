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


    let sentimentScore: number | null = null;
    let toxicityScore: number | null = null;


    try {
      const hfResponse = await fetch(
        'https://api-inference.huggingface.co/models/nlptown/bert-base-multilingual-uncased-sentiment',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.HFTOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: content }),
        }
      );

      if (hfResponse.ok) {
        const sentimentData = await hfResponse.json();
        if (Array.isArray(sentimentData) && sentimentData[0]) {
          const topLabel = sentimentData[0][0].label;
          sentimentScore = parseInt(topLabel[0]);
        }
      }
    } catch (hfError) {
      console.error('Hugging Face API error:', hfError);
    }



    try {
      const hfToxicityResponse = await fetch(
        'https://api-inference.huggingface.co/models/unitary/toxic-bert',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.HFTOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: content }),
        }
      );

      if (hfToxicityResponse.ok) {
        const toxicityData = await hfToxicityResponse.json();
        if (Array.isArray(toxicityData) && toxicityData[0]) {
          // Modelul returnează un array de scoruri pentru categorii: toxic, obscene, etc.
          // Luăm scorul maxim ca indicator general de toxicitate.
          toxicityScore = Math.max(...toxicityData[0].map((item: { score: number }) => item.score));
        }
      }
    } catch (toxicityError) {
      console.error('Toxicity API error:', toxicityError);
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
        SET rating = ${rating}, continut = ${content}, scor_sentiment = ${sentimentScore}, scor_toxicitate=${toxicityScore}
        WHERE id=${reviewExists?.id}
      `
    }
    else{
      const query=`
        INSERT INTO l_reviews (id_reteta,id_utilizator,rating,continut,scor_sentiment,scor_toxicitate)
        VALUES (${id_recipe}, ${session?.user.id}, ${rating},'${content}',${sentimentScore},${toxicityScore})
      `
      await sql.query(query);
    }

    return NextResponse.json("Review saved sucessfully",{status: 201})
  } catch (error) {
    console.error("Error inserting review:", error);
    return NextResponse.json({error:"Failed to save review"},{status:500})
  }
}