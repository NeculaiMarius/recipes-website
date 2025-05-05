export interface User {
  id: string;
  nume: string;
  prenume: string;
  email: string;
  rol:string;
  urmaritori: number;
  followed: boolean;
}