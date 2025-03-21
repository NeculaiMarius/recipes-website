export interface RecipeDisplay {
  id: number;
  nume: string;
  utilizator: string;
  image_url: string;
  rating: number;
  numar_aprecieri: number;
  numar_salvari:number;
  liked: boolean;
  saved: boolean;
  ingrediente_gasite:number;
  ingrediente_reteta:number;
  procent_potrivire:number;
}

export interface RecipePage{
  id: number;
  nume: string;
  descriere: string;
  tip:string;
  pasi_preparare:string;
  image_url: string;
  utilizator: string;
  rating_reteta: number;
  numar_aprecieri: number;
  numar_salvari: number;
  liked: boolean;
  saved: boolean;
}

