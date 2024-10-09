"use client"
import React from "react";
import { useState } from "react";
import AdoptionCard from "./AdoptionCard";

const commonAnimals = ["🐱 Cat", "🐶 Dog", "🐢 Turtle", "🐹 Hamster", "🐰 Rabbit"];

const staticAdoptionData = [
  {
    name: "Lulia",
    sex: "Female",
    color: "Brown",
    breed: "Corgi",
    weight: 20,
    age: 3,
    type: "dog",
    vaccinationStatus: "Yes",
    goodWithKids: true,
    agency: "Good Boy Agency",
    location: "Bukit Batok",
    description: "Lulia is a friendly dog looking for a loving home.",
    photo: "/d3.jpeg",
  },
  {
    name: "Buddy",
    sex: "Male",
    color: "Black",
    breed: "Beagle",
    weight: 30,
    age: 4,
    type: "dog",
    vaccinationStatus: "Yes",
    goodWithKids: true,
    agency: "Happy Paws Shelter",
    location: "Jurong East",
    description: "Buddy loves to play fetch and is great with kids.",
    photo: "/d1.jpeg",
  },
  {
    name: "Luna",
    sex: "Female",
    color: "White",
    breed: "Pug",
    weight: 22,
    age: 2,
    type: "dog",
    vaccinationStatus: "Yes",
    goodWithKids: true,
    agency: "Happy Paws Shelter",
    location: "Ang Mo Kio",
    description: "Luna is a fluffy ball of joy who loves cuddles.",
    photo: "/d2.jpeg",
  },
  // Add more pet entries as needed
];

export default function AdoptionPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAnimals, setFilteredAnimals] = useState([]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter adoption data based on search query
  const filteredAdoptionData = staticAdoptionData.filter((pet) => {
    const query = searchQuery.toLowerCase();
    return (
      pet.name.toLowerCase().includes(query) ||
      pet.breed.toLowerCase().includes(query) ||
      pet.color.toLowerCase().includes(query) ||
      pet.location.toLowerCase().includes(query) ||
      pet.type.toLowerCase().includes(query) ||
      pet.description.toLowerCase().includes(query)
    );
  });

  // Handle common animal buttons click
  const handleAnimalFilter = (animal) => {
    const animalType = animal.split(" ")[1].toLowerCase();
    setSearchQuery(animalType);
  };

  return (
    <div className="flex-initial self-stretch w-5/6 mx-auto">
      {/* Search Bar */}
      <form className="flex items-center m-6 h-12" onSubmit={(e) => e.preventDefault()}>
        <input
          className="flex-1 mr-4 px-4 py-2 border border-gray-300 rounded-md"
          type="text"
          placeholder="Search for pets..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="flex gap-2">
          {commonAnimals.map((animal, index) => (
            <button
              key={index}
              className="px-3 py-1 rounded bg-white shadow-sm border border-gray-300 hover:bg-gray-100"
              onClick={() => handleAnimalFilter(animal)}
            >
              {animal}
            </button>
          ))}
        </div>
      </form>

      {/* Adoption Cards */}
      <div className="flex flex-col items-start gap-8 m-6 mt-8">
        {filteredAdoptionData.length > 0 ? (
          filteredAdoptionData.map((detail, index) => (
            <AdoptionCard detail={detail} key={index} />
          ))
        ) : (
          <p className="text-xl text-gray-600">No pets found matching your search.</p>
        )}
      </div>
    </div>
  );
}

