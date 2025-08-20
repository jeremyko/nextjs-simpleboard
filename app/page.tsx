import styles from "./Home.module.css";
import packageJson from "@/package.json"; 

// home page

export default function Home() {
    const appName = packageJson.name;
    const appVersion = packageJson.version;
    const dependencies = packageJson.dependencies;
    const devDependencies = packageJson.devDependencies;

    return (
        <div
            className={`w-full p-6 pl-10 h-screen bg-cover bg-center flex flex-col items-left justify-start  ${styles.body}`}
        >
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
