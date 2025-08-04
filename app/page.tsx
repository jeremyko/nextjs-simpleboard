import styles from "./Home.module.css";

// home page

export default function Home() {
    return (
        <div className={`w-full h-screen bg-cover bg-center flex items-center justify-center bg-blue-500 ${styles.body}`}>
            <div className="text-4xl font-bold text-white">Home page</div>
        </div>
    );
}
