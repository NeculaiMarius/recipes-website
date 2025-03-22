import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <NavigationBar  />
      {children}
      <Footer />
    </>
      
  );
}
