// Middleware는 항상 요청(Request)이 들어왔을 때 실행.
// 정적 빌드 타임에는 실행되지 않음.
// 미들웨어는 모든 경로, 특히  prefetched routes(미리 로드된 경로)에서도 
// 실행되므로 성능 문제를 방지해야 한다.
import { auth } from "@/auth";

// export { auth as middleware } from "@/auth"; 
// NextAuth 미들웨어를 활성화한다는 의미.
// auth.ts 에서 authorized 를 사용하려면 필요
// --> auth 가 helper function 이자 동시에 middleware adapter.
// auth 객체는 내부적으로 middleware 기능을 포함하고 있음.
// Next.js 는 이걸 전역 미들웨어로 등록한다.
// --> 모든 요청에 대해 세션/토큰을 확인하고, authorized 콜백을 실행
// authorized 콜백을 auth.ts 안에서 정의해두면, 
// export { auth as middleware } 한 줄로 전역 미들웨어가 완성

// ----------------------------------------------------------------------------- 조회수 관리 cookie
// Middleware는 next/headers의 cookies()를 직접 수정할 수 없고, 
// NextResponse 객체에 쿠키를 추가해서 반환처리 필요.
// import { randomUUID } from "crypto"; // XXX error : The edge runtime does not support Node.js 'crypto' module.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    // console.log("middleware invoked");
    //---------------------------------------- 조회수 관리위한 cookie 설정 
    const response = NextResponse.next();
    const viewerId = request.cookies.get("viewerIdForCnt")?.value;
    if (!viewerId) {
        // await connection(); //필요 없음 (Middleware는 정적 렌더링 대상 아님).
        // connection()은 “정적 프리렌더링 대신 요청 시점에 동적으로 실행해라” 라고 
        // Next.js 렌더링 엔진에 알려주는 신호.
        // Middleware는 원래부터 정적 빌드에 포함되지 않고,
        // 요청 시 실행되는 특수 레이어라서 connection()을 써도 의미 없음
        const newViewerId = crypto.randomUUID();
        // console.log("[middleware] viewerIdForCnt cookie 발행 : ", newViewerId);
        response.cookies.set("viewerIdForCnt", newViewerId, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30 * 6, // 6 months
            // maxAge: 60 * 60 * 24 * 7, // 7일
            // maxAge: 60 * 1, // 1 분
            // maxAge: 3, //test
        });
    // }else{
        // console.log("[middleware] viewerIdForCnt cookie 존재");
    }

    //---------------------------------------- 로그인 안한 경우 글작성 막기 
    const url = new URL(request.url);
    let isProtected = false;
    // 홈페이지는 인증 필요 없고, 신규 게시물 작성과 게시물 수정은 인증 필요
    // const protectedPath = ["/qna/new", "/qna/:id/edit"]; //XXX :id 동적 경로는 지원하지 않음
    // 수정 화면에서 버튼 보여주는것을 로그인 했을때만 보여주고 있어서
    // 여기서는 신규 작성만 막으면 됨.
    // const protectedPathPrefix = ["/qna/new", "/qna/edit/"];
    const protectedPathPrefix = ["/qna/new"];
    const pathname = url.pathname;
    if (pathname === "/") {
        // console.log("home....pass");
        return response; // 홈 경로는 무조건 접근 가능.
    } else {
        isProtected = protectedPathPrefix.some((prefix) => pathname.startsWith(prefix));
    }
    const session = await auth(); // auth.js helper → 현재 사용자 세션
    // console.log("middleware session:", session );
    const user = session?.user;
    // console.log("isProtected:", isProtected );
    if (isProtected && !user) {
        console.log("not logged in : redirect to login");
        return NextResponse.redirect(new URL("/api/auth/signin", request.url));
    }
    return response;
}

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
    //적용 필요한 경로를 나열하는 식으로 간단하게 처리
    // matcher: ["/qna/new", "/qna/edit/:id"],
    // matcher: ["/qna/new", ],

    // /api, /_next/static, /_next/image, favicon.ico 로 시작하는 경로에는 미들웨어가 실행되지 않고,
    // 나머지 모든 경로에는 미들웨어가 실행
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

