import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { sql } from '@vercel/postgres'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import RecipeReportsDialog from '@/components/RecipeReportsDialog'
import DeleteRecipeAlert from '@/components/AlertDialogs/DeleteRecipeAlert'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowDown, ArrowUp } from 'lucide-react'
import Link from 'next/link'
import PaginationComponent from '@/components/PaginationComponent'
import ReviewReportsDialog from '@/components/ReviewReportsDialog'
import DeleteReviewAlert from '@/components/AlertDialogs/DeleteReviewAlert'
import UserHoverCard from '@/components/UserHoverCard'
import { getServerSession } from 'next-auth'
import { options } from '@/app/api/auth/[...nextauth]/options'
import { redirect } from "next/navigation"
import ApproveRequestAlert from '@/components/AlertDialogs/ApproveRequestAlert'
import RefuseRequestAlert from '@/components/AlertDialogs/RefuseRequestAlert'
import ReviewCard from '@/components/ReviewCard'
import { ReviewRecipePage } from '@/interfaces/review'

export const revalidate = 1

interface PageProps {
  searchParams?: {
    tab?:string
    search?: string
    sort?: string
    order?: string
    page?: string
    reviewSearch?: string
    reviewSort?: string
    reviewOrder?: string
    reviewPage?: string
    premiumSearch?: string
    premiumSort?: string
    premiumOrder?: string
    premiumPage?: string
  }
}


