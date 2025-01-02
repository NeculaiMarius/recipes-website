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
    rating:"4.2",
    author:"Popescu Ion",
    route:"/images/omleta.jpg"
  },
  {
    name:"Paste cu sos de roșii",
    rating:"4.8",
    author:"Maria Ana",
    route:"/images/paste.jpg"
  },
  {
    name:"Butter chicken",
    rating:"4.5",
    author:"Irina Apostol",
    route:"/images/butter.jpg"
  },
  {
    name:"Paste carbonara",
    rating:"4.9",
    author:"Andrei Ioan",
    route:"/images/carbonara.jpg"
  }
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