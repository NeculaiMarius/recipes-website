import { options } from "@/app/api/auth/[...nextauth]/options"
import FavouriteButtonBig from "@/components/Buttons/FavouriteButtonBig"
import FollowButton from "@/components/Buttons/FollowButton"
import SaveButtonBig from "@/components/Buttons/SaveButtonBig"
import NoFollowsCard from "@/components/NoFollowsCard"
import PaginationComponent from "@/components/PaginationComponent"
import Rating from "@/components/Rating"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import UserCard from "@/components/UserCard"
import { RecipeFeed } from "@/interfaces/recipe"
import { User } from "@/interfaces/users"
import { cn } from "@/lib/utils"
import { QueryResultRow, sql } from "@vercel/postgres"
import { Heart} from "lucide-react"
import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { FaStar } from "react-icons/fa"
import { MdWorkspacePremium } from "react-icons/md"


export default async function Feed({ searchParams }: { searchParams: { page?: string}}) {
  const session=await getServerSession(options);

  let totalCountCache: number | null = null;
  const page = parseInt(searchParams.page || '1', 10); 
  const limit=12;
  const offset = (page - 1) * limit;

  const userResponse=await sql`
  Select 
    nume,
    prenume,
    email,
    (select count(id) from l_urmariri_utilizatori where id_utilizator_urmarit=${session?.user.id}) as urmaritori,
    (select count(id) from l_urmariri_utilizatori where id_utilizator=${session?.user.id}) as urmariri,
    (select count(id) from l_retete where id_utilizator=${session?.user.id}) as numar_retete
  FROM l_utilizatori u
  WHERE id=${session?.user.id}
  GROUP BY u.nume, u.prenume, u.email, u.parola, u.rol, u.id`
  const user=userResponse.rows[0];


  const result = await sql`
    SELECT 
      r.id,
      r.descriere,
      r.nume, 
      u.id as id_utilizator,
      u.rol as rol_utilizator,
      u.nume AS nume_utilizator, 
      u.prenume as prenume_utilizator,
      r.image_url, 
      (SELECT COALESCE(AVG(v.rating), 0) FROM l_reviews v WHERE v.id_reteta = r.id) AS rating,
      (SELECT COUNT(*) FROM l_retete_apreciate a WHERE a.id_reteta = r.id) AS numar_aprecieri,
      (SELECT COUNT(*) FROM l_retete_salvate s WHERE s.id_reteta = r.id) AS numar_salvari,
      (SELECT COUNT(*) FROM l_reviews v WHERE v.id_reteta=r.id) as numar_reviews,
      EXISTS (
          SELECT 1 FROM l_retete_apreciate a 
          WHERE a.id_reteta = r.id AND a.id_utilizator = ${session?.user.id}
      ) AS liked,
      EXISTS (
          SELECT 1 FROM l_retete_salvate s 
          WHERE s.id_reteta = r.id AND s.id_utilizator = ${session?.user.id}
      ) AS saved
    FROM 
      l_retete r
    JOIN 
      l_utilizatori u ON r.id_utilizator = u.id
    JOIN 
      l_urmariri_utilizatori ur ON r.id_utilizator = ur.id_utilizator_urmarit
    WHERE
      ur.id_utilizator = ${session?.user.id}
    ORDER BY 
      r.id DESC
    LIMIT ${limit} OFFSET ${offset};
  `;
  const recipes:RecipeFeed[] = result?.rows as RecipeFeed[];

  const accountsResults=await sql`
  SELECT
    u.rol, 
    u.nume,
    u.id,
    u.prenume,
    u.email,
    COUNT(fu.id) AS urmaritori,
    CASE 
          WHEN EXISTS (
              SELECT 1 FROM l_urmariri_utilizatori fu 
              WHERE fu.id_utilizator_urmarit = u.id AND fu.id_utilizator = ${session?.user.id}
          ) THEN TRUE 
          ELSE FALSE 
      END AS followed
  FROM l_utilizatori u
  LEFT JOIN l_urmariri_utilizatori fu ON u.id = fu.id_utilizator_urmarit
  LEFT JOIN l_urmariri_utilizatori fu2 
      ON u.id = fu2.id_utilizator_urmarit 
      AND fu2.id_utilizator = 1
  WHERE fu2.id_utilizator IS NULL 
  GROUP BY u.id, u.nume, u.prenume, u.email
  LIMIT 15;
  `;
  const suggestedAccounts:User[]=accountsResults?.rows as User[];


  if (totalCountCache === null) {
      const countResult = await sql`
      SELECT COUNT(*) 
      FROM l_retete r
      JOIN l_utilizatori u ON r.id_utilizator = u.id
      JOIN l_urmariri_utilizatori ur ON r.id_utilizator = ur.id_utilizator_urmarit
      WHERE ur.id_utilizator = ${session?.user.id};`;
      totalCountCache = parseInt(countResult?.rows[0].count, 10);
    }
  
    const totalPages = Math.ceil(totalCountCache / limit);

  return (
    <div className="flex flex-col  bg-gray-100 pt-[80px]">
      <div className="flex-1 container mx-auto pb-4 px-2 md:px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Sidebar - Only visible on large screens */}
          <div className="hidden lg:block lg:col-span-3">
            <LeftSidebar user={user}/>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-6">
            <ScrollArea className="">
              <div className="bg-white flex flex-col rounded-md mb-4 gap-2 p-2 h-60 overflow-auto border lg:hidden">
                <h3 className="font-semibold col-span-2 pl-4">Conturi sugerate</h3>
                {suggestedAccounts.map((account) => (
                  <UserCard account={account} userId={session?.user.id as string} key={account.id}></UserCard>
                ))}
              </div>
              <div className="space-y-4 pb-20">
                {recipes.length>0? recipes.map((recipe) => (
                  <RecipeCardFeed key={recipe.id} recipe={recipe} id_user={session?.user.id as string} />
                )):
                  <div className="w-full">
                    <NoFollowsCard></NoFollowsCard>
                  </div>
                }
                <PaginationComponent totalPages={totalPages} page={page}></PaginationComponent>
              </div>
            </ScrollArea>
          </div>

          {/* Right Sidebar - Only visible on large screens */}
          <div className="hidden lg:block lg:col-span-3">
            <RightSidebar suggestedAccounts={suggestedAccounts}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function LeftSidebar({user}:{user:QueryResultRow}) {
  return (
    <div className="space-y-4 sticky top-20">
      {/* User Profile Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-20 w-20 mb-3">
              <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Your profile" />
              <AvatarFallback>{(user.nume[0]+user.prenume[0]).toUpperCase()}</AvatarFallback>
            </Avatar>
            <h3 className="font-bold text-lg">{user.nume + " " + user.prenume}</h3>

            <div className="flex justify-between w-full mt-3 text-sm">
              <div className="text-center">
                <div className="font-bold">{user.numar_retete}</div>
                <div className="text-muted-foreground">Rețete</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{user.urmaritori}</div>
                <div className="text-muted-foreground">Urmaritori</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{user.urmariri}</div>
                <div className="text-muted-foreground">Urmariri</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

async function RightSidebar({suggestedAccounts}:{suggestedAccounts:User[]}) {
  const session=await getServerSession(options);

  return (
    <div className="space-y-4 sticky top-20">
      <Card>
        <CardHeader className="pb-2">
          <h3 className="font-semibold">Conturi sugerate</h3>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-3">
            {suggestedAccounts.map((account) => (
              <UserCard account={account} userId={session?.user.id as string} key={account.id}></UserCard>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


function RecipeCardFeed({ recipe ,id_user}: {recipe:RecipeFeed,id_user:string}) {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Link href={`/Account/${recipe.id_utilizator}`}>
            <Avatar className={cn("h-8 w-8 ",recipe.rol_utilizator=='premium'?"outline outline-2 outline-blue-600 ":"")} >
              <AvatarFallback>{(recipe.nume_utilizator[0]+recipe.prenume_utilizator[0]).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="ml-3">
            <Link href={`/Account/${recipe.id_utilizator}`}>
              <div className="font-semibold flex items-center gap-1">
                {recipe.nume_utilizator+ " " + recipe.prenume_utilizator} 
                {recipe.rol_utilizator=='premium' && <MdWorkspacePremium size={20} className="text-blue-700"/>}
              </div>
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3 pt-2 ">
        <h2 className="text-lg font-bold mb-2">{recipe.nume}</h2>
        <p className="text-sm text-muted-foreground mb-4">{recipe.descriere}</p>

        <div className="relative w-full rounded-md overflow-hidden">
          <Link href={`/Discover-recipes/Recipe-page?recipeId=${recipe.id}`}>
          <div className="aspect-[4/3]">
            <Image src={recipe.image_url || "/placeholder.svg"} alt={recipe.nume} fill className="object-cover" />
          </div>
          </Link>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col pt-0">
        <div className="flex justify-between items-center w-full pb-2 border-b">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            <span>{formatNumber(recipe.numar_aprecieri)}</span>
          </div>
          <div className="text-sm text-muted-foreground flex gap-2 items-center">
            <Rating rating={recipe.rating} />{recipe.numar_reviews} reviews
          </div>
        </div>

        <div className="flex justify-between items-center w-full pt-1 gap-1">
          <FavouriteButtonBig id_recipe={recipe.id} id_user={id_user} isLiked={recipe.liked}/>
          <SaveButtonBig id_recipe={recipe.id} id_user={id_user} isLiked={recipe.saved}/>
          <Link href={`/Discover-recipes/Recipe-page?recipeId=${recipe.id}#review`}>
            <div className='like-button font-bold px-4 py-2 shadow-xl w-[170px] justify-around text-lg bg-yellow-600 text-gray-100  max-md:w-[90px]'>
              <span className='max-md:hidden'>Review-uri</span> <FaStar size={25}></FaStar>
            </div>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}

// Helper function to format numbers (e.g., 1500 -> 1.5K)
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M"
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"
  }
  return num.toString()
}

