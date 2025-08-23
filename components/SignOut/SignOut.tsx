"use client";

import { signOut } from "next-auth/react"; // this works !!!
import { Button } from "@/components/ui/button";

// XXX signOut 을 "@/auth" 을 사용하면 정상 로그아웃이 안됨..
// next-auth/react 것 (client only)을 사용해야 정상 처리됨.. 왜그럴까..
async function actionSignOut() {
    await signOut();
}

export function SignOut(props: React.ComponentPropsWithRef<typeof Button>) {
    return (
        <form action={actionSignOut} className="w-full">
            <Button variant="ghost" className="w-full p-0" {...props}>
                Sign Out
            </Button>
        </form>
    );
}
