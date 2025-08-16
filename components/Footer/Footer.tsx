import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
    return (
        <footer className="flex justify-center items-center  text-center p-4 bg-gray-800 text-zinc-300">
            <p>© 2025 Simple Board. All rights reserved.</p>
            <a href="https://x.com/_nickjohnston" className="pl-10 pt-1 text-xl font-bold mr-4" aria-label="twitter">
                <FontAwesomeIcon icon={faTwitter} aria-label="twitter" />
            </a>
        </footer>
    );
}
