'use client'

// XXX 서버 컴퍼넌트로 만들어서 const session = await auth(); 이렇게 사용하면
// 정상적으로 signOut 처리됨.
// 그러나, client 컴퍼넌트로 변경하면 정상처리가 안됨. 
// - 로그아웃해도 UserButton 이 변경이 안됨. 에러 
// - signOut 을 해도 UserButton 에서 useSessin 이용해서 session 을 가져오면
//   이전 old session 값을 보여줌..  ==> null 이 정상임 
// ==> 해결한 방법 
// components\SignOut\SignOut.tsx 에서 signOut 을 다음으로 변경하니 정상 처리되었다.
//     import { signOut } from "next-auth/react";  
// "@/auth" 에서 가져온 signOut 은 제대로 처리되지 않았다. 

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SignIn } from "@/components/SignIn/SignIn";
import { SignOut } from "@/components/SignOut/SignOut";
// import { auth } from "@/auth";
import { useSession  } from "next-auth/react";

// export default async function UserButton() {
export default function UserButton() {
    // const session = await auth();
    const { data: session, status  } = useSession();  // jwt callback 이 실행된다 !!!

    // console.log("UserButton render, status:",status);
    // console.log("UserButton render, session:", session);

    // getSession 을 주기적으로 호출해서, jwt 콜백을 실행시켜, token refresh 하게 .
    // XXX 이것 때문에 use client 가 필요했다. XXX
    // useEffect(() => {
    //     const interval = setInterval(
    //         () => {
    //             getSession(); // 호출할 때마다 jwt 콜백 → refresh 동작
    //         },
    //         1 * 60 * 1000,
    //     ); // 15분마다 호출 (access_token 만료 전에 refresh)
    //     return () => clearInterval(interval);
    // }, []);

    //XXX 이게 useEffect 앞에 있으면 에러 :
    // React has detected a change in the order of Hooks called by
    if (!session?.user) {
        return <SignIn />;
    }

    return (
        <div className="flex items-center gap-2">
            <span className="hidden text-sm sm:inline-flex">{session.user.email}</span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src={
                                    session.user.image ??
                                    `https://api.dicebear.com/9.x/thumbs/svg?seed=${Math.floor(Math.random() * 100000) + 1}&randomizeIds=true`
                                }
                                alt={session.user.name ?? ""}
                            />
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{session.user.name}</p>
                            <p className="text-muted-foreground text-xs leading-none">{session.user.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuItem>
                        <SignOut />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
