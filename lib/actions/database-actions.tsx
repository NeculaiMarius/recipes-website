"use server"
import {sql} from "@vercel/postgres"
import * as bcrypt from "bcrypt";


export const signUp = async(
  lastName:string,
  firstName:string,
  email:string,
  password:string,
  rePassword:string,
)=>{
  try {
    if(!email || !firstName || !lastName || !password || !rePassword)
      throw new Error("All fields must have a value");

    if(password!=rePassword)
      throw new Error("Passwords do not match");

    const hashedPassword=await bcrypt.hash(password,10);

    const {rows}=await sql`SELECT email FROM l_utilizatori WHERE email=${email}`;
    
    if(rows.length!=0) 
      throw new Error("This email already exists in database");

    await sql`INSERT INTO l_utilizatori (nume,prenume,email,parola,rol) 
              VALUES(${lastName},${firstName},${email},${hashedPassword},'default')`
  } catch (error) {
    console.log("Error creating a new user: "+error);
  }

  return true;
}
