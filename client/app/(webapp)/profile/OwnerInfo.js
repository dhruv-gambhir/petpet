// PetCard.js
import React from "react";

export default function PetCard({ pet }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Pet Photo */}
      <div className="w-full h-48 overflow-hidden">
        <img
          className="object-cover w-full h-full"
          src={pet.petPhoto}
          alt={pet.petName}
        />
      </div>

      {/* Pet Details */}
      <div className="p-6">
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
          <strong>Special Needs:</strong> {pet.specialNeeds}
        </p>
        <p className="text-gray-700 mt-2">{pet.description}</p>
      </div>
    </div>
  );
}

