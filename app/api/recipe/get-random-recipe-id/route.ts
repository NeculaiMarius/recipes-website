import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { sql } from "@vercel/postgres";

export async function GET(request: Request) {
  try {
      const session=await getServerSession(options)
      if(!session?.user){
        return new Response("Unauthorized", { status: 401 });
      }

      const recipe=await sql`
      SELECT id
      FROM l_retete
      ORDER BY RANDOM()
      LIMIT 1;`

      const recipeId = recipe.rows[0]?.id;

      if (!recipeId) {
        return new Response("No recipe found", { status: 404 });
      }

      return new Response(JSON.stringify({ id: recipeId }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
  } catch (error) {
      console.error("Error getting a random recipe:", error);
      return new Response("Failed to get a random recipe", { status: 500 });
  }
}
