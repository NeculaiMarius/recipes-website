import { idf } from "@/lib/cosine-similarity-functions"
import { Label } from "recharts"

export const mainFeatures=[
  {
    label:"Acasa",
    route:"/",
    image: "",
  },
  {
    label:"Pentru tine",
    route:"/Discover-recipes/Feed",
    image:"/svg-icons/Notite.svg"
  },
  {
    label:"Frigiderul meu",
    route:"/My-fridge",
    image:"/svg-icons/fridge.svg",
  },
  {
    label:"Verifică produs",
    route:'/Product-scanner',
    image:"/svg-icons/shopping-cart.svg",
  },
  {
    label:"Descoperă rețete",
    route: "/Discover-recipes",
    image:"/svg-icons/food.svg",
  },
  {
    label:"ADMINISTRARE",
    route: "/Administration",
    image:"/svg-icons/admin.svg",
  }
]

export const navigationButtons=[
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
  { label: "Supe/Ciorbe", value: "supa" },
  { label: "Salată", value: "salata" },
  { label: "Băutură", value: "bautura" },
  { label: "Paste", value: "paste" },
  { label: "Pizza", value: "pizza" },
  { label: "Patiserie", value: "patiserie"},
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
    name: 'Piept de pui',
    category:"Carne"
  },
  {
    id: '15',
    name: 'Carne de vita',
    category:"Carne"
  },
  {
    id:'245',
    name: 'Carne de porc',
    category:"Carne"
  },
  
  {
    id: '55',
    name: 'Ou',
    category:"Lactate"
  },
  {
    id: '34',
    name: 'Lapte',
    category:"Lactate"
  },
  {
    id:'35',
    name: 'Lapte integral',
    category:"Lactate"
  },
  {
    id:'24',
    name: 'Cașcaval',
    category:"Lactate"
  },
  {
    id:'243',
    name: 'Telemea',
    category:"Lactate"
  },
  {
    id:'9',
    name: 'Faină de grâu',
    category:"Panificație"
  },
  {
    id:'254',
    name: 'Făină neagră',
    category:"Panificație"
  },
  {
    id:'43',
    name: 'Zahăr',
    category:"Dulciuri"
  },
  {
    id:'44',
    name: 'Ciocolată neagră',
    category:"Dulciuri"
  },
  {
    id:'121',
    name: 'Miere',
    category:"Dulciuri"
  },
  {
    id:'261',
    name: 'Zahăr vanilinat',
    category:"Dulciuri"
  },
  {
    id:'1',
    name: 'Cartofi',
    category:"Legume"
  },
  {
    id:'6',
    name: 'Ceapă',
    category:"Legume"
  },
  {
    id:'27',
    name: 'Roșii  ',
    category:"Legume"
  },
  {
    id:'4',
    name: 'Castraveți',
    category:"Legume"
  },
  {
    id:'2',
    name: 'Măr',
    category:"Fructe"
  },
  {
    id:'10',
    name: 'Banană',
    category:"Fructe"
  },
  {
    id:'90',
    name: 'Zmeură',
    category:"Fructe"
  },
  {
    id:'239',
    name: 'Căpșuni',
    category:"Fructe"
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



