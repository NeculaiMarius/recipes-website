import { getServerSession } from "next-auth/next";
import { options } from "../api/auth/[...nextauth]/options";
import WelcomeText from "@/components/WelcomeText";
import HomeButtons from "@/components/HomeButtons";
import { homeButtons, recipes } from "@/constants";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import RecipeCard from "@/components/RecipeCard";

export default  async function Home() {
  const session=await getServerSession(options);  
  return (
    <>
    
    <div className=" pt-[80px] h-full w-full grid grid-cols-[2fr_1.5fr] max-md:grid-cols-1 max-md:grid-rows-[1fr_1fr]">
      <div className="flex items-center justify-center bg-yellow-500 rounded-r-full">
        <div className="flex flex-col w-full">
          <WelcomeText username={session?.user.firstName} />
          <Link href={"/Add-recipe"} className="w-fit mx-auto">
            <div className="flex justify-center items-center text-white font-bold">
              <Image 
                src="/images/Add-egg.svg"
                height={50}
                width={50}
                alt="Add"
              />
              Adauga o reteta noua
            </div>
          </Link>
        </div>
        
      </div>
      <div className="bg-gray-300 rounded-l-full flex justify-center relative">

        {/* <Image src="/images/cutting-board.png" alt={""} 
          layout="fill"
          objectFit="cover"
          className="grayscale"
        /> */}

        <div className="flex flex-col justify-center items-start gap-8">
          {homeButtons.map((item)=>{
            return(
              <HomeButtons text={item.text} image={item.image} route={item.route} key={item.text}/>
            )
          })}
        </div>
      </div>
    </div>

    <div className="h-fit my-16 bg-gray-100 py-4">
      <h1 className="text-4xl font-bold text-center">Cele mai populare retete</h1>
      <div className="flex justify-around mt-4 max-md:flex-col max-md:px-4">
        {recipes.map((item)=>{
            return(
              <RecipeCard name={item.name} rating={item.rating} author={item.author} route={item.route} key={item.name} />
            )
        })}
      </div>
    </div>
    
    <div className="h-fit my-16 bg-verified-gradient grid grid-cols-[1fr_1fr] max-md:grid-cols-1 max-md:grid-rows-[1fr_1fr]">
      <div className="flex flex-col items-center justify-center text-gray-200">
        <h1 className="text-4xl font-bold ">Poti deveni bucatar verificat</h1>
        <div className="gradient-background">
          <span className="material-symbols-outlined skillet-symbol text-8xl text-white ">skillet</span>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center text-gray-200">
        <h1 className="text-xl font-semibold my-8">Indeplineste cerintele si aplica:</h1>
        <div className="items-start">
          <p><span className="material-symbols-outlined">done</span> Peste 10 retete publicate</p>
          <p><span className="material-symbols-outlined">done</span>Minim 100 urmaritori</p>
          <p><span className="material-symbols-outlined">done</span>Cel putin 10 review-uri acordate</p>
        </div>

        <Button className="my-8 bg-white text-blue-900">Aplica acum</Button>
      </div>
    </div>

    </>
  );
}
