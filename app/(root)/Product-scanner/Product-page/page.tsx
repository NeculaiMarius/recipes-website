import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Leaf, ShieldAlert} from "lucide-react"
import Link from "next/link"
import ProductGallery from "@/components/ProductGallery"
import { Product } from "@/interfaces/product"
import { Separator } from "@/components/ui/separator"

const page = async ({ searchParams }: { searchParams: { productCode: string } }) => {
  let product: Product | null = null

  try {
    const response = await fetch(`https://world.openfoodfacts.net/api/v0/product/${searchParams.productCode}.json`, {
      headers: {
        "User-Agent": "recipe-website - neculaimarius60@gmail.com",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    product = data.product
  } catch (error) {
    console.log(error)
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn&apos;t find the product you&apos;re looking for.</p>
        <Link href="/">
          {/* <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button> */}
        </Link>
      </div>
    )
  }

  // Extract nutrition levels for display
  const nutritionLevels = product.nutrient_levels || {}

  // Format nutrition level for display
  const getNutritionLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800"
      case "moderate":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto pt-[80px] px-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="container mx-auto">
          <ProductGallery product={product} />
        </div>

        {/* Product Info */}
        <div className="w-[90%]">
          <div className="flex flex-wrap gap-2 mb-2">
            {product.brands &&
              product.brands.split(",").map((brand, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {brand.trim()}
                </Badge>
              ))}
          </div>

          <h1 className="text-3xl font-bold mb-2">{product.product_name}</h1>

          {product.generic_name && <p className="text-gray-600 mb-4">{product.generic_name}</p>}

          <div className="flex items-center gap-4 mb-6">
            {product.nutriscore_grade && (
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    product.nutriscore_grade === "a"
                      ? "bg-green-500"
                      : product.nutriscore_grade === "b"
                        ? "bg-green-400"
                        : product.nutriscore_grade === "c"
                          ? "bg-yellow-400"
                          : product.nutriscore_grade === "d"
                            ? "bg-orange-400"
                            : "bg-red-500"
                  }`}
                >
                  {product.nutriscore_grade.toUpperCase()}
                </div>
                <span className="ml-2 text-sm">Nutri-Score</span>
              </div>
            )}

            {product.ecoscore_grade && (
              <div className="flex items-center">
                <Leaf
                  className={`w-6 h-6 ${
                    product.ecoscore_grade === "a"
                      ? "text-green-500"
                      : product.ecoscore_grade === "b"
                        ? "text-green-400"
                        : product.ecoscore_grade === "c"
                          ? "text-yellow-400"
                          : product.ecoscore_grade === "d"
                            ? "text-orange-400"
                            : "text-red-500"
                  }`}
                />
                <span className="ml-2 text-sm">Eco-Score: {product.ecoscore_grade.toUpperCase()}</span>
              </div>
            )}

            {product.nova_group && (
              <div className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-white ${
                    product.nova_group === 1
                      ? "bg-green-500"
                      : product.nova_group === 2
                        ? "bg-yellow-400"
                        : product.nova_group === 3
                          ? "bg-orange-400"
                          : "bg-red-500"
                  }`}
                >
                  {product.nova_group}
                </div>
                <span className="ml-2 text-sm">NOVA</span>
              </div>
            )}
          </div>

          {product.quantity && <p className="text-sm text-gray-600 mb-4">Quantity: {product.quantity}</p>}

          <Tabs defaultValue="ingredients" className="w-full">
            <TabsList className="grid w-full grid-cols-3 border-4 h-fit border-emerald-700">
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="ingredients" className="mt-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Ingredients</h3>
                {product.ingredients_text ? (
                  <p className="text-sm">{product.ingredients_text}</p>
                ) : (
                  <p className="text-sm text-gray-500">No ingredients information available</p>
                )}

                {product.allergens_tags && product.allergens_tags.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm flex items-center mb-2">
                      <ShieldAlert className="w-4 h-4 mr-1 text-red-500" />
                      Allergens
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.allergens_tags.map((allergen, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {allergen.replace("en:", "")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="mt-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Nutrition Facts</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {Object.entries(nutritionLevels).map(([nutrient, level]) => (
                    <div key={nutrient} className="flex items-center">
                      <span className={`px-2 py-1 rounded text-xs ${getNutritionLevelColor(level as string)}`}>
                        {level}
                      </span>
                      <span className="ml-2 text-sm capitalize">{nutrient.replace("_", " ")}</span>
                    </div>
                  ))}
                </div>

                {product.nutriments && (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">Nutrient</th>
                          <th className="px-4 py-2 text-right">Per 100g</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {["energy", "fat", "saturated-fat", "carbohydrates", "sugars", "fiber", "proteins", "salt"].map(
                          (nutrient) => {
                            const value = product.nutriments[nutrient]
                            const unit = product.nutriments[`${nutrient}_unit`] || "g"

                            if (value !== undefined) {
                              return (
                                <tr key={nutrient} className="hover:bg-gray-50">
                                  <td className="px-4 py-2 capitalize">{nutrient.replace("-", " ")}</td>
                                  <td className="px-4 py-2 text-right">
                                    {value} {unit}
                                  </td>
                                </tr>
                              )
                            }
                            return null
                          },
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="details" className="mt-4">
              <Card className="p-4">
                <div className="space-y-4">
                  {product.categories && (
                    <div>
                      <h3 className="font-semibold mb-2">Categories</h3>
                      <p className="text-sm">{product.categories}</p>
                    </div>
                  )}

                  {product.labels && (
                    <div>
                      <h3 className="font-semibold mb-2">Labels</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.labels.split(",").map((label, index) => (
                          <Badge key={index} className="text-xs">
                            {label.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.origins && (
                    <div>
                      <h3 className="font-semibold mb-2">Origin</h3>
                      <p className="text-sm">{product.origins}</p>
                    </div>
                  )}

                  {product.stores && (
                    <div>
                      <h3 className="font-semibold mb-2">Stores</h3>
                      <p className="text-sm">{product.stores}</p>
                    </div>
                  )}

                  {product.code && (
                    <div>
                      <h3 className="font-semibold mb-2">Barcode</h3>
                      <p className="text-sm font-mono">{product.code}</p>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default page




