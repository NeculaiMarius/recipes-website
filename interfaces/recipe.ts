export interface RecipeDisplay {
  id: number;
  nume: string;
  nume_utilizator: string;
  prenume_utilizator:string;
  rol:string;
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
  id_utilizator:string;
  nume_utilizator: string;
  rol_utilizator:string;
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
  timp_preparare:number;
  image_url: string;
  nume_utilizator: string;
  prenume_utilizator:string;
  rol:string;
  id_utilizator:string;
  rating_reteta: number;
  numar_aprecieri: number;
  numar_salvari: number;
  liked: boolean;
  saved: boolean;
}

//Interface used for cosine similarity score
export interface RecipeForCS{
  id:number;
  nume:string;
  descriere:string;
  tip:string;
  pasi_preparare:string;
  numar_portii:number;
  nume_utilizator: string;
  prenume_utilizator:string;
  ingrediente:string[];
  rol:string;
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



