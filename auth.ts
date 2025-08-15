import NextAuth from "next-auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import "next-auth/jwt";

import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver, { NaverProfile } from "next-auth/providers/naver";

// session.user 객체에 userId를 추가하기 위해
// - JWT 콜백, trigger: "signIn"에서 userId 정보를 추가하고,
// - session 콜백에서 해당 userId를 세션에 추가
// 게시물 수정, 삭제시 자신의 게시물인지 확인하기 위해 사용

export const { handlers, auth, signIn, signOut } = NextAuth({
    debug: !!process.env.AUTH_DEBUG,
    theme: { logo: "https://authjs.dev/img/logo-sm.png" },
    adapter: SupabaseAdapter({
        url: process.env.SUPABASE_URL!,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    }),
    providers: [
        // 여러 provider 를 같은 유저로 묶음.
        Google({ allowDangerousEmailAccountLinking: true }),
        Kakao({ allowDangerousEmailAccountLinking: true }),
        Naver({ allowDangerousEmailAccountLinking: true }),
    ],

    //basePath: "/api/auth", //XXX
    //default "/api/auth" in "next-auth"; "/auth" with all other frameworks

    session: {
        strategy: "jwt",
        //----------------------
        // maxAge: 60 * 60 * 24 * 30, // JWT & 세션 30 일 만료
        maxAge: 60 * 60 * 1, // 1 시간
        // maxAge: 60 * 1, // 1 분
        //----------------------
        updateAge: 60 * 5, // 5분마다 토큰 갱신
        // updateAge: 60 * 1, // 1분마다 토큰 갱신
    }, //XXX 세션 관리 방식
    jwt: {
        // maxAge: 60 * 60 * 24 * 30, // 30일 default
        maxAge: 60 * 30, // JWT 자체 만료 시간 (30분)
    },
    // cookies: {
    //     // https://wonderfulwonder.tistory.com/111
    //     sessionToken: {
    //         name:
    //             process.env.NODE_ENV === "production" ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
    //             // 이거 안해도 동일하게 처리됨
    //         options: {
    //             httpOnly: true,
    //             sameSite: "lax",
    //             secure: process.env.NODE_ENV === "production",
    //         },
    //     },
    // }, //XXX 쿠키 설정

    callbacks: {
        // XXX  인증 및 세션 관리 중 호출되는 각 핸들러
        // =====================================================================
        authorized({ request, auth }) {
            // console.log("\n====>> [authorized_callback] : request :", request);
            // console.log("       [authorized_callback] : auth :", auth);
            const { pathname } = request.nextUrl;
            // console.log("[auth] pathname:", pathname); // "/", "/qna", "/qna/edit/35"
            // console.log("    -- session:", auth);
            // return !!auth;

            const isLoggedIn = !!auth?.user;
            let isProtected = false;
            // 홈페이지는 인증 필요 없고, 신규 게시물 작성과 게시물 수정은 인증 필요
            // const protectedPath = ["/qna/new", "/qna/:id/edit"]; //XXX :id 동적 경로는 지원하지 않음

            // 수정 화면에서 버튼 보여주는것을 로그인 했을때만 보여주고 있어서
            // 여기서는 신규 작성만 막으면 됨.
            // const protectedPathPrefix = ["/qna/new", "/qna/edit/"];
            const protectedPathPrefix = ["/qna/new"];
            if (pathname === "/") {
                isProtected = false;
            } else {
                isProtected = protectedPathPrefix.some((prefix) => pathname.startsWith(prefix));
            }
            // console.log("isProtected:", isProtected);

            if (isProtected) {
                if (isLoggedIn) {
                    return true;
                }
                // 로그인 페이지로 리디렉션됩니다.
                console.log("not logged in : redirect to login");
                return false;
            }
            // console.log("return true");
            return true;
        },
        // async redirect({ url, baseUrl }) {
        //     return url;
        // },

        // =====================================================================
        // https://next-auth.js.org/configuration/callbacks#jwt-callback
        // user, account, profile 및 isNewUser는 사용자가 로그인한 후 새 세션에서
        // 이 콜백이 처음 호출될 때만 전달됩니다. 이후 호출에서는 토큰만 사용할 수 있습니다.
        // /api/auth/signin, /api/auth/session에 대한 요청과
        // getSession(), getServerSession(), useSession()에 대한 호출은
        // 이 함수를 호출하지만, JWT 세션을 사용하는 경우에만 해당됩니다.
        // 데이터베이스에서 세션을 유지하는 경우 호출되지 않습니다
        // 사용자, 계정, 프로필, isNewUser 등의 내용은 제공업체와 데이터베이스 사용 여부에 따라 달라집니다
        jwt({ token, trigger, session, account, user, profile }) {
            //XXX JWT가 생성되거나 업데이트될 때 호출되며, 반환하는 값은 암호화되어 쿠키에 저장됩니다.
            if (trigger !== undefined) {
                console.log("\n====>> [jwt_callback] : trigger :", trigger);
                console.log("       [jwt_callback] : account :", account);
                console.log("       [jwt_callback] : session :", session);
                console.log("       [jwt_callback] : profile :", profile);
                console.log("       [jwt_callback] : user :", user); //!!! XXX 추가한것.
            }
            console.log("\n====>> [jwt_callback] : token :", token);

            // if (token.expires_at && Date.now() / 1000 >= Number(token.expires_at)) {
            //     // await updateOauthToken(token);
            //     console.log("!!! [jwt_callback] 토큰 만료됨, 갱신 필요 !!!");
            // }
            if (user && trigger === "signIn") {
                //XXX 여기서 자신의 글만 수정, 삭제할 수 있도록 userId 를 추가
                // 임의로 key 를 생성해서 저장 가능함
                // return { ...token, userId: user.id, providerAccountId: account?.providerAccountId };
                return { ...token, userId: user.id }; // providerAccountId 이것도 민감 정보라서 제외
            }
            if (trigger === "update") {
                token.name = session.user.name;
            }
            return token;
        },
        // =====================================================================
        async session({ session, token }) {
            //XXX jwt 콜백이 반환하는 token을 받아, 세션이 확인될 때마다 호출
            // 브라우져 콘솔에 내용이 표시되므로 주의 !!!
            // console.log("\n====>> [session_callback] : session :", session);
            // console.log("       [session_callback] : token   :", token);
            // if (!session) {
            //     console.log(">>>>>>>>> 세션이 만료됨 또는 로그아웃됨");
            // }

            // 토큰 만료 여부 확인 및 백그라운드 토큰 갱신
            // if (token.expires_at && Date.now() / 1000 >= Number(token.expires_at)) {
            //     // await updateOauthToken(token);
            //     console.log("!!! 토큰 만료됨, 갱신 필요 !!!");
            // }

            // iss: 토큰 발급자(issuer)
            // sub: 토큰 제목(subject)
            // aud: 토큰 대상자(audience)
            // exp: 토큰 만료 시간(expiration), NumericDate 형식으로 되어 있어야 함 ex) 1480849147370
            // nbf: 토큰 활성 날짜(not before), 이 날이 지나기 전의 토큰은 활성화되지 않음
            // iat: 토큰 발급 시간(issued at), 토큰 발급 이후의 경과 시간을 알 수 있음
            // jti: JWT 토큰 식별자(JWT ID), 중복 방지를 위해 사용하며, 일회용 토큰(Access Token) 등에 사용

            // XXX 위 jwt 에서 넘겨준 userId,providerAccountId 를 세션에 추가한다.
            if (token?.userId) {
                session.userId = token.userId;
            }
            if (token?.providerAccountId) {
                session.providerAccountId = token.providerAccountId;
            }

            return session;
        },
        // =====================================================================
        //XXX-------------------------------------------------------------------XXX
        async signIn({ user, account, profile }) {
            //XXX 사용자가 로그인할 때 호출되며, 반환하는 값이 true이면 로그인 성공, false이면 로그인 실패
            // console.log("\n====>> [signIn_callback] : user :", user);
            // console.log("       [signIn_callback] : account :", account);
            // console.log("       [signIn_callback] : profile :", profile);

            // if (account?.provider === "google") {
            // }
            // if (account?.provider === "naver") {
            //     const naverProfile = profile as NaverProfile;
            //     console.log("naverProfile:", naverProfile);
            // }
            //     return true;
            if (account && account.provider !== "credentials" && profile) {
                // const body = {
                //     provider: account.provider,
                //     socialUserId: account.providerAccountId,
                // };
                // const res = await server.post("/api/auth/social-login", body);
                // const data = await res.json();
                // if (data.status === "성공") {
                //     // 로그인 성공 처리
                //     return true;
                // } else {
                //     // 로그인 실패시 url redirection or 회원가입 처리
                //     const params = new URLSearchParams();
                //     params.set("provider", account.provider);
                //     params.set("id", account.providerAccountId);
                //     return `/join?${params.toString()}`;
                // }
            }
            return true;
        },
    },
    // =====================================================================
    // XXX 내가 추가 한것. XXX
    // events: {
    //     createUser: async ({ user }) => {
    //         console.log("====>> [event callback] createUser", user);
    //     },
    //     updateUser: async ({ user }) => {
    //         console.log("====>> [event callback] updateUser =>", user);
    //     },
    //     linkAccount: async ({ user, account, profile }) => {
    //         console.log("====>> [event callback] linkAccount =>", user, account, profile);
    //     },
    //     signIn: async ({ user, account, profile, isNewUser }) => {
    //         console.log("====>> [event_callback] singIn(user) =>", user);
    //         console.log("       [event_callback] singIn(account) =>", account);
    //         console.log("       [event_callback] singIn(profile) =>", profile);
    //         console.log("       [event_callback] singIn(isNewUser) =>", isNewUser);
    //     },
    //     signOut: async (payload) => {
    //         // payload can be { session } or { token }
    //         if ("session" in payload) {
    //             console.log("====>> [event_callback] signOut (session)=>", payload.session);
    //         } else if ("token" in payload) {
    //             console.log("====>> [event_callback] signOut (token)=>", payload.token);
    //         } else {
    //             console.log("====>> [event_callback] signOut=>", payload);
    //         }
    //     },
    // },
    experimental: { enableWebAuthn: true },
});

declare module "next-auth" {
    interface Session {
        userId?: string;
        providerAccountId?: string;

        nickName?: string; 
        imageUrl?: string; 
        email?: string; 
        // kakao :
        //  profile.kakao_account.profile.nickname 
        //  profile.kakao_account.profile.thumbnail_image_url 
        //  profile.kakao_account.email 

    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId?: string;
        providerAccountId?: string;
    }
}
