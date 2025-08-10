import NextAuth from "next-auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import "next-auth/jwt";

import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
    debug: !!process.env.AUTH_DEBUG,
    theme: { logo: "https://authjs.dev/img/logo-sm.png" },
    adapter: SupabaseAdapter({
        url: process.env.SUPABASE_URL!,
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    }),
    providers: [
        Google,
    ],
    basePath: "/api/auth", //XXX XXX XXX
    session: { strategy: "jwt" }, //XXX 세션 관리 방식
    callbacks: {
        // 각 콜백의 호출 순서는 다음과 같습니다.
        // - 사용자가 로그인(회원가입) => signIn => (redirect) => jwt => session
        // - 세션 업데이트 => jwt => session
        // - 세션 확인 => session

        // XXX  인증 및 세션 관리 중 호출되는 각 핸들러
        authorized({ request, auth }) {
            const { pathname } = request.nextUrl;
            console.log("[auth] pathname:", pathname); // "/", "/qna", "/qna/edit/35"
            console.log("    -- session:", auth);
            // return !!auth;

            const isLoggedIn = !!auth?.user;
            let isProtected = false;
            // 홈페이지는 인증 필요 없고, 신규 게시물 작성과 게시물 수정은 인증 필요
            // const protectedPath = ["/qna/new", "/qna/:id/edit"]; //XXX :id 동적 경로는 지원하지 않음

            // 수정 화면에서 버튼 보여주는것을 로그인 했을때만 보여주고 있어서 
            // 여기서는 신규 작성만 막으면 됨.
            // const protectedPathPrefix = ["/qna/new", "/qna/edit/"];
            const protectedPathPrefix = ["/qna/new"];
            if(pathname=== "/") {
                isProtected=false;
            }else{
                isProtected = protectedPathPrefix.some((prefix) => pathname.startsWith(prefix))
            }
            console.log("isProtected:", isProtected);

            if (isProtected) {
                if (isLoggedIn) {
                    return true;
                }
                // 로그인 페이지로 리디렉션됩니다.
                console.log("return false");
                return false;
            }
            console.log("return true");
            return true;
        },
        jwt({ token, trigger, session, account }) {
            //XXX JWT가 생성되거나 업데이트될 때 호출되며, 반환하는 값은 암호화되어 쿠키에 저장됩니다.
            console.log("====>> jwt callback : token :", token);
            console.log("====>> jwt callback : trigger :", trigger);
            console.log("====>> jwt callback : account :", account);
            if (trigger === "update") {
                token.name = session.user.name;
            }
            if (account?.provider === "keycloak") {
                return { ...token, accessToken: account.access_token };
            }
            return token;
        },
        async session({ session, token }) {
            //XXX jwt 콜백이 반환하는 token을 받아, 세션이 확인될 때마다 호출
            console.log("====>> session callback : session :", session);
            console.log("====>> session callback : token   :", token);
            // iss: 토큰 발급자(issuer)
            // sub: 토큰 제목(subject)
            // aud: 토큰 대상자(audience)
            // exp: 토큰 만료 시간(expiration), NumericDate 형식으로 되어 있어야 함 ex) 1480849147370
            // nbf: 토큰 활성 날짜(not before), 이 날이 지나기 전의 토큰은 활성화되지 않음
            // iat: 토큰 발급 시간(issued at), 토큰 발급 이후의 경과 시간을 알 수 있음
            // jti: JWT 토큰 식별자(JWT ID), 중복 방지를 위해 사용하며, 일회용 토큰(Access Token) 등에 사용

            if (token?.accessToken) {
                session.accessToken = token.accessToken;
            }

            //============ supabase use
            // const signingSecret = process.env.SUPABASE_JWT_SECRET;
            // if (signingSecret) {
            //     const payload = {
            //         aud: "authenticated",
            //         exp: Math.floor(new Date(session.expires).getTime() / 1000),
            //         sub: token.id,
            //         email: token.email,
            //         role: "authenticated",
            //     };
            //     session.accessToken = jwt.sign(payload, signingSecret);
            // }
            //============
            return session;
        },
    },
    experimental: { enableWebAuthn: true },
});

