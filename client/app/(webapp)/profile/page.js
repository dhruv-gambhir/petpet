// ProfilePage.js
"use client";
import React from "react";

export default function ProfilePage() {
  // Owner Data
  const ownerInfo = {
    ownerId: 1,
    name: "Dhruv",
    email: "dhruv@gmail.com",
    phone: "8123-4567",
    location: "Bukit Batok",
    profilePhoto: "/p1.png",
  };

  // Pets Data
  const petsData = [
    {
      petId: 1,
      petName: "Bella",
      petType: "Dog",
      breed: "Labrador Retriever",
      age: 3,
      specialNeeds: "Needs medication twice a day",
      description: "Bella is a friendly Labrador who loves to play fetch.",
      petPhoto: "/d1.jpeg",
    },
    {
      petId: 2,
      petName: "Whiskers",
      petType: "Cat",
      breed: "Persian",
      age: 2,
      specialNeeds: "Shy, prefers quiet environments",
      description: "Whiskers is a calm Persian cat who enjoys quiet company.",
      petPhoto: "/c2.jpeg",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <section className="mb-8">
        <h1 className="text-4xl font-bold text-center">Owner Profile</h1>
      </section>

      {/* Main Content */}
      <div className="flex flex-row">
        {/* Owner Information */}
        <section className="w-1/3 pr-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
            {/* Profile Photo */}
            <div className="w-full h-64 overflow-hidden">
              <img
                className="object-cover w-full h-full"
                src={ownerInfo.profilePhoto}
                alt={ownerInfo.name}
              />
            </div>

            {/* Owner Details */}
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800">{ownerInfo.name}</h2>
              <p className="text-gray-600">
                <strong>Email:</strong> {ownerInfo.email}
              </p>
              <p className="text-gray-600">
                <strong>Phone:</strong> {ownerInfo.phone}
              </p>
              <p className="text-gray-600">
                <strong>Location:</strong> {ownerInfo.location}
              </p>
            </div>
          </div>
        </section>

        {/* Pets List */}
        <section className="w-2/3 pl-4">
          <h2 className="text-3xl font-semibold text-left mb-6">My Pets</h2>
          <div className="grid grid-cols-2 gap-6">
            {petsData.map((pet) => (
              <div
                key={pet.petId}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
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
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

