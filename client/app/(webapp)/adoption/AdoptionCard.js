// AdoptionCard.js
import React from "react";
import AdoptionTile from "./AdoptionTile";
import InterestedButton from "../../Components/InterestedButton";

export default function AdoptionCard({ detail, isOrganizer = false }) {
  return (
    <div className="relative bg-white rounded-lg max-w-3xl w-full mx-auto flex flex-col md:flex-row p-6 gap-6 shadow-lg">
      {/* Pet Image */}
      <div className="flex-none w-full md:w-1/3 relative">
        <img
          className="object-cover h-64 w-full rounded-lg"
          src={detail.photo}
          alt={detail.name}
        />
        <div className="absolute w-4/5 text-center bg-black bg-opacity-50 text-white px-2 py-1 rounded-lg shadow-md bottom-[-1rem] left-1/2 transform -translate-x-1/2">
          <p className="font-semibold">{detail.name}</p>
        </div>
      </div>

      {/* Pet Details */}
      <div className="flex-1 flex flex-col space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">{detail.agency}</h2>
        <div className="flex flex-row flex-wrap gap-4">
          <AdoptionTile content={detail.sex} label="Sex" />
          <AdoptionTile content={detail.color} label="Color" />
          <AdoptionTile content={detail.breed} label="Breed" />
          <AdoptionTile content={detail.weight} label="Weight" units="kg" />
          <AdoptionTile content={detail.age} label="Age" units="years" />
          <AdoptionTile content={detail.vaccinationStatus} label="Vaccination" />
          <AdoptionTile content={detail.type} label="Type" />
          <AdoptionTile
            content={detail.goodWithKids ? "Yes" : "No"}
            label="Good with Kids"
          />
        </div>
        <p className="text-gray-600 italic">{detail.location}</p>
        <p className="text-gray-700 line-clamp-4">{detail.description}</p>
      </div>

      {/* Action Button */}
      {isOrganizer ? (
        <div className="absolute top-4 right-4">
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Remove
          </button>
        </div>
      ) : (
        <div className="absolute top-4 right-4">
          <InterestedButton />
        </div>
      )}
    </div>
  );
}

