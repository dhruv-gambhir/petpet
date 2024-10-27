"use client";

import { usePathname, useRouter } from "next/navigation";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default function InterestsLayout({ children }) {
  const interests = ["adoption", "sitting", "events"];
  const router = useRouter();

  const pathname = usePathname();
  return (
    <div className="flex-initial flex flex-col self-stretch items-stretch">
      <h1 className="text-2xl font-bold text-center py-4">Interests</h1>
      <div className="flex flex-col items-center">
        <div className="flex flex-row gap-4 w-1/2 justify-around">
          {interests.map((interest) => (
            <div
              key={interest}
              className={`flex flex-col items-center gap-2 px-16 py-2 cursor-pointer ${pathname === `/interests/${interest}` ? "bg-purple-500" : "hover:bg-purple-300"} rounded-lg p-1`}
              onClick={() => router.push(`/interests/${interest}`)}
            >
              <p className="text-lg font-semibold">{capitalize(interest)}</p>
            </div>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}
