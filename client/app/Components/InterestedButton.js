"use client";
import { useState } from "react";

export default function InterestedButton() {
  const [pressed, setPressed] = useState(false);

  const togglePressed = () => {
    setPressed(!pressed);
  };

  return (
    <button
      className="border border-black rounded px-2 py-1 flex items-center"
      onClick={togglePressed}
    >
      <p className="text-black mr-2">Interested</p>
      {pressed ? (
        <img className="w-4 h-4" src="/heart_fill.png" alt="Heart filled" />
      ) : (
        <img className="w-4 h-4" src="/heart.png" alt="Heart" />
      )}
    </button>
  );
}

