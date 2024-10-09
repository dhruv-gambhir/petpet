// JobsCard.js
import React from "react";
import InterestedButton from "@/app/Components/InterestedButton"; // Adjust the path if necessary

export default function JobsCard({ pet, isInterested, onInterestToggle }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row w-full max-w-3xl">
      {/* Pet Photo */}
      <div className="w-full md:w-1/4 mb-4 md:mb-0">
        <img
          className="object-cover w-full h-48 rounded-lg"
          src={pet.photo}
          alt={pet.petName}
        />
      </div>

      {/* Pet Details */}
      <div className="md:ml-6 flex-1">
        <h3 className="text-xl font-bold text-gray-800">{pet.petName}</h3>
        <p className="text-gray-600">
          <strong>Type:</strong> {pet.petType}
        </p>
        <p className="text-gray-600">
          <strong>Breed:</strong> {pet.breed}
        </p>
        <p className="text-gray-600">
          <strong>Age:</strong> {pet.age} years
        </p>
        <p className="text-gray-600">
          <strong>Location:</strong> {pet.location}
        </p>
        <p className="text-gray-600">
          <strong>Dates Needed:</strong> {pet.datesNeeded}
        </p>
        <p className="text-gray-600">
          <strong>Special Needs:</strong> {pet.specialNeeds}
        </p>
        <p className="text-gray-700 mt-2">{pet.description}</p>

        {/* Interested Button */}
        <div className="mt-4">
          <InterestedButton isInterested={isInterested} onClick={onInterestToggle} />
        </div>
      </div>
    </div>
  );
}

