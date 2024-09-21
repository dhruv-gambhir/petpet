"use client";

import { useRef, useState } from "react";

const FancyInput = (props) => {
  const placeholder = props.placeholder;
  const [showPlaceholder, setShowPlaceholder] = useState(
    props.defaultValue !== "" && props.defaultValue !== undefined,
  );

  const onChange = (e) => {
    const hasValue = e.target.value !== "";
    setShowPlaceholder((shouldShowPlaceholder) => {
      if (shouldShowPlaceholder && !hasValue) {
        return false;
      } else if (!shouldShowPlaceholder && hasValue) {
        return true;
      }
      return shouldShowPlaceholder;
    });
  };

  return (
    <div className="flex-1 flex relative">
      <label
        className={`${showPlaceholder ? "" : "hidden"} absolute top-[-1.5rem] left-0`}
      >
        {placeholder}
      </label>
      <input {...props} onChange={onChange} />
    </div>
  );
};

export default function EventForm({ updateSearchParams, searchParams }) {
  const ref = useRef(null);

  return (
    <form className="flex mt-8 m-4 h-8" action={updateSearchParams} ref={ref}>
      <FancyInput
        name="title"
        className="flex-1 mr-2 w-[40rem] px-2"
        type="text"
        placeholder="Pet Events"
        defaultValue={searchParams["title"]}
      />
      <div className="flex gap-2">
        <FancyInput
          name="location"
          className="px-2"
          type="text"
          placeholder="Location"
          defaultValue={searchParams["location"]}
        />
        <FancyInput
          name="animalType"
          className="px-2"
          type="text"
          placeholder="Animal Type"
          defaultValue={searchParams["animalType"]}
        />
        <FancyInput
          name="startDate"
          className="px-2"
          type="date"
          placeholder="Start Date"
          defaultValue={searchParams["startDate"]}
        />
        <FancyInput
          name="endDate"
          className="px-2"
          type="date"
          placeholder="End Date"
          defaultValue={searchParams["endDate"]}
        />
        <button
          type="submit"
          className="px-2 bg-white border border-black hover:underline"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
