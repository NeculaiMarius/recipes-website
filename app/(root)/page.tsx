import { getServerSession } from "next-auth/next";
import { options } from "../api/auth/[...nextauth]/options";
import WelcomeText from "@/components/WelcomeText";
import HomeButtons from "@/components/HomeButtons";
import { homeButtons, recipes } from "@/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RecipeCard from "@/components/RecipeCard";

export const revalidate= 0


export default  async function Home() {
  const session=await getServerSession(options);  
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
          {homeButtons.map((item)=>{
            return(
              <HomeButtons text={item.text} image={item.image} route={item.route} key={item.route}/>
            )
          })}
        </div>
      </div>
    </div>

    <div className="h-fit my-16 py-4">
      <h1 className="text-4xl font-bold text-center">Cele mai populare retete</h1>
      <div className="flex justify-evenly mt-4 max-md:flex-col max-md:px-4">
        {recipes.map((item)=>{
            return(
              <RecipeCard name={item.name} rating={item.rating} author={item.author} route={item.route} key={item.name} />
            )
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
    </>
  );
}
