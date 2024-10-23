"use client";

import useStore from "@/app/store";
import InterestedButton from "../../Components/InterestedButton";
import {
  registerInterestInAdoption,
  unregisterInterestInAdoption,
} from "./adoptions";

const AdoptionTile = ({ label, content, units }) => {
  return (
    content && (
      <div className="bg-white border w-24 h-24 flex flex-col justify-center items-center rounded-lg shadow-sm">
        <p 
          className="text-mypurple text-base font-semibold truncate text-center break-words overflow-hidden"
          style={{ wordWrap: "break-word", maxWidth: "100%" }}
        >
          {content} {units ?? ""}
        </p>
        <span className="text-xs text-gray-600 text-center">{label}</span>
      </div>
    )
  );
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default function AdoptionCard({ detail, isOrganizer }) {
  const userId = useStore((state) => state.zId);

  isOrganizer = isOrganizer ?? false;

  return (
    <div className="w-2/3 mx-auto p-4">
      <div className="relative bg-white rounded-lg shadow-md overflow-hidden flex flex-row">
        <div className="flex-none w-64 h-64 relative">
          <img
            className="object-cover object-center w-full h-full"
            src={detail.pet?.imageurl}
            alt={detail.pet?.name}
          />
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white px-4 py-2">
            <p className="text-sm font-semibold">{detail.pet?.name}</p>
          </div>
        </div>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">{detail.pet?.name}</h2>
            <div className="flex flex-row gap-4 my-4">
              <AdoptionTile
                content={detail.pet?.sex && capitalize(detail.pet?.sex)}
                label="Sex"
              />
              <AdoptionTile content={detail.pet?.color} label="Color" />
              <AdoptionTile content={detail.pet?.species} label="Breed" />
              <AdoptionTile
                content={detail.pet?.weight}
                label="Weight"
                units="kg"
              />
            </div>
            <p className="text-gray-700 mb-4">{detail.location}</p>
            <p className="text-gray-700 line-clamp-4">{detail.description}</p>
          </div>
        </div>
        <div className="absolute top-2 right-2">
          {isOrganizer ? (
            <button className="p-2 font-bold hover:underline">Remove</button>
          ) : (
            <InterestedButton
              isInterested={detail.interested}
              onInterested={() => registerInterestInAdoption(detail.id, userId)}
              onNotInterested={() =>
                unregisterInterestInAdoption(detail.id, userId)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

