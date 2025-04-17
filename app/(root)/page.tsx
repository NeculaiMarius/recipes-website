import { getServerSession } from "next-auth/next";
import { options } from "../api/auth/[...nextauth]/options";
import WelcomeText from "@/components/WelcomeText";
import HomeButtons from "@/components/Buttons/HomeButtons";
import { navigationButtons, recipes } from "@/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RecipeCard from "@/components/RecipeCard";
import { sql } from "@vercel/postgres";
import RecipeDisplayCard from "@/components/RecipeDisplayCard";
import { RecipeDisplay } from "@/interfaces/recipe";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import FollowButton from "@/components/Buttons/FollowButton";
import UserSearchBar from "@/components/UserSearchBar";

export const revalidate= 1


export default  async function Home() {
  const session=await getServerSession(options);  

  const recipeResult=await sql
  `
  SELECT 
      r.id, 
      r.nume, 
      u.nume AS utilizator, 
      r.image_url, 
      COALESCE(AVG(v.rating), 0) AS rating,
      COUNT(DISTINCT a.id) AS numar_aprecieri,
      COUNT(DISTINCT s.id) AS numar_salvari,
      CASE 
          WHEN EXISTS (
              SELECT 1 FROM l_retete_apreciate a 
              WHERE a.id_reteta = r.id AND a.id_utilizator = ${session?.user.id}
          ) THEN TRUE 
          ELSE FALSE 
      END AS liked,
      CASE 
          WHEN EXISTS (
              SELECT 1 FROM l_retete_salvate s 
              WHERE s.id_reteta = r.id AND s.id_utilizator = ${session?.user.id}
          ) THEN TRUE 
          ELSE FALSE 
      END AS saved
    FROM 
      l_retete r
    JOIN 
      l_utilizatori u ON r.id_utilizator = u.id
    LEFT JOIN 
      l_reviews v ON v.id_reteta = r.id
    LEFT JOIN 
      l_retete_apreciate a ON a.id_reteta = r.id
    LEFT JOIN 
      l_retete_salvate s ON s.id_reteta = r.id
    LEFT JOIN 
      l_retete_ingrediente ri ON ri.id_reteta = r.id
    LEFT JOIN 
      l_ingrediente i ON i.id = ri.id_ingredient
    GROUP BY 
      r.id, r.nume, u.nume, r.image_url
    ORDER BY 
      (COUNT(DISTINCT a.id) + COUNT(DISTINCT s.id)) DESC
    LIMIT 8;
  `
  const recipes:RecipeDisplay[]=recipeResult.rows as RecipeDisplay[];


  const accountsResults=await sql`
  SELECT 
    u.nume,
    u.id,
    u.prenume,
    u.email,
    COUNT(fu.id) AS urmaritori
  FROM l_utilizatori u
  LEFT JOIN l_urmariri_utilizatori fu ON u.id = fu.id_utilizator_urmarit
  GROUP BY u.id, u.nume, u.prenume, u.email
  ORDER BY COUNT(fu.id) desc;
  `;
  const accounts=accountsResults.rows;



  return (
    <>
    
    <div className=" pt-[80px] h-screen w-full grid grid-cols-[2fr_1.5fr] max-md:grid-cols-1 max-md:grid-rows-[1fr_1fr] bg-transparent">
      <div className="flex items-center justify-center bg-emerald-700 rounded-r-full round">
        <div className="flex flex-col w-full h-full justify-evenly">

          <div className="text-white text-3xl font-bold flex flex-col gap-6 pr-12 max-md:gap-2">
            <div className="pl-[5vw]">
              <WelcomeText username={session?.user.firstName} />
            </div>
            <h1 className="homepage-text pl-[15vw]">DESCOPERĂ REȚETE NOI</h1>
            <h1 className="homepage-text pl-[10vw]">ÎMPĂRTĂȘEȘTE IDEI</h1>
            <h1 className="homepage-text pl-[5vw]">CREEAZĂ-ȚI PROPRIA COLECȚIE DE REȚETE</h1>
          </div>
          
          <Link href={"/Add-recipe"} className="w-fit mx-auto">
            <div className="flex justify-center items-center text-emerald-800 font-bold text-lg bg-gray-200 py-2 px-3 rounded-2xl shadow-lg ">
              <span className="material-symbols-outlined bold-symbol text-3xl mr-3">
                post_add
              </span>

              Adauga o reteta noua
            </div>
          </Link>
        </div>
        
      </div>
      <div className="bg-gray-300 rounded-l-full flex justify-center relative">
        <div className="flex flex-col justify-center items-start">
          {navigationButtons.map((item)=>{
            return(
              <HomeButtons text={item.text} image={item.image} route={item.route} key={item.route}/>
            )
          })}
        </div>
      </div>
    </div>

    <div className="my-20 bg-amber-300 shadow-2xl px-8 py-12 relative overflow-hidden max-sm:px-1">
      <h1 className="px-2 text-3xl font-extrabold text-center text-yellow-900 drop-shadow-lg tracking-wide uppercase">
        Cele mai populare rețete
      </h1>
      <p className="text-center text-lg text-yellow-800 mt-4 font-medium italic">
        Descoperă rețetele care au cucerit inimile tuturor!
      </p>
      <div className="mt-10 flex flex-wrap justify-evenly max-sm:gap-1 ">
        {recipes.map((recipe) => {
          return (
            <RecipeDisplayCard
              recipe={recipe}
              id_user={session?.user.id || ''}
              key={recipe.id}
            />
          );
        })}
      </div>
    </div>

    
    <div className="h-fit my-16 bg-verified-gradient grid grid-cols-[1fr_1fr] max-md:grid-cols-1 max-md:grid-rows-[1fr_1fr]">
      <div className="flex flex-col items-center justify-center text-gray-200">
        <h1 className="text-3xl font-bold px-8 text-center">Poti deveni bucatar verificat</h1>
        <div className="gradient-background">
          <span className="material-symbols-outlined skillet-symbol text-8xl text-white ">skillet</span>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center text-gray-200">
        <h1 className="text-2xl font-semibold my-4">Indeplineste cerintele si aplica:</h1>
        <div className="items-start">
          <p><span className="material-symbols-outlined">done</span> Peste 10 retete publicate</p>
          <p><span className="material-symbols-outlined">done</span>Minim 100 urmaritori</p>
          <p><span className="material-symbols-outlined">done</span>Cel putin 10 review-uri acordate</p>
        </div>

        <Button className="my-4 bg-white text-blue-900">Aplica acum</Button>
      </div>
    </div>


    <div className="container mx-auto mb-10">
      
      <h1 className="text-2xl font-extrabold text-center text-blue-800 drop-shadow-lg tracking-wide uppercase mb-4">
        Cei mai cunoscuți bucătari 
      </h1>

      <div className="md:max-w-[500px] w-full mx-auto my-4">
        <UserSearchBar placeholder="Cauta un utilizator..." navbar={false}></UserSearchBar>
      </div>
      
      <div className="px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {accounts.map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border">
                  <AvatarFallback>{(user.nume[0]+user.prenume[0]).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <h3 className="font-semibold">{user.nume} {user.prenume}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-sm">
                    <span className="font-medium">{user.urmaritori}</span>{" "}
                    <span className="text-muted-foreground">followers</span>
                  </p>
                </div>
              </div>
            </CardContent>
            <div className="h-8 px-10 my-2"> 
              <FollowButton id_user={session?.user.id as string} id_followed_user={user.id} followed={false}></FollowButton>
            </div>
          </Card>
        ))}
      </div>
    </div>
    </>
  );
}
