"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function SubmitButton({className, desc, pendingDesc, }: {className?: string, desc?: string, pendingDesc?: string,}) {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className={className}
        >
            {pending ? pendingDesc : desc}
        </Button>
    );
}
