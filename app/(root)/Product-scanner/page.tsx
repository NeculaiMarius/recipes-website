"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Search, Sparkles, Scan, CheckCircle } from "lucide-react"
import BarcodeScanner from "@/components/BarcodeScanner"
import { SearchProduct } from "@/interfaces/product"
import { FaFilter, FaRegSadTear, FaSearch } from "react-icons/fa";
import { FaBarcode } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator"





const ProductScanner = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [productNotFount,setProductNotFount]=useState(false)

  // Score filters
  const [nutritionGradeTag, setNutritionGradeTag] = useState("any")
  const [ecoscoreTag, setEcoscoreTag] = useState("any")

  // Nutriment filter states
  const [energyKj100g, setEnergyKj100g] = useState<string>("")
  const [energyKj100gOperator, setEnergyKj100gOperator] = useState<string>("lt")

  const [sugarServing, setSugarServing] = useState<string>("")
  const [sugarServingOperator, setSugarServingOperator] = useState<string>("gt")

  const [saturatedFat100g, setSaturatedFat100g] = useState<string>("")
  const [saturatedFat100gOperator, setSaturatedFat100gOperator] = useState<string>("eq")

  const [saltPreparedServing, setSaltPreparedServing] = useState<string>("")
  const [saltPreparedServingOperator, setSaltPreparedServingOperator] = useState<string>("lt")

  const [barcode,setBarcode]=useState<string>('')
  

  


  const getScoreColor = (grade: string) => {
    const gradeMap: Record<string, string> = {
      A: "bg-green-500",
      B: "bg-green-400",
      C: "bg-yellow-400",
      D: "bg-orange-400",
      E: "bg-red-500",
    }
    return gradeMap[grade?.toUpperCase()] || "bg-gray-400"
  }

  const searchProduct = async () => {
    try {
      setIsLoading(true)
      setProductNotFount(false);
      const nutritionParam = nutritionGradeTag !== "any" ? `&nutrition_grades_tags=${nutritionGradeTag}` : ""
      const ecoParam = ecoscoreTag !== "any" ? `&ecoscore_tags=${ecoscoreTag}` : ""

      let nutrimentParams = ""

      if (energyKj100g) {
        const operator = energyKj100gOperator === "lt" ? "<" : energyKj100gOperator === "gt" ? ">" : "="
        nutrimentParams += `&nutriment_energy-kj_100g${operator}${energyKj100g}`
      }

      if (sugarServing) {
        const operator = sugarServingOperator === "lt" ? "<" : sugarServingOperator === "gt" ? ">" : "="
        nutrimentParams += `&nutriment_sugars_serving${operator}${sugarServing}`
      }

      if (saturatedFat100g) {
        const operator = saturatedFat100gOperator === "lt" ? "<" : saturatedFat100gOperator === "gt" ? ">" : "="
        nutrimentParams += `&nutriment_saturated-fat_100g${operator}${saturatedFat100g}`
      }

      if (saltPreparedServing) {
        const operator = saltPreparedServingOperator === "lt" ? "<" : saltPreparedServingOperator === "gt" ? ">" : "="
        nutrimentParams += `&nutriment_salt_prepared_serving${operator}${saltPreparedServing}`
      }

      const response = await fetch(
        `https://world.openfoodfacts.net/cgi/search.pl?search_terms=${searchQuery}&search_simple=1&action=process&json=1${nutritionParam}${ecoParam}${nutrimentParams}`,
        {
          headers: {
            "User-Agent": "recipe-website - neculaimarius60@gmail.com",
          },
        },
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      if (data.count === 0) {
        setProductNotFount(true);
      }
      setSearchResults(data.products.slice(0, 15) || [])
    } catch (error) {
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const searchProductByBarcode = async (barcode: string) => {
    try {
      setIsLoading(true);
      setProductNotFount(false); // Resetăm înainte de a face request-ul
      setSearchResults([]);
  
      const response = await fetch(
        `https://world.openfoodfacts.net/api/v2/product/${barcode}`,
        {
          headers: {
            "User-Agent": "recipe-website - neculaimarius60@gmail.com",
          },
        }
      );
      if (response.status === 404) {
        setProductNotFount(true);
        setIsLoading(false);
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();    
      setProductNotFount(false);
      setSearchResults([data.product]);
      
    } catch (error) {
      console.error("Fetch error:", error);
      setProductNotFount(true);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  


  return (
    <div className="pt-[80px]">
      <div className="bg-white rounded-xl shadow-md mx-4 md:mx-8 lg:mx-12 border border-gray-100">
        <div className="flex flex-col items-center py-8 px-4 md:px-8">
          <h2 className="text-2xl font-bold mb-2 text-center text-emerald-700 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Găsește Produsele alimentare repede și ușor
            <Sparkles className="h-5 w-5" />
          </h2>
          <p className="text-gray-500 mb-6 text-center max-w-2xl">
            Caută produse și filtrează după valorile nutriționale pentru a găsi potrivirea perfectă pentru nevoile tale
            alimentare
          </p>

          <div className="w-full max-w-4xl">
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100">
                <TabsTrigger
                  value="search"
                  className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white gap-2"
                >
                  <span className="max-sm:hidden">Căutare Simplă</span>
                  <FaSearch size={20} />
                </TabsTrigger>
                <TabsTrigger
                  value="advanced"
                  className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white gap-2"
                >
                  <span className="max-sm:hidden">Filtre Avansate</span>
                  <FaFilter size={20}/>
                </TabsTrigger>
                <TabsTrigger
                  value="scan"
                  className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white gap-2"
                >
                  <span className="max-sm:hidden">Scanează codul de bare</span>
                  <FaBarcode size={20}/>

                </TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="space-y-4">
                <div className="flex w-full">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Caută un produs..."
                      className="pl-10 pr-4 py-6 rounded-l-lg border-r-0 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-0"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && searchProduct()}
                    />
                  </div>
                  <Button
                    className="rounded-l-none px-6 py-6 bg-emerald-700 hover:bg-emerald-800"
                    onClick={searchProduct}
                    disabled={isLoading}
                  >
                    {isLoading ? "Se caută..." : "Caută"}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="advanced">
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Termen de căutare</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          type="text"
                          placeholder="Caută un produs..."
                          className="pl-10 focus-visible:ring-emerald-700"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && searchProduct()}
              
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Nutri-Score</label>
                      <Select value={nutritionGradeTag} onValueChange={setNutritionGradeTag}>
                        <SelectTrigger className="focus:ring-emerald-700">
                          <SelectValue placeholder="Orice Nutri-Score" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Orice Nutri-Score</SelectItem>
                          <SelectItem value="a">
                            <div className="flex items-center">
                              <Badge className="bg-green-500 text-white mr-2">A</Badge>
                              <span>Calitate nutrițională excelentă</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="b">
                            <div className="flex items-center">
                              <Badge className="bg-green-400 text-white mr-2">B</Badge>
                              <span>Calitate nutrițională bună</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="c">
                            <div className="flex items-center">
                              <Badge className="bg-yellow-400 text-white mr-2">C</Badge>
                              <span>Calitate nutrițională medie</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="d">
                            <div className="flex items-center">
                              <Badge className="bg-orange-400 text-white mr-2">D</Badge>
                              <span>Calitate nutrițională slabă</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="e">
                            <div className="flex items-center">
                              <Badge className="bg-red-500 text-white mr-2">E</Badge>
                              <span>Calitate nutrițională proastă</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Eco-Score</label>
                      <Select value={ecoscoreTag} onValueChange={setEcoscoreTag}>
                        <SelectTrigger className="focus:ring-emerald-700">
                          <SelectValue placeholder="Orice Eco-Score" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Orice Eco-Score</SelectItem>
                          <SelectItem value="a">
                            <div className="flex items-center">
                              <Badge className="bg-green-500 text-white mr-2">A</Badge>
                              <span>Impact ecologic foarte scăzut</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="b">
                            <div className="flex items-center">
                              <Badge className="bg-green-400 text-white mr-2">B</Badge>
                              <span>Impact ecologic scăzut</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="c">
                            <div className="flex items-center">
                              <Badge className="bg-yellow-400 text-white mr-2">C</Badge>
                              <span>Impact ecologic moderat</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="d">
                            <div className="flex items-center">
                              <Badge className="bg-orange-400 text-white mr-2">D</Badge>
                              <span>Impact ecologic ridicat</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="e">
                            <div className="flex items-center">
                              <Badge className="bg-red-500 text-white mr-2">E</Badge>
                              <span>Impact ecologic foarte ridicat</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="nutritional-filters" className="border rounded-lg">
                      <AccordionTrigger className="text-sm font-medium px-4 py-3 hover:bg-gray-50 rounded-t-lg text-emerald-700">
                        Filtre Nutriționale
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="grid gap-4 md:grid-cols-2 mt-2">
                          {/* Energy (kJ/100g) filter */}
                          <div className="space-y-2 border rounded-md p-3 shadow-sm hover:shadow-md transition-shadow">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                              Energie (kJ/100g)
                            </label>
                            <div className="flex gap-2">
                              <Select value={energyKj100gOperator} onValueChange={setEnergyKj100gOperator}>
                                <SelectTrigger className="w-[80px] focus:ring-emerald-700">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="lt">&lt;</SelectItem>
                                  <SelectItem value="eq">=</SelectItem>
                                  <SelectItem value="gt">&gt;</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                type="number"
                                placeholder="Valoare în kJ"
                                value={energyKj100g}
                                onChange={(e) => setEnergyKj100g(e.target.value)}
                                className="flex-1 focus-visible:ring-emerald-700"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Exemplu: &lt; 200 pentru produse cu energie scăzută
                            </p>
                          </div>

                          {/* Sugars (per serving) filter */}
                          <div
                            className={`space-y-2 border rounded-md p-3 shadow-sm hover:shadow-md transition-shadow border-l-4 border-amber-400`}
                          >
                            <label
                              className={`text-sm font-medium text-amber-700 flex items-center gap-2`}
                            >
                              <div className={`w-3 h-3 rounded-full bg-amber-400`}></div>
                              Zaharuri (per porție)
                            </label>
                            <div className="flex gap-2">
                              <Select value={sugarServingOperator} onValueChange={setSugarServingOperator}>
                                <SelectTrigger className="w-[80px] focus:ring-emerald-700">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="lt">&lt;</SelectItem>
                                  <SelectItem value="eq">=</SelectItem>
                                  <SelectItem value="gt">&gt;</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                type="number"
                                placeholder="Valoare în g"
                                value={sugarServing}
                                onChange={(e) => setSugarServing(e.target.value)}
                                className="flex-1 focus-visible:ring-emerald-700"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Exemplu: &gt; 10 pentru produse cu conținut ridicat de zahăr
                            </p>
                          </div>

                          {/* Saturated fat (per 100g) filter */}
                          <div
                            className={`space-y-2 border rounded-md p-3 shadow-sm hover:shadow-md transition-shadow border-l-4 border-rose-400`}
                          >
                            <label
                              className={`text-sm font-medium text-rose-700 flex items-center gap-2`}
                            >
                              <div className={`w-3 h-3 rounded-full bg-rose-400`}></div>
                              Grăsimi Saturate (per 100g)
                            </label>
                            <div className="flex gap-2">
                              <Select value={saturatedFat100gOperator} onValueChange={setSaturatedFat100gOperator}>
                                <SelectTrigger className="w-[80px] focus:ring-emerald-700">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="lt">&lt;</SelectItem>
                                  <SelectItem value="eq">=</SelectItem>
                                  <SelectItem value="gt">&gt;</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                type="number"
                                placeholder="Valoare în g"
                                value={saturatedFat100g}
                                onChange={(e) => setSaturatedFat100g(e.target.value)}
                                className="flex-1 focus-visible:ring-emerald-700"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Exemplu: = 1 pentru conținut specific de grăsimi
                            </p>
                          </div>

                          {/* Salt (prepared per serving) filter */}
                          <div
                            className={`space-y-2 border rounded-md p-3 shadow-sm hover:shadow-md transition-shadow border-l-4 border-emerald-500`}
                          >
                            <label
                              className={`text-sm font-medium text-emerald-700 flex items-center gap-2`}
                            >
                              <div className={`w-3 h-3 rounded-full bg-emerald-500`}></div>
                              Sare (preparată per porție)
                            </label>
                            <div className="flex gap-2">
                              <Select
                                value={saltPreparedServingOperator}
                                onValueChange={setSaltPreparedServingOperator}
                              >
                                <SelectTrigger className="w-[80px] focus:ring-emerald-700">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="lt">&lt;</SelectItem>
                                  <SelectItem value="eq">=</SelectItem>
                                  <SelectItem value="gt">&gt;</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                type="number"
                                placeholder="Valoare în g"
                                value={saltPreparedServing}
                                onChange={(e) => setSaltPreparedServing(e.target.value)}
                                className="flex-1 focus-visible:ring-emerald-700"
                                step="0.01"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Exemplu: &lt; 0.1 pentru produse cu conținut scăzut de sare
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Button
                    className="w-full mt-4 bg-emerald-700 hover:bg-emerald-800"
                    onClick={searchProduct}
                    disabled={isLoading}
                  >
                    {isLoading ? "Se caută..." : "Caută cu Filtre"}
                  </Button>
                </div>
              </TabsContent>


              <TabsContent value="scan" className="w-full">
                <div className="h-fit flex justify-center">
                {!barcode ? (
                  <BarcodeScanner 
                    active={!barcode}
                    onScan={(code) => {setBarcode(code);searchProductByBarcode(code)}}
                    onError={(error) => console.error('Eroare scanare:', error)}
                  />
                ) : (
                  <div className="text-center space-y-4 mt-8">
                    <div className="inline-block bg-emerald-100 rounded-full p-4">
                      <CheckCircle className="h-12 w-12 text-emerald-700" />
                    </div>
                    <h3 className="text-xl font-semibold text-emerald-700">
                      Cod scanat cu succes!
                    </h3>
                    <p className="text-gray-600 font-mono font-bold text-lg">
                      {barcode}
                    </p>
                    <Button 
                      onClick={() => setBarcode('')}
                      variant="outline"
                      className="border-emerald-700 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Scan className="h-4 w-4 mr-2" />
                      Scanează alt cod
                    </Button>
                  </div>
                )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="xl:px-10 md:px-5 sm:px-2 mt-8">
  {isLoading ? (
    <div className="text-center py-12 space-y-4">
      <div className="animate-spin mx-auto w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full"></div>
      <p className="text-lg text-gray-600">Se caută produse...</p>
    </div>
  ) : productNotFount ? (
    <div className="text-center py-12 space-y-2">
      <div className="flex justify-center items-center gap-2">
        <p className="text-xl text-red-700">Oops..</p>
        <span className="text-red-700 text-2xl">😢</span>
      </div>
      <p className="text-lg text-gray-700">Nu s-a găsit produsul căutat</p>
      <p className="text-muted-foreground">Încearcă să cauți din nou</p>
    </div>
  ) : searchResults.length > 0 ? (
    <div className="w-full px-2 sm:px-4 md:px-5 xl:px-10 mt-8">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {searchResults.map((product) => (
          <div className="w-full" key={product.code}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
              <div className="flex flex-col sm:flex-row h-full">
                <Link
                  href={`/Product-scanner/Product-page?productCode=${product.code}`}
                  className="w-full sm:w-[180px] h-[120px] sm:h-[150px] bg-gray-50 flex items-center justify-center sm:border-r"
                >
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.product_name}
                    height={150}
                    width={180}
                    className="object-contain p-2 max-h-[120px] sm:max-h-[150px]"
                    priority={false}
                  />
                </Link>
                <CardContent className="flex-1 p-3">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <Link href={`/Product-scanner/Product-page?productCode=${product.code}`}>
                        <h3 className="font-semibold text-sm hover:text-emerald-700 hover:underline line-clamp-2">
                          {product.product_name}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground text-xs mb-2 line-clamp-1">{product.brands}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium">Nutri</span>
                          <Badge className={`${getScoreColor(product.nutriscore_grade)} text-white px-1.5 py-0.5 text-xs`}>
                            {product.nutriscore_grade?.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium">Eco</span>
                          <Badge className={`${getScoreColor(product.ecoscore_grade)} text-white px-1.5 py-0.5 text-xs`}>
                            {product.ecoscore_grade?.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      {product.categories && (
                        <div className="flex items-center gap-1 text-xs pt-1 border-t">
                          <span className="font-medium">Categorie:</span>
                          <span className="text-muted-foreground truncate">{product.categories.split(",")[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  ) : null}
</div>

      <Separator className='my-8'></Separator>
    </div>
  )
}

export default ProductScanner

