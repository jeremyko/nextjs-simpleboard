"use client";

import { Button } from "../ui/button";
import { signIn } from "next-auth/react";

async function actionSignIn(provider?: string) {
    await signIn(provider);
}

export function SignIn({
    provider,
    ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
    const action = actionSignIn.bind(null, provider);
    return (
        <form action={action}>
            <Button {...props}>Sign In</Button>
        </form>
    );
}
