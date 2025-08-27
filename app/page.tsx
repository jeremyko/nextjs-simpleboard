// "use client"; //XXX test only XXX

// import { auth } from "@/auth";
// import styles from "./Home.module.css"; // 배경
import packageJson from "@/package.json"; 

// home page

// XXX test only XXX -------------------------------------------------------
// import { useEffect, useRef, useState } from "react";
// import { useSession } from "next-auth/react";
// XXX test only XXX -------------------------------------------------------

export default async function Home() {
    const appName = packageJson.name;
    const appVersion = packageJson.version;
    const dependencies = packageJson.dependencies;
    const devDependencies = packageJson.devDependencies;

    // XXX test only XXX -------------------------------------------------------
    // const { data: session, status } = useSession();
    // console.debug("session.expires_at  ==> ", session?.expires_at);
    // const session = await auth();
    // useEffect(() => {
    //     console.debug("session  ==> ", session);
    //     console.debug("status  ==> ", status);
    //     // if (status === "unauthenticated") {
    //     //     console.debug("세션 만료 또는 로그아웃됨 (클라이언트) ");
    //     //     router.push("/api/auth/signin"); // 로그인 페이지로 이동
    //     // }
    // }, [status]);
    // const [sessionAliveWarn, setSessionAliveWarn] = useState("");
    // useEffect(() => {
    //     if (!session?.expires_at) return;

    //     const checkTime = () => {
    //         if (session.expires_at) {
    //             const now = Date.now();
    //             const timeLeftSecs = session.expires_at - now / 1000;
    //             // console.debug("[home] session.expires_at =>", session.expires_at,"now =", now, "/ time left:", timeLeftSecs);

    //             // 5분 미만 남았고, 아직 경고 안 했을 때
    //             // if (timeLeft <= 5 * 60 * 1000 && !warnedRef.current) {
    //             //     warnedRef.current = true;
    //             // }
    //             // if (timeLeftSecs <= 1 * 60 ) {
    //             if (timeLeftSecs > 0) {
    //                 setSessionAliveWarn(`세션이 곧 만료됩니다: ${timeLeftSecs}`);
    //             }

    //             // 세션이 완전히 만료되면 로그인 페이지로 이동
    //             if (timeLeftSecs <= 0) {
    //                 setSessionAliveWarn("세션 만료됨");
    //             }
    //         }
    //     };
    //     const intervalId = setInterval(checkTime, 1 * 1000);
    //     return () => clearInterval(intervalId);
    // }, [session?.expires_at]);
    // XXX test only XXX -------------------------------------------------------

    return (
        <div
            // className={`w-full p-6 pl-10 h-screen bg-cover bg-center flex flex-col items-left justify-start  ${styles.body}`}
            className={`w-full p-2 pl-4 sm:p-4 sm:pl-8  h-screen flex flex-col items-left justify-start`}
        >
            {/* XXX test only XXX */}
            {/* <p className="text-red-700 text-bold text-xl" > {sessionAliveWarn}</p> */}

            <h1 className="text-bold text-lg">{appName}</h1>
            <p className="text-bold">버전: {appVersion}</p>

            <p className="text-bold text-lg pt-2">dependencies: </p>
            <div className="text-xs text-light">
                {Object.entries(dependencies).map(([key, value]) => (
                    <li className="pl-4" key={key}>
                        {key}:{value}
                    </li>
                ))}
            </div>

            <p className="text-bold text-lg pt-2">devDependencies</p>
            <div className="text-xs text-light ">
                {Object.entries(devDependencies).map(([key, value]) => (
                    <li className="pl-4" key={key}>
                        {key}: {value}
                    </li>
                ))}
            </div>
        </div>
    );
}
