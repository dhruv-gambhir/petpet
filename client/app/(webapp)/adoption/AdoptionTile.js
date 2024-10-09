import React from "react";

const AdoptionTile = ({ label, content, units }) => {
  if (!content) return null;
  return (
    <div className="bg-gray-100 border w-24 h-24 flex flex-col justify-center items-center rounded-lg shadow-sm">
      <p className="text-indigo-600 font-semibold text-lg">
        {content} {units ?? ""}
      </p>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
};

export default AdoptionTile;

