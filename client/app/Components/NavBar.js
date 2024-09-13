import Title from "./Title";
import { useRouter } from "next/navigation";

export default function NavBar() {
    const router = useRouter();

    return (
        <main className="bg-white w-full h-1/6 flex flex-row items-center justify-center">
            <div className="flex flex-row justify-between">
                <Title className="w-1/2 left-2" />
                <div className="w-1/2 right-2 flex flex-row">
                    <button
                        className="bg-gray-300 border-1 border-black rounded mx-16 justify-end"
                        onClick={() => {
                            router.push("./sitters");
                        }}
                    >
                        Sitters
                    </button>
                    <button
                        className="bg-gray-300 border-1 border-black rounded mx-16"
                        onClick={() => {
                            router.push("./events");
                        }}
                    >
                        Events
                    </button>
                    <button
                        className="bg-gray-300 border-1 border-black rounded mx-16"
                        onClick={() => {
                            router.push("./adoption");
                        }}
                    >
                        Adoption
                    </button>
                    <button
                        className="bg-gray-300 border-1 border-black rounded mx-16"
                        onClick={() => {
                            router.push("./profile");
                        }}
                    >
                        Profile
                    </button>
                </div>
            </div>
        </main>
    );
}
