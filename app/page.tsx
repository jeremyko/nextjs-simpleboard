import packageJson from "@/package.json"; 

// home page

export default async function Home() {
    const appName = packageJson.name;
    const appVersion = packageJson.version;
    const dependencies = packageJson.dependencies;
    const devDependencies = packageJson.devDependencies;

    return (
        <div
            className={`w-full p-2 pl-4  sm:p-4 sm:pl-8   flex flex-col items-left justify-start`}
        >
            <p className="text-lg mt-4"> 
                <span className="border  p-1 rounded">Next.js</span>
                +
                <span className="border  p-1 rounded">Auth.js</span>
                로 만든 게시판 예제</p>

            <p className="text-bold mt-4 ">버전: {appVersion}</p>

            <p className="text-lg pt-2">dependencies: </p>
            <div className="text-xs text-light">
                {Object.entries(dependencies).map(([key, value]) => (
                    <li className="pl-4" key={key}>
                        {key}:{value}
                    </li>
                ))}
            </div>

            <p className="text-lg pt-2">devDependencies</p>
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
