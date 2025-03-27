import { sql } from "@vercel/postgres";
import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";



export const options: NextAuthOptions={
    providers: [
        CredentialsProvider({
        name: "Credentials",
        credentials: {
            email:{
                label: "Email: ",
                type: "text",
                placeholder: "Enter email",
            },
            password:{
                label: "Password",
                type: "password",
            },
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
                return null;
            }
            const {rows}=await sql`SELECT * FROM l_utilizatori WHERE email=${credentials?.email}`
            if(rows.length>0){
                const user= rows[0];

                const isPasswordValid=await bcrypt.compare(credentials.password,user.parola);
                if (!isPasswordValid){
                    return null;
                }
                return {
                    email:rows[0].email,
                    id: rows[0].id,
                    name: rows[0].nume +" "+ rows[0].prenume,
                    role: rows[0].rol, 
                    image: "https://example.com/profile.jpg", 
                    firstName: rows[0].prenume ,
                    lastName: rows[0].nume,
                };
            }
            return null;
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages:{
        signIn: "/sign-in"
    },

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role; 
                token.image = user.image;
                token.firstName=user.firstName;
                token.lastName=user.lastName;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.image = token.image;

                session.user.lastName=token.lastName;
                session.user.firstName=token.firstName;
            }
            return session;
        },
    },
}