declare module "next-auth" {
    interface Session {
        accessToken?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
    }
}

// import Apple from "next-auth/providers/apple";
// import Atlassian from "next-auth/providers/atlassian"
// import Auth0 from "next-auth/providers/auth0";
// import AzureB2C from "next-auth/providers/azure-ad-b2c";
// import BankIDNorway from "next-auth/providers/bankid-no";
// import BoxyHQSAML from "next-auth/providers/boxyhq-saml";
// import Cognito from "next-auth/providers/cognito";
// import Coinbase from "next-auth/providers/coinbase";
// import Discord from "next-auth/providers/discord";
// import Dropbox from "next-auth/providers/dropbox";
// import Facebook from "next-auth/providers/facebook";
// import GitHub from "next-auth/providers/github";
// import GitLab from "next-auth/providers/gitlab";
// import Hubspot from "next-auth/providers/hubspot";
// import Keycloak from "next-auth/providers/keycloak";
// import LinkedIn from "next-auth/providers/linkedin";
// import MicrosoftEntraId from "next-auth/providers/microsoft-entra-id";
// import Netlify from "next-auth/providers/netlify";
// import Okta from "next-auth/providers/okta";
// import Passage from "next-auth/providers/passage";
// import Passkey from "next-auth/providers/passkey";
// import Pinterest from "next-auth/providers/pinterest";
// import Reddit from "next-auth/providers/reddit";
// import Slack from "next-auth/providers/slack";
// import Salesforce from "next-auth/providers/salesforce";
// import Spotify from "next-auth/providers/spotify";
// import Twitch from "next-auth/providers/twitch";
// import Twitter from "next-auth/providers/twitter";
// import Vipps from "next-auth/providers/vipps";
// import WorkOS from "next-auth/providers/workos";
// import Zoom from "next-auth/providers/zoom";
// import { createStorage } from "unstorage";
// import memoryDriver from "unstorage/drivers/memory";
// import vercelKVDriver from "unstorage/drivers/vercel-kv";
// import { UnstorageAdapter } from "@auth/unstorage-adapter";

// const storage = createStorage({
//     driver: process.env.VERCEL
//         ? vercelKVDriver({
//               url: process.env.AUTH_KV_REST_API_URL,
//               token: process.env.AUTH_KV_REST_API_TOKEN,
//               env: false,
//           })
//         : memoryDriver(),
// });
        // Apple,
        // Atlassian,
        // Auth0,
        // AzureB2C,
        // BankIDNorway,
        // BoxyHQSAML({
        //     clientId: "dummy",
        //     clientSecret: "dummy",
        //     issuer: process.env.AUTH_BOXYHQ_SAML_ISSUER,
        // }),
        // Cognito,
        // Coinbase,
        // Discord,
        // Dropbox,
        // Facebook,
        // GitHub,
        // GitLab,
        // Hubspot,
        // Keycloak({ name: "Keycloak (bob/bob)" }),
        // LinkedIn,
        // MicrosoftEntraId,
        // Netlify,
        // Okta,
        // Passkey({
        //     formFields: {
        //         email: {
        //             label: "Username",
        //             required: true,
        //             autocomplete: "username webauthn",
        //         },
        //     },
        // }),
        // Passage,
        // Pinterest,
        // Reddit,
        // Salesforce,
        // Slack,
        // Spotify,
        // Twitch,
        // Twitter,
        // Vipps({
        //     issuer: "https://apitest.vipps.no/access-management-1.0/access/",
        // }),
        // WorkOS({ connection: process.env.AUTH_WORKOS_CONNECTION! }),
        // Zoom,


    // adapter: UnstorageAdapter(storage),