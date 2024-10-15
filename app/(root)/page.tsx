import { getServerSession } from "next-auth/next";
import { options } from "../api/auth/[...nextauth]/options";

export default  async function Home() {
  const session=await getServerSession(options);  

  return (
    <div>
      Pagina principala
      <p>Email: {session?.user?.email}</p>
      <p>ID: {session?.user?.id}</p>
      <p>Role: {session?.user?.role}</p> {/* Acum câmpul role va funcționa corect */}
      <p>Access Token: {session?.user?.accessToken}</p>
      <p>
        {session?.user.image}
      </p>
    </div>
  );
}
