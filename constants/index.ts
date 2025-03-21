import { routeModule } from "next/dist/build/templates/app-page"

export const mainFeatures=[
  {
    label:"Acasa",
    route:"/"
  },
  {
    label:"Frigiderul meu",
    route:"/My-fridge",
  },
  {
    label:"Verifică produs",
    route:'/Product-scanner',
  },
  {
    label:"Descoperă rețete",
    route: "/Discover-recipes",
  }
]

export const homeButtons=[
  {
    text:"Descopera retete",
    image:"/svg-icons/food.svg",
    route:"/Discover-recipes",
  },
  {
    text:"Frigiderul meu",
    image:"/svg-icons/fridge.svg",
    route:"/My-fridge",
  },
  {
    text:"Verifica un produs",
    image:"/svg-icons/shopping-cart.svg",
    route:'/Product-scanner',
  },
]

export const recipes=[
  {
    name:"Omleta",
    rating:4.2,
    author:"Popescu Ion",
    route:"/images/omleta.jpg"
  },
  {
    name:"Paste cu sos de roșii",
    rating:4.8,
    author:"Maria Ana",
    route:"/images/paste.jpg"
  },
  {
    name:"Butter chicken",
    rating:4.5,
    author:"Irina Apostol",
    route:"/images/butter.jpg"
  },
  {
    name:"Paste carbonara",
    rating:4.9,
    author:"Andrei Ioan",
    route:"/images/carbonara.jpg"
  }
]

export const recipeTypes = [
  { label: "Aperitiv", value: "aperitiv" },
  { label: "Fel principal", value: "fel_principal" },
  { label: "Desert", value: "desert" },
  { label: "Supă", value: "supa" },
  { label: "Salată", value: "salata" },
  { label: "Băutură", value: "bautura" },
]

export const ingredientsCategories=[
  'Lactate',
  'Dulciuri',
  'Panificație',
  'Pește și fructe de mare',
  'Legume',
  'Carne',
  'Diverse',
  'Condimente',
  'Cereale',
  'Uleiuri',
  'Fructe',
]

export const ingredientsFilters=[
  {
    id: '117',
    name: 'Piept de pui'
  },
  {
    id: '55',
    name: 'Ou'
  },
  {
    id: '15',
    name: 'Carne de vita'
  },
  {
    id: '34',
    name: 'Lapte'
  },
  {
    id: '2',
    name: 'Mar'
  },
]

export const orderFilters=[
  {
    label:'După rating',
    value:'rating',
    color:'bg-yellow-600'
  },
  {
    label:'Cele mai apreciate',
    value:'numar_aprecieri',
    color: 'bg-red-700'
  },
  {
    label:'Cele mai multe salvări',
    value:'numar_salvari',
    color:'bg-blue-700'
  },
]

export const nutritionColors = {
  carbs: {
    label: "Carbohidrați",
    color: "hsl(37.7 92.1% 50.2%)",
    bgClass: "bg-amber-400",
    borderClass: "border-amber-400",
    textClass: "text-amber-700",
  },
  proteins: {
    label: "Proteine",
    color: "hsl(173.4 80.4% 40%)",
    bgClass: "bg-emerald-500",
    borderClass: "border-emerald-500",
    textClass: "text-emerald-700",
  },
  fats: {
    label: "Grăsimi",
    color: "hsl(333.3 71.4% 50.6%)",
    bgClass: "bg-rose-400",
    borderClass: "border-rose-400",
    textClass: "text-rose-700",
  },
}

