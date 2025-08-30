import NextAuth from "next-auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import "next-auth/jwt";

import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";

////////////////////////////////////////////////////////////////////////////////
export const { handlers, auth, signIn, signOut } = NextAuth({
    debug: !!process.env.AUTH_DEBUG,
    theme: { logo: "https://authjs.dev/img/logo-sm.png" },
    adapter: SupabaseAdapter({
        url: process.env.SUPABASE_URL!,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    }),

    providers: [
        // 여러 provider 를 같은 유저로 묶음 => 이미지가 일치하지 않음. db 에서 처음것으로 처리됨
        // Google({ allowDangerousEmailAccountLinking: true }),
        // Kakao({ allowDangerousEmailAccountLinking: true }),
        // Naver({ allowDangerousEmailAccountLinking: true }),
        Google({
            // Google requires "offline" access_type to provide a `refresh_token`
            // refresh_token 을 받으려면 다음처럼 해야 함
            authorization: { params: { access_type: "offline", prompt: "consent" } },
        }),
        Kakao,
        Naver,
    ],

    //basePath: "/api/auth", //XXX
    //default "/api/auth" in "next-auth"; "/auth" with all other frameworks

    //--------------------------------------------------------------------------
    // session.maxAge, jwt.maxAge 같은 설정은 NextAuth가 자체적으로
    // 세션(JWT 기반 세션)을 관리할 때 의미가 있다.
    // 즉, Credentials Provider 같은 “직접 로그인 처리”를 할 때 유효 기간을 정하는 용도.
    // 반대로 Google, Kakao, Naver 같은 OAuth Provider를 쓸 때는
    // 실제 로그인 유지 기간이 외부 서비스(구글 등)에서 발급해 주는
    // access_token, refresh_token의 만료 정책에 따라 결정됨.
    // 그래서 session.maxAge, jwt.maxAge 설정값이 적용되지 않음.
    //--------------------------------------------------------------------------
    // Access Token (짧은 만료) + Refresh Token (긴 만료) 조합이 보편적
    // Google OAuth → Access Token: 1시간이 기본이라고 한다
    // 예시 시나리오
    //     session: { maxAge: 1800 },  // 30분
    //     jwt: { maxAge: 7200 },      // 2시간
    // 사용자가 로그인함 → JWT 발급 (exp = 2시간 뒤).
    // 브라우저 쿠키(next-auth.session-token)는 30분 뒤 만료됨.
    // 30분이 지나면 브라우저는 세션 쿠키를 버림 → 사용자는 다시 로그인해야 함.
    // (비록 JWT는 2시간짜리여도, 세션이 날아갔기 때문에 접근 불가)

    // 반대로,
    //     session: { maxAge: 7200 },  // 2시간
    //     jwt: { maxAge: 1800 },      // 30분
    // 로그인 시 JWT는 30분짜리로 발급됨 (exp = 30분 뒤).
    // 쿠키는 2시간 동안 유효함.
    // 30분 뒤 JWT가 만료됨 → 서버에서 토큰 검증 실패 → 자동 재발급(refresh) or 로그아웃.
    // (쿠키는 살아있어도 JWT가 무효라서 접근 불가)

    // 대부분의 경우 두 값을 동일하게 맞추는 게 자연스럽고 혼동이 없음.
    //--------------------------------------------------------------------------

    session: {
        strategy: "jwt", // XXX 반드시 설정해야 함.
        //---------------------- Access Token 만료
        // 클라이언트 쪽에서 세션이 얼마나 살아있을지를 정의.
        // 브라우저 쿠키(next-auth.session-token)가 이 시간 동안 유효.
        // 예를 들어 session.maxAge = 1800(30분) 이라면, 브라우저 쿠키는 30분 후 만료됨.
        // 즉, 세션 유지 기간(쿠키 수명) 을 의미.
        // maxAge: 60 * 60 * 24 * 30, // 30 일 만료
        // maxAge: 60 * 60 * 1, // 1 시간
        // maxAge: 60 * 1, // 1 분
        // updateAge: 60 * 5, // 5분마다 토큰 갱신 XXX JWT 사용하는 경우에는 무시됨 !
    },
    /*
    jwt: {
        // JWT 자체가 유효한 기간을 정의.
        // 토큰 안에 들어있는 exp 값이 이 시간으로 설정됨.
        // 예를 들어 jwt.maxAge = 1800 이라면, JWT 안의 exp 클레임이 현재 시간 + 30분으로 설정됨.
        // 즉, JWT 토큰의 만료 시간(토큰 자체의 수명) 을 의미.
        // maxAge: 60 * 60 * 24 * 30, // 30일 default
        // maxAge: 60 * 30, // 30분
        // maxAge: 60 * 1, //  test
    },
    */

    callbacks: {
        // =====================================================================
        // XXX  인증 및 세션 관리 중 호출되는 각 핸들러--> middleware 에서 처리하게 변경. 사용안함
        // authorized({ request, auth }) {
        //     // console.debug("\n====>> [authorized_callback] : request :", request);
        //     // console.debug("------- [authorized_callback] : auth :", auth);
        //     const { pathname } = request.nextUrl;
        //     // console.debug("[auth] pathname:", pathname); // "/", "/qna", "/qna/edit/35"
        //     const isLoggedIn = !!auth?.user;
        //     let isProtected = false;
        //     // 홈페이지는 인증 필요 없고, 신규 게시물 작성과 게시물 수정은 인증 필요
        //     // const protectedPath = ["/qna/new", "/qna/:id/edit"]; //XXX :id 동적 경로는 지원하지 않음
        //     // 수정 화면에서 버튼 보여주는것을 로그인 했을때만 보여주고 있어서
        //     // 여기서는 신규 작성만 막으면 됨.
        //     // const protectedPathPrefix = ["/qna/new", "/qna/edit/"];
        //     const protectedPathPrefix = ["/qna/new"];
        //     if (pathname === "/") {
        //         isProtected = false;
        //     } else {
        //         isProtected = protectedPathPrefix.some((prefix) => pathname.startsWith(prefix));
        //     }
        //     console.debug("isProtected:", isProtected);
        //     if (isProtected) {
        //         if (isLoggedIn) {
        //             return true;
        //         }
        //         // 로그인 페이지로 리디렉션됩니다.
        //         console.debug("not logged in : redirect to login");
        //         return false;
        //     }
        //     // console.debug("return true");
        //     return true;
        // },

        // =====================================================================
        // jwt 콜백에서 토큰을 반환하면 session 콜백의 파라미터 token으로 받을 수 있다.
        // jwt 콜백은 사용자가 요청을 할 때마다 실행된다.
        // 아무 요청도 없는 상태라면 jwt 콜백이 호출되지 않음.
        // https://next-auth.js.org/configuration/callbacks#jwt-callback
        // user, account, profile 및 isNewUser는 사용자가 로그인한 후 새 세션에서
        // 이 콜백이 처음 호출될 때만 전달됩니다. 이후 호출에서는 토큰만 사용할 수 있습니다.
        //XXX /api/auth/signin, /api/auth/session에 대한 요청과
        // getSession(), getServerSession(), useSession()에 대한 호출은
        // 이 함수를 호출하지만, JWT 세션을 사용하는 경우에만 해당됩니다.
        // 데이터베이스에서 세션을 유지하는 경우 호출되지 않습니다
        // access_token 만료 시간 :
        // - google : 1 시간
        // - naver  : 1 시간
        // - kakao  : 6 시간
        async jwt({ token, trigger, session, account, user, profile }) {
            // token 안에 실제 JWT payload가 들어있음
            // 서버 로그에서만 보임 (브라우저 콘솔 아님)
            // if (trigger !== undefined) {
            //     console.debug("\n====>> [jwt_callback] : trigger :", trigger);
            // }
            // console.debug(" ------- [jwt_callback] : token :", token);
            // if (account !== undefined) {
            //     console.debug(" ------- [jwt_callback] : account :", account);
            // }
            // if (session !== undefined) {
            //     console.debug(" ------- [jwt_callback] : session :", session);
            // }
            // if (profile !== undefined) {
            //     console.debug(" ------- [jwt_callback] : profile :", profile);
            // }
            // if (user !== undefined) {
            //     console.debug(" ------- [jwt_callback] : user :", user); //!!! XXX 추가한것.
            // }

            const now = Date.now();
            //------------------------------------------------------------------
            // 최초 로그인 시
            // 로그인할 때만 account 값이 존재함, 응답 받은 account 정보를 token에 저장
            if (account && user) {
                // 임의로 key 를 생성해서 저장 가능함
                // session.user 객체에 userId를 추가하기 위해
                // - JWT 콜백 에서 userId 정보를 추가하고,
                // - session 콜백에서 해당 userId를 세션에 추가
                // 게시물 수정, 삭제시 자신의 게시물인지 확인하기 위해 사용
                return {
                    ...token,
                    userId: user.id,
                    // token refresh 위해 저장 ----------------- START
                    access_token: account.access_token,
                    expires_at: account.expires_at, //secs
                    refresh_token: account.refresh_token,
                    provider: account.provider,
                    // token refresh 위해 저장 ----------------- END
                };
            } else if (token.expires_at) {
                if (now < token.expires_at * 1000) {
                    // const timeLeftSecs = token.expires_at - now / 1000;
                    // console.debug("*** access_token is still valid : ", timeLeftSecs);
                    return token;
                } else {
                    // 사용자의 활동/브라우져 재시작 등으로 jwt 콜백이 호출됬을때,
                    // access_token 만료된 경우면 token refresh 처리
                    // ==> 동일한 refresh token으로 두 번 요청하면 → 두 번 다 성공.
                    //     발급된 access token들은 둘 다 동시에 유효하다.
                    // ==> refresh test를 해보니,
                    // - 사용자 활동 재개로 인해 jwt 콜백이 호출 refresh 처리 진행 중
                    // - 이 시점에 UserButton 이 render 되면서 useSession 사용부분 때문에
                    // - 다시 jwt 콜백이 중첩해서 호출되고 있고, 때문에 2번째 refresh 가 발생됨.
                    // - 2번째것의 처리가 종료되면, 중첩된 순서 때문에 최초 시작했던 
                    //   refresh 처리가 재개되어, 최종 access_token 값으로 설정됨.
                    // console.debug("now : ", now, " / expires_at  :", token.expires_at * 1000);
                    return refreshAccessToken(token);
                }
            }
            return token;
            // if (trigger === "update") {
            //     token.name = session.user.name;
            // }
        },
        // =====================================================================
        // jwt 콜백에서 토큰을 반환하면 session 콜백의 파라미터 token으로 받을 수 있다.
        // iss: 토큰 발급자(issuer)
        // sub: 토큰 제목(subject)
        // aud: 토큰 대상자(audience)
        // exp: 토큰 만료 시간(expiration), NumericDate 형식으로 되어 있어야 함 ex) 1480849147370
        // nbf: 토큰 활성 날짜(not before), 이 날이 지나기 전의 토큰은 활성화되지 않음
        // iat: 토큰 발급 시간(issued at), 토큰 발급 이후의 경과 시간을 알 수 있음
        // jti: JWT 토큰 식별자(JWT ID), 중복 방지를 위해 사용하며, 일회용 토큰(Access Token) 등에 사용
        async session({ session, token }) {
            // token은 JWT의 payload. 서명된 문자열(full JWT) 자체는 아님
            // !!! 반환 값은 클라이언트에 노출되므로 여기서 반환하는 내용에 주의
            // JWT 콜백을 통해 토큰에 추가한 내용을 !!! 클라이언트!!! 에서 사용할 수 있도록 하려면
            // 여기서도 명시적으로 반환해야 함.
            // console.debug("\n====>> [session_callback] : session :", session);
            // console.debug("------- [session_callback] : token   :", token);

            // XXX 위 jwt 에서 넘겨준 userId, expires_at 를 세션에 추가한다.
            // ==> client 에서도 사용할 정보를 설정하는 것임.
            if (token?.userId) {
                session.userId = token.userId;
            }
            // 민감 정보 제외
            // if (token?.providerAccountId) {
            //     session.providerAccountId = token.providerAccountId;
            // }
            session.error = token.error;
            session.expires_at = token.expires_at;

            return session;
        },
        // =====================================================================
        // 사용자가 로그인할 때 호출되며, 반환하는 값이 true이면 로그인 성공, false이면 로그인 실패
        // async signIn({ user, account, profile }) {
        //     console.debug("\n====>> [signIn_callback] : user :", user);
        //     console.debug("       [signIn_callback] : account :", account);
        //     console.debug("       [signIn_callback] : profile :", profile);
        //     return true;
        // },
    },
    // =====================================================================
    // 이벤트는 응답을 반환하지 않는 비동기 함수로, 감사 로깅에 유용합니다.
    // 각 이벤트에 대한 핸들러를 지정할 수 있습니다(예: 디버깅 또는 감사 로그 생성).
    // events: {
    //     createUser: async ({ user }) => {
    //         console.debug("====>> [event callback] createUser", user);
    //     },
    //     updateUser: async ({ user }) => {
    //         console.debug("====>> [event callback] updateUser =>", user);
    //     },
    //     linkAccount: async ({ user, account, profile }) => {
    //         console.debug("====>> [event callback] linkAccount =>", user, account, profile);
    //     },
    //     signIn: async ({ user, account, profile, isNewUser }) => {
    //         console.debug("====>> [event_callback] singIn(user) =>", user);
    //         console.debug("       [event_callback] singIn(account) =>", account);
    //         console.debug("       [event_callback] singIn(profile) =>", profile);
    //         console.debug("       [event_callback] singIn(isNewUser) =>", isNewUser);
    //     },
    //     signOut: async (payload) => {
    //         // payload can be { session } or { token }
    //         if ("session" in payload) {
    //             console.debug("====>> [event_callback] signOut (session)=>", payload.session);
    //         } else if ("token" in payload) {
    //             console.debug("====>> [event_callback] signOut (token)=>", payload.token);
    //         } else {
    //             console.debug("====>> [event_callback] signOut=>", payload);
    //         }
    //     },
    // },
    experimental: { enableWebAuthn: true },
});

