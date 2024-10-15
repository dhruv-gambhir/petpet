import Link from "next/link";
import Title from "./Title";

export default function NavBar() {
  return (
    <nav className="bg-white w-full h-40 flex-none flex flex-row items-center justify-center">
      <div className="flex flex-row justify-between w-full">
        <Title className="w-1/2 left-2" />
        <div className="w-1/2 h-full right-2 flex flex-row">
          <Link
            className="w-1/6 bg-gray-300 border-1 border-black rounded mx-8 py-8 justify-end text-center"
            href="/sitters/owner"
          >
            Sitters
          </Link>
          <Link
            className="w-1/6 bg-gray-300 border-1 border-black rounded mx-8 py-8 text-center"
            href="/events"
          >
            Events
          </Link>
          <Link
            className="w-1/6 bg-gray-300 border-1 border-black rounded mx-8 py-8 text-center"
            href="/adoption"
          >
            Adoption
          </Link>
          <Link
            className="w-1/6 bg-gray-300 border-1 border-black rounded mx-8 py-8 text-center"
            href="/profile"
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}
