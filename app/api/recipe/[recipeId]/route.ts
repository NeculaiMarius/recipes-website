import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";


export async function DELETE(request: Request, { params }: { params: { recipeId: string } }) {
    const { recipeId } = params;
    try {
        const session=await getServerSession(options)
        const authorResponse=await sql`SELECT id_utilizator from l_retete WHERE id=${recipeId}`

        if(!session?.user || session.user.id!=authorResponse.rows[0].id_utilizator){
            return new Response("Unauthorized", { status: 401 });
        }

        await sql`DELETE FROM l_retete WHERE id = ${recipeId}`;
        return new Response("Recipe deleted successfully!", { status: 200 });
    } catch (error) {
        console.error("Error deleting recipe:", error);
        return new Response("Failed to delete recipe", { status: 500 });
    }
}
