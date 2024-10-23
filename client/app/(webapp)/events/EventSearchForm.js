"use client";

import { useRef, useState } from "react";

const FancyInput = (props) => {
  const placeholder = props.placeholder;
  const [showPlaceholder, setShowPlaceholder] = useState(
    props.defaultValue !== "" && props.defaultValue !== undefined,
  );

  const { onChange: externalOnChange, ...rest } = props;

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
    externalOnChange(e);
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

export default function EventForm({ setFilterSettings }) {
  const onChangeWrapper = (e) => {
    setFilterSettings((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  return (
    <form className="flex mt-8 m-4 h-8">
      <FancyInput
        name="title"
        className="flex-1 mr-2 w-[40rem] px-2"
        type="text"
        placeholder="Pet Events"
        onChange={onChangeWrapper}
      />
      <div className="flex gap-2">
        <FancyInput
          name="location"
          className="px-2"
          type="text"
          placeholder="Location"
          onChange={onChangeWrapper}
        />
        {/* <FancyInput
          name="animalType"
          className="px-2"
          type="text"
          placeholder="Animal Type"
          onChange={onChangeWrapper}
        /> */}
        <FancyInput
          name="startDate"
          className="px-2"
          type="date"
          placeholder="Start Date"
          onChange={onChangeWrapper}
        />
        <FancyInput
          name="endDate"
          className="px-2"
          type="date"
          placeholder="End Date"
          onChange={onChangeWrapper}
        />
      </div>
    </form>
  );
}
