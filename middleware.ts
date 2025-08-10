export { auth as middleware } from "@/auth";

// import { auth } from "@/auth";
// import { NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// export default auth(async (req) => {
//     console.log("req.auth -->", req.auth); //  { session: { user: { ... } } }
//     console.log("req.nextUrl.origin -->", req.nextUrl.origin); 
//     const session = await getToken({ req: req });
//     console.log("세션", session); // 로그인한 유저 정보가 담김

//     if (session == null) {
//         console.log("로그인 안된 상태로 접근함");
//         return NextResponse.redirect(new URL("/api/auth/signin", req.url));
//         // redirect('/URL') 이렇게만 해도 됨
//     }
// });

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
    //적용 필요한 경로를 나열하는 식으로 간단하게 처리
    // matcher: ["/qna/new", "/qna/edit/:id"],

    // /api, /_next/static, /_next/image, favicon.ico 로 시작하는 경로에는 미들웨어가 실행되지 않고,
    // 나머지 모든 경로에는 미들웨어가 실행
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
    // matcher: ["/((?!api|_next/static|_next/image|$|.*\\.png$).*)"],
    // matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

