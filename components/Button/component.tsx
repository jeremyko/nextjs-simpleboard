import Link from "next/link";

// export default function Button({ label = "", href }: { label?: string; href?: string }) {
//     return (
//         <Link href={href || "#"}>
//             <button className="cursor-pointer px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
//                 {label}
//             </button>
//         </Link>
//     );
// }

// import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    href?: string;
}

export default function Button({ children, className,href, ...rest }: ButtonProps) {
    return (
        <Link href={href || "#"}>
            <button
                {...rest}
                className="cursor-pointer px-4 py-2 bg-blue-700 text-gray-300 text-sm font-medium  rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                {children}
            </button>
        </Link>
    );
}
{
    /* className={clsx(
                "flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                className,
            )} */
}
