import Link from "next/link";

export default function Button({
    label = "",
    href,
}: {
    label?: string;
    href?: string;
}) {
    return (
        <Link href={href || "#"}>
            <button className="cursor-pointer px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
                {label}
            </button>
        </Link>
    );
}