declare module "next-auth" {
    interface Session {
        userId?: string  ;
        expires_at?: number;
        error?: "RefreshTokenError"|null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        userId?: string ;
        //---------------------------
        access_token?: string;
        expires_at?: number; //secs
        refresh_token?: string;
        // 세션 연장 처리에 실패할 경우, 실패 여부를 세션으로 넘기기 위해 추가
        error?: "RefreshTokenError"|null;
        provider?: string;
    }
}

////////////////////////////////////////////////////////////////////////////////
/**
 * Access Token을 새로 발급받는 함수
 */
async function refreshAccessToken(token: any) {
    // console.debug("\n\n******************************************* REFRESH\n\n ");
    if (!token.refresh_token) {
        throw new TypeError("Missing refresh_token");
    }
    const provider : string = token.provider;
    // console.debug("refreshAccessToken : provider=", provider);

    try {
        let url = "";
        let params: Record<string, string> = {};

        if (provider === "google") {
            url = "https://oauth2.googleapis.com/token";
            params = {
                client_id: process.env.AUTH_GOOGLE_ID!,
                client_secret: process.env.AUTH_GOOGLE_SECRET!,
                grant_type: "refresh_token",
                refresh_token: token.refresh_token,
            };
        } else if (provider === "kakao") {
            url = "https://kauth.kakao.com/oauth/token";
            params = {
                client_id: process.env.AUTH_KAKAO_ID!,
                client_secret: process.env.AUTH_KAKAO_SECRET!,
                grant_type: "refresh_token",
                refresh_token: token.refresh_token,
            };
        } else if (provider === "naver") {
            url = "https://nid.naver.com/oauth2.0/token";
            params = {
                client_id: process.env.AUTH_NAVER_ID!,
                client_secret: process.env.AUTH_NAVER_SECRET!,
                grant_type: "refresh_token",
                refresh_token: token.refresh_token,
            };
        }

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(params),
        });

        const tokensOrError = await response.json();
        if (!response.ok) {
            throw tokensOrError;
        }
        const newTokens = {
            access_token: tokensOrError["access_token"],
            // !!! naver 는 expires_in: '3600' 문자형으로 넘어옴 
            expires_in: Number(tokensOrError["expires_in"]),

            refresh_token: tokensOrError["refresh_token"],
        };
        // const newTokens = tokensOrError as {
        //     access_token: string;
        //     expires_in: number;
        //     refresh_token?: string;
        // };

        // console.debug("tokenOrError : ", tokensOrError);
        // console.debug("refresh new token:", newTokens);
        // console.debug("expires_at :", Math.floor(Date.now() / 1000 + (newTokens.expires_in ?? 3600)));

        return {
            ...token,
            access_token: newTokens.access_token ?? token.access_token,
            expires_at: Math.floor(Date.now() / 1000 + (newTokens.expires_in ?? 3600)), //secs

            // refresh_token: undefined 로 전달됨. 즉, 최초 로그인시 1번만 발행해 줌.
            // refresh 경우에는 다시 발생안함. 
            // 그런데 항상 이런게 아니고 provider 마다 동작이 다를수 있다.
            // --> 발행될수도 안될수도 있다.
            // --> 그래서 아래의 조건 처리가 필요함 !!
            refresh_token: newTokens.refresh_token ? newTokens.refresh_token : token.refresh_token,
            // https://www.rfc-editor.org/rfc/rfc6749#section-6 에 다음처럼 정의:
            // The authorization server MAY issue a new refresh token, in which case
            // the client MUST discard the old refresh token and replace it with the
            // new refresh token.  The authorization server MAY revoke the old
            // refresh token after issuing a new refresh token to the client.
            // --> MAY 라고 함. 
        };
    } catch (error) {
        console.error("Refresh token error", error);
        return {
            ...token,
            error: "RefreshTokenError",
        };
    }
}

