import NextAuth from "next-auth";

declare module "next-auth" {
  // Extindem tipul User
  interface User {
    id: string;
    role: string; 
    image?: string;

    firstName:string;
    lastName:string;
  }

  // Extindem tipul Session
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;  
      image?: string;

      firstName:string;
      lastName:string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;    
    image?: string;

    firstName:string;
    lastName:string;
  }
}
