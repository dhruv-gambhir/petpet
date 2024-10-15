"use client";

import Title from "./Title";

export default function NavBar() {
  return (
    <main className="bg-white w-full h-40 flex-none flex flex-row items-center justify-center">
      <div className="flex flex-row justify-between w-full">
        <Title className="w-1/2 left-2" />
      </div>
    </main>
  );
}
