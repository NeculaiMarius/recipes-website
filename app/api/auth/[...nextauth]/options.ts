    import { NextAuthOptions } from "next-auth";
    import  CredentialsProvider  from "next-auth/providers/credentials";


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

            // const {rows}=await sql`SELECT * FROM users WHERE email=${credentials?.email} AND password=${credentials?.password}`

            // if(rows.length>0){
            //     const user={
            //         id:rows[0].user_id,
            //         name:rows[0].username,
            //         email:rows[0].email,
            //     }
            //     console.log(user);
            //     return user
            // }
            // else{
            //     return null;
            // }

            if(credentials?.email || credentials?.password){
                return {
                    email: credentials.email,
                    id: "1",
                    name: "Marius",
                    role: "admin", 
                    accessToken: "some-jwt-token", 
                    image: "https://example.com/profile.jpg" 
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
            // Adaugă date suplimentare la token în timpul autentificării
            if (user) {
                token.id = user.id;
                token.role = user.role; // De exemplu, un câmp 'role'
                token.accessToken = user.accessToken; // Poți adăuga token-uri JWT suplimentare
                token.image = user.image; // Imaginea profilului, dacă este necesară
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.accessToken = token.accessToken;
                session.user.image = token.image;
            }
            return session;
        },
    },
}