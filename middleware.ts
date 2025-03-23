export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/((?!sign-in|sign-up).*)"], 
};



// export default withAuth(
//   function middleware(req) {
//     const response = NextResponse.next();
    
//       response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//       response.headers.set('Pragma', 'no-cache');
//       response.headers.set('Expires', '0');
    
//       return response;
//   },
// )

// export const config = { matcher: ["/"] }