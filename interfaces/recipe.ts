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

export interface RecipeFeed {
  id: number;
  nume: string;
  descriere:string;
  nume_utilizator: string;
  prenume_utilizator:string;
  image_url: string;
  rating: number;
  numar_aprecieri: number;
  numar_salvari:number;
  numar_reviews:number;
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
  numar_portii:number;
  image_url: string;
  utilizator: string;
  id_utilizator:string;
  rating_reteta: number;
  numar_aprecieri: number;
  numar_salvari: number;
  liked: boolean;
  saved: boolean;
}