const page = async ({ searchParams }: PageProps) => {
  const session = await getServerSession(options);
  if(session?.user.role!="admin"){
    redirect('/')
  }

  const search = searchParams?.search || ''
  const sort = searchParams?.sort || 'numar_rapoarte'
  const order = searchParams?.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

  const allowedSort = ['nume_reteta', 'nume_autor', 'email', 'numar_rapoarte']
  const allowedOrder = ['ASC', 'DESC']
  const safeSort = allowedSort.includes(sort) ? sort : 'numar_rapoarte'
  const safeOrder = allowedOrder.includes(order) ? order : 'DESC'

  const page = parseInt(searchParams?.page || '1', 10)
  const limit=50;
  const offset = (page - 1) * limit

  const likeSearch = `%${search}%`;

  const countResult = await sql.query(
    `SELECT COUNT(DISTINCT r.id) as total
    FROM l_retete_raportate rr
    INNER JOIN l_retete r ON r.id = rr.id_reteta
    INNER JOIN l_utilizatori u ON u.id = r.id_utilizator
    WHERE r.nume ILIKE $1 OR u.nume ILIKE $1 OR u.prenume ILIKE $1 OR u.email ILIKE $1`,
    [likeSearch]
  )
  const total = parseInt(countResult.rows[0].total)
  const totalPages = Math.ceil(total / limit)

  const query = `
    SELECT 
      r.id,
      r.nume AS nume_reteta,
      u.id as id_utilizator,
      u.nume AS nume_autor,
      u.prenume AS prenume_autor,
      u.email,
      COUNT(rr.id_reteta) AS numar_rapoarte
    FROM l_retete_raportate rr
    INNER JOIN l_retete r ON r.id = rr.id_reteta
    INNER JOIN l_utilizatori u ON u.id = r.id_utilizator
    WHERE 
      r.nume ILIKE $1 OR 
      u.nume ILIKE $1 OR 
      u.prenume ILIKE $1 OR 
      u.email ILIKE $1
    GROUP BY r.id, r.nume, u.nume, u.prenume, u.email, u.id
    ORDER BY ${safeSort} ${safeOrder}
    LIMIT $2 OFFSET $3
  `
  const reportedRecipesResult = await sql.query(query, [likeSearch, limit, offset])
  const reportedRecipes = reportedRecipesResult.rows

  const reviewSearch = searchParams?.reviewSearch || ''
  const reviewSort = searchParams?.reviewSort || 'numar_rapoarte' 
  const reviewOrder = searchParams?.reviewOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'
  const reviewPage = parseInt(searchParams?.reviewPage || '1', 10)
  const reviewOffset = (reviewPage - 1) * limit

  const reportedReviewsQuery = `
    SELECT
      rev.id,
      r.nume,
      u.email,
      u.id AS id_utilizator,
      u.nume AS nume_utilizator,
      u.prenume AS prenume_utilizator,
      COUNT(rr.id_review) AS numar_rapoarte
    FROM l_reviews_raportate rr
    INNER JOIN l_reviews rev ON rr.id_review = rev.id
    INNER JOIN l_retete r ON r.id = rev.id_reteta
    INNER JOIN l_utilizatori u ON u.id = rr.id_utilizator
    WHERE 
      r.nume ILIKE '${'%' + reviewSearch + '%'}' OR 
      u.nume ILIKE '${'%' + reviewSearch + '%'}' OR 
      u.prenume ILIKE '${'%' + reviewSearch + '%'}'
    GROUP BY r.nume, u.nume, u.prenume, rev.id, u.id, u.email
    ORDER BY ${reviewSort} ${reviewOrder}
    LIMIT ${limit}
    OFFSET ${reviewOffset}
  `

  const reportedReviewsResult = await sql.query(reportedReviewsQuery)
  const reportedReviews = reportedReviewsResult.rows

  const totalReviewCountQuery = `
    SELECT COUNT(DISTINCT rev.id) AS total
    FROM l_reviews_raportate rr
    INNER JOIN l_reviews rev ON rr.id_review = rev.id
    INNER JOIN l_retete r ON r.id = rev.id_reteta
    INNER JOIN l_utilizatori u ON u.id = rr.id_utilizator
    WHERE 
      r.nume ILIKE '${'%' + reviewSearch + '%'}' OR 
      u.nume ILIKE '${'%' + reviewSearch + '%'}' OR 
      u.prenume ILIKE '${'%' + reviewSearch + '%'}'
  `

  const totalReviewCountResult = await sql.query(totalReviewCountQuery)
  const totalReviewCount = parseInt(totalReviewCountResult.rows[0].total, 10)
  const totalReviewPages = Math.ceil(totalReviewCount / limit)


  const premiumSearch = searchParams?.premiumSearch || ''
  const premiumSort = searchParams?.premiumSort || 'urmaritori'
  const premiumOrder = searchParams?.premiumOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'
  const premiumPage = parseInt(searchParams?.premiumPage || '1', 10)
  const premiumOffset = (premiumPage - 1) * limit

  const premiumQuery = `
    SELECT 
      c.id,
      c.id_utilizator,
      u.nume,
      u.prenume,
      u.email,
      (SELECT COUNT(*) FROM l_urmariri_utilizatori lu WHERE lu.id_utilizator_urmarit = c.id_utilizator) AS urmaritori,
      (SELECT COUNT(*) FROM l_retete r WHERE r.id_utilizator=c.id_utilizator) AS numar_retete,
      (SELECT COUNT(*) FROM l_reviews r WHERE r.id_utilizator=c.id_utilizator) AS numar_recenzii
    FROM l_cereri_premium c
    INNER JOIN l_utilizatori u ON u.id=c.id_utilizator
    WHERE 
      u.nume ILIKE '%${premiumSearch}%' OR 
      u.prenume ILIKE '%${premiumSearch}%' OR 
      u.email ILIKE '%${premiumSearch}%'
    ORDER BY ${premiumSort} ${premiumOrder}
    LIMIT ${limit} OFFSET ${premiumOffset}
  `
  const premiumRequests = (await sql.query(premiumQuery)).rows

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM l_cereri_premium c
    INNER JOIN l_utilizatori u ON u.id=c.id_utilizator
    WHERE 
      u.nume ILIKE '%${premiumSearch}%' OR 
      u.prenume ILIKE '%${premiumSearch}%' OR 
      u.email ILIKE '%${premiumSearch}%'
  ` 
  const totalResult = await sql.query(countQuery)
  const totalPremium = parseInt(totalResult.rows[0].total)
  const totalPagesPremium = Math.ceil(totalPremium / limit)
  

  const toggleOrder = (col: string) => {
    if (sort === col && order === 'ASC') return 'desc'
    return 'asc'
  }


  const reviewsOffset = (reviewPage - 1) * limit

  const reviewsResult=await sql`
    SELECT 
      u.nume, 
      u.prenume, 
      r.*, 
      COUNT(ra.id_utilizator) AS numar_aprecieri,
      CASE 
          WHEN EXISTS (
              SELECT 1 FROM l_reviews_apreciate a 
              WHERE a.id_review = r.id AND a.id_utilizator = ${session?.user.id}
          ) THEN TRUE 
          ELSE FALSE 
      END AS liked
    FROM 
      l_reviews r
    JOIN 
      l_utilizatori u ON r.id_utilizator = u.id
    LEFT JOIN 
      l_reviews_apreciate ra ON ra.id_review = r.id
    GROUP BY 
      r.id, u.nume, u.prenume
    ORDER BY scor_toxicitate asc
    LIMIT ${limit} OFFSET ${reviewsOffset}
  `
  const reviews:ReviewRecipePage[]=reviewsResult?.rows as ReviewRecipePage[];

  const allReviewsCount= await sql`
    SELECT COUNT(r.id) as total FROM l_reviews r
    JOIN 
      l_utilizatori u ON r.id_utilizator = u.id
  `
  const totalReviews = parseInt(allReviewsCount.rows[0].total)
  const totalPagesForReviews = Math.ceil(totalReviews / limit)

  return (
    <div className="pt-[80px] px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold my-8">Panou pentru administrare </h1>
      <Tabs defaultValue={searchParams?.tab || 'reported-recipes'} className="w-full">
      <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="reported-recipes">
            Rețete raportate
          </TabsTrigger>
          <TabsTrigger value="reported-reviews">Recenzii raportate</TabsTrigger>
          <TabsTrigger value="premium">Solicitări premium</TabsTrigger>
          <TabsTrigger value="ai-moderation">Automat</TabsTrigger>
        </TabsList>

        <TabsContent value="reported-recipes" className="mt-6">
          <form className="mb-4 flex gap-2" method="GET">
            <Input
              type="text"
              name="search"
              pattern="^[a-zA-ZăîâșțĂÎÂȘȚ0-9\s@.,]+$"
              title="Sunt permise doar litere, cifre, spații, @, . și ,"
              placeholder="Caută rețetă sau autor..."
              defaultValue={search}
              className="w-full max-w-sm"
            />
            <Button type="submit" className='bg-emerald-700'>Caută</Button>
          </form>

          <div className="overflow-x-auto rounded-lg shadow mb-8">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  {/* Coloana: Nume reteta */}
                  <TableHead className="font-bold text-emerald-700 hover:bg-emerald-500 hover:text-white">
                    <Link
                      href={`?search=${search}&sort=nume_reteta&order=${toggleOrder('nume_reteta')}`}
                      className="flex items-center gap-1"
                    >
                      Nume rețetă
                      {sort === 'nume_reteta' && (order === 'ASC' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </Link>
                  </TableHead>

                  {/* Coloana: Autor */}
                  <TableHead className="font-bold text-emerald-700 hover:bg-emerald-500 hover:text-white">
                    <Link
                      href={`?search=${search}&sort=nume_autor&order=${toggleOrder('nume_autor')}`}
                      className="flex items-center gap-1"
                    >
                      Autor
                      {sort === 'nume_autor' && (order === 'ASC' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </Link>
                  </TableHead>

                  {/* Coloana: Email autor */}
                  <TableHead className="font-bold text-emerald-700 hover:bg-emerald-500 hover:text-white">
                    <Link
                      href={`?search=${search}&sort=email&order=${toggleOrder('email')}`}
                      className="flex items-center gap-1"
                    >
                      Email
                      {sort === 'email' && (order === 'ASC' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </Link>
                  </TableHead>


                  {/* Coloana: Rapoarte */}
                  <TableHead className="font-bold text-emerald-700 hover:bg-emerald-500 hover:text-white">
                    <Link
                      href={`?search=${search}&sort=numar_rapoarte&order=${toggleOrder('numar_rapoarte')}`}
                      className="flex items-center gap-1"
                    >
                      Nr. rapoarte
                      {sort === 'numar_rapoarte' && (order === 'ASC' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </Link>
                  </TableHead>

                  <TableHead className="font-bold text-emerald-700 text-center">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportedRecipes.map((recipe) => (
                  <TableRow key={recipe.id}>
                    <TableCell className="font-medium">{recipe.nume_reteta}</TableCell>
                    <TableCell>
                      <UserHoverCard
                        nume={recipe.nume_autor}
                        prenume={recipe.prenume_autor}
                        id={recipe.id_utilizator}
                        email={recipe.email}
                      />
                    </TableCell>
                    <TableCell>{recipe.email}</TableCell>
                    <TableCell>
                      <RecipeReportsDialog recipeId={recipe.id} reportsNumber={recipe.numar_rapoarte} />
                    </TableCell>
                    <TableCell className="flex gap-2 justify-center">
                      <DeleteRecipeAlert recipeId={recipe.id} author={recipe.nume_autor+ " "+recipe.prenume_autor} recipe={recipe.nume_reteta} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              
            </Table>

            <div className="flex w-full justify-center gap-4 my-8">
              <Link
                href={`?search=${search}&sort=${sort}&order=${order}&page=${Math.max(1, page - 1)}`}
              >
                <Button variant="outline" disabled={page <= 1}>Înapoi</Button>
              </Link>
              <Link
                href={`?search=${search}&sort=${sort}&oOrder=${order}&page=${Math.min(page + 1, totalPages)}`}
              >
                <Button variant="outline" disabled={page>=totalPages}>Următoarea</Button>
              </Link>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reported-reviews">
          <h2 className="text-xl font-semibold mb-4">Recenzii raportate</h2>

          <form className="mb-4 flex gap-2" method="GET">
            <Input
              type="text"
              name="reviewSearch"
              pattern="^[a-zA-ZăîâșțĂÎÂȘȚ0-9\s@.,]+$"
              title="Sunt permise doar litere, cifre, spații, @, . și ,"
              placeholder="Caută rețetă sau utilizator..."
              defaultValue={reviewSearch}
              className="w-full max-w-sm"
            />
            <input type="hidden" name="tab" value="reported-reviews" />
            <Button type="submit" className='bg-emerald-700'>Caută</Button>
          </form>

          <div className="overflow-x-auto rounded-lg shadow mt-4 mb-8">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-emerald-700 font-bold hover:bg-emerald-500 hover:text-white">
                    <Link
                      href={`?reviewSearch=${reviewSearch}&reviewSort=nume&reviewOrder=${reviewSort === 'nume' && reviewOrder === 'ASC' ? 'desc' : 'asc'}&reviewPage=1`}
                      className="flex items-center gap-1"
                    >
                      Pentru rețeta
                      {reviewSort === 'nume' && (reviewOrder === 'ASC' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </Link>
                  </TableHead>
                  <TableHead className="text-emerald-700 font-bold hover:bg-emerald-500 hover:text-white">
                    <Link
                      href={`?reviewSearch=${reviewSearch}&reviewSort=nume_utilizator&reviewOrder=${reviewSort === 'nume_utilizator' && reviewOrder === 'ASC' ? 'desc' : 'asc'}&reviewPage=1`}
                      className="flex items-center gap-1"
                    >
                      De către
                      {reviewSort === 'nume_utilizator' && (reviewOrder === 'ASC' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                    </Link>
                  </TableHead>
                  <TableHead className="text-emerald-700 font-bold">Nr. rapoarte</TableHead>
                  <TableHead className="text-emerald-700 font-bold text-center">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportedReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.nume}</TableCell>
                    <TableCell>
                      <UserHoverCard
                        nume={review.nume_utilizator}
                        prenume={review.prenume_utilizator}
                        id={review.id_utilizator}
                        email={review.email}
                      />
                    </TableCell>
                    <TableCell>
                      <ReviewReportsDialog reviewId={review.id} reportsNumber={review.numar_rapoarte} />
                    </TableCell>
                    <TableCell className="text-center">
                      <DeleteReviewAlert reviewId={review.id} author={review.nume_utilizator + " " +review.prenume_utilizator} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex w-full justify-center gap-4 my-8">
              <Link
                href={`?reviewSearch=${reviewSearch}&reviewSort=${reviewSort}&reviewOrder=${reviewOrder}&reviewPage=${Math.max(1, reviewPage - 1)}`}
              >
                <Button variant="outline" disabled={reviewPage <= 1}>Înapoi</Button>
              </Link>
              <Link
                href={`?reviewSearch=${reviewSearch}&reviewSort=${reviewSort}&reviewOrder=${reviewOrder}&reviewPage=${Math.min(reviewPage + 1, totalReviewPages)}`}
              >
                <Button variant="outline" disabled={reviewPage >= totalReviewPages}>Următoarea</Button>
              </Link>
            </div>
          </div>
        </TabsContent>


        <TabsContent value="premium" className="mt-6">
          <form className="mb-4 flex gap-2" method="GET">
            <Input
              type="text"
              pattern="^[a-zA-ZăîâșțĂÎÂȘȚ0-9\s@.,]+$"
              title="Sunt permise doar litere, cifre, spații, @, . și ,"
              name="premiumSearch"
              placeholder="Caută utilizator..."
              defaultValue={premiumSearch}
              className="w-full max-w-sm"
            />
            <input type="hidden" name="tab" value="premium" />
            <Button type="submit" className='bg-emerald-700'>Caută</Button>
          </form>

          <div className="overflow-x-auto rounded-lg shadow mb-8">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  {[
                    { label: 'Nume', key: 'nume' },
                    { label: 'Email', key: 'email' },
                    { label: 'Urmăritori', key: 'urmaritori' },
                    { label: 'Rețete', key: 'numar_retete' },
                    { label: 'Recenzii', key: 'numar_recenzii' },
                    { label: 'Acțiuni', key: 'actiuni' },
                  ].map((col) => (
                    <TableHead key={col.key} className="font-bold text-emerald-700 hover:bg-emerald-500 hover:text-white">
                      <Link
                        href={`?tab=premium&premiumSearch=${premiumSearch}&premiumSort=${col.key}&premiumOrder=${
                          premiumSort === col.key && premiumOrder === 'ASC' ? 'desc' : 'asc'
                        }`}
                        className="flex items-center gap-1"
                      >
                        {col.label}
                        {premiumSort === col.key &&
                          (premiumOrder === 'ASC' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
                      </Link>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {premiumRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">
                      <UserHoverCard
                        nume={req.nume}
                        prenume={req.prenume}
                        id={req.id_utilizator}
                        email={req.email}
                      />
                    </TableCell>
                    <TableCell>{req.email}</TableCell>
                    <TableCell>{req.urmaritori}</TableCell>
                    <TableCell>{req.numar_retete}</TableCell>
                    <TableCell>{req.numar_recenzii}</TableCell>
                    <TableCell className=''>
                      <div className='w-full flex justify-around'>
                        <ApproveRequestAlert requestId={req.id} user={req.nume+" "+req.prenume} ></ApproveRequestAlert>
                        <RefuseRequestAlert requestId={req.id} user={req.nume+" "+req.prenume} ></RefuseRequestAlert>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex w-full my-8 justify-center gap-4">
              <Link
                href={`?premiumSearch=${premiumSearch}&premiumSort=${premiumSort}&premiumOrder=${premiumOrder}&premiumPage=${Math.max(1, premiumPage - 1)}`}
              >
                <Button variant="outline" disabled={premiumPage <= 1}>Înapoi</Button>
              </Link>
              <Link
                href={`?premiumSearch=${premiumSearch}&premiumSort=${premiumSort}&premiumOrder=${premiumOrder}&premiumPage=${Math.min(premiumPage + 1, totalPagesPremium)}`}
              >
                <Button variant="outline" disabled={premiumPage >= totalPagesPremium}>Următoarea</Button>
              </Link>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="ai-moderation" className="my-6">
          <div className='grid grid-cols-2 w-[80%] mx-auto gap-x-4 gap-y-4
                        max-md:w-full max-md:grid-cols-1'>
            {reviews?.map(review=>{
              return(
                <ReviewCard review={review} isAdmin={true} key={review.id}></ReviewCard>
              )
            })}
          </div>
          <div className="flex w-full justify-center gap-4 my-8">
              <Link
                href={`?reviewPage=${Math.max(1, reviewPage - 1)}`}
              >
                <Button variant="outline" disabled={reviewPage <= 1}>Înapoi</Button>
              </Link>
              <Link
                href={`?&reviewPage=${Math.min(reviewPage + 1, totalPagesForReviews)}`}
              >
                <Button variant="outline" disabled={reviewPage >= totalPagesForReviews}>Următoarea</Button>
              </Link>
            </div>
        </TabsContent>
      </Tabs>

      
    </div>
  )
}

export default page
