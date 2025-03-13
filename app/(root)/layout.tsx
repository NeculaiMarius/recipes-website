import NavigationBar from "@/components/NavigationBar";
import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <NavigationBar  />
      {children}
    </>
      
  );
}
