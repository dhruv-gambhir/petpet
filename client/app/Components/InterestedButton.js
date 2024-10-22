"use client";
import { useState } from "react";

/**
 * 
 * @param {React.ComponentPropsWithRef<'button'> & {
 *  isInterested?: boolean,
 *  onInterested?: () => Promise<void>,
 *  onNotInterested?: () => Promise<void>,
 * }} props 
 * @returns 
 */
export default function InterestedButton(props) {
  const { isInterested, onInterested, onNotInterested, ...rest } = props;
  const [pressed, setPressed] = useState(isInterested ?? false);

  const togglePressed = async () => {
    try {
      if (pressed) {
        await onNotInterested?.();
      } else {
        await onInterested?.();
      }
    } catch (e) {
      console.error(e);
    }
    setPressed(!pressed);
  };

  return (
    <button
      className="border border-black rounded px-2 py-1 flex items-center"
      {...rest}
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

