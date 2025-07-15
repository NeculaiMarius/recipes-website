import { sql } from "@vercel/postgres";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import cloudinary from "cloudinary";
import { Recipe } from "@/components/Forms/EditRecipeForm";



cloudinary.v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET, 
});

export async function DELETE(request: Request, { params }: { params: { recipeId: string } }) {
    const { recipeId } = params;
    try {
        const session=await getServerSession(options)
        const recipeData=await sql`SELECT id_utilizator, image_public_id FROM l_retete WHERE id=${recipeId}`
        const { id_utilizator, image_public_id } = recipeData.rows[0];

        if (recipeData.rows.length === 0) {
            return new Response("Recipe not found", { status: 404 });
        }

        if (
            !session?.user || 
            (session.user.id !== id_utilizator && session.user.role !== "admin")
        ) {
            return new Response("Unauthorized", { status: 401 });
        }

        await sql`DELETE FROM l_retete WHERE id = ${recipeId}`;

        if (image_public_id) {
            await cloudinary.v2.uploader.destroy(image_public_id);
        }
        return new Response("Recipe deleted successfully!", { status: 200 });
    } catch (error) {
        console.error("Error deleting recipe:", error);
        return new Response("Failed to delete recipe", { status: 500 });
    }
}

export async function PUT(request:Request,{ params }: { params: { recipeId: string } }) {
    const recipe:Recipe=await request.json()

    try {
        const session=await getServerSession(options);

        const databaseRecipeResponse=await sql`SELECT * FROM l_retete WHERE id=${params.recipeId}`;
        const databaseRecipe= databaseRecipeResponse.rows[0];
        
        if(!session?.user || session.user.id!=databaseRecipe.id_utilizator){
            return new Response("Unauthorized", { status: 401 });
        }
        if (
            !session?.user || 
            (session.user.id !== databaseRecipe.id_utilizator && session.user.role !== "admin")
        ) {
            return new Response("Unauthorized", { status: 401 });
        }

        await sql`
            UPDATE l_retete 
            SET nume=${recipe.nume},
                descriere=${recipe.descriere},
                numar_portii=${recipe.numar_portii},
                tip=${recipe.tip},
                timp_preparare=${recipe.timp_preparare},
                image_url=${recipe.image_url},
                image_public_id=${recipe.image_public_id},
                pasi_preparare=${recipe.pasi_preparare}
            WHERE id=${recipe.id}
        `
        return new Response("Recipe edited successfully!", { status: 200 });
    } catch (error) {
        console.error("Error editing recipe:", error);
        return new Response("Failed to delete recipe", { status: 500 });
    }
}
