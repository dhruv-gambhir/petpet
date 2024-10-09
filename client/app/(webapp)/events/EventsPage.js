// EventsPage.js
//
"use client"
import React, { useState } from "react";
import EventCard from "./EventCard";
import { petEvents } from "./data";

const commonAnimals = ["🐱 Cat", "🐶 Dog", "🐢 Turtle", "🐹 Hamster", "🐰 Rabbit"];

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnimalType, setSelectedAnimalType] = useState("");
  const [interestedEvents, setInterestedEvents] = useState([]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Optionally reset animal type filter
    // setSelectedAnimalType("");
  };

  // Handle animal type filter
  const handleAnimalFilter = (animal) => {
    const animalType = animal.split(" ")[1]; // Extract the animal type
    if (selectedAnimalType === animalType) {
      setSelectedAnimalType(""); // Deselect if already selected
    } else {
      setSelectedAnimalType(animalType);
    }
  };

  // Handle interest toggle
  const handleInterestToggle = (eventId) => {
    setInterestedEvents((prevState) => {
      if (prevState.includes(eventId)) {
        return prevState.filter((id) => id !== eventId);
      } else {
        return [...prevState, eventId];
      }
    });
  };

  // Filter events based on search query and selected animal type
  const filteredEvents = petEvents.filter((event) => {
    const query = searchQuery.toLowerCase();
    const matchesSearchQuery =
      event.name.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query);

    const matchesAnimalType =
      selectedAnimalType === "" ||
      event.animalType.toLowerCase() === selectedAnimalType.toLowerCase();

    return matchesSearchQuery && matchesAnimalType;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Upcoming Pet Events</h1>

      {/* Search Bar */}
      <form
        className="flex items-center mb-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          className="flex-1 mr-4 px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Search for events..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="flex gap-2">
          {commonAnimals.map((animal, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded bg-white shadow-sm border border-gray-300 hover:bg-gray-100 ${
                selectedAnimalType === animal.split(" ")[1]
                  ? "bg-blue-500 text-white"
                  : ""
              }`}
              onClick={() => handleAnimalFilter(animal)}
            >
              {animal}
            </button>
          ))}
        </div>
      </form>

      {/* Events List */}
      <div className="space-y-8">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isInterested={interestedEvents.includes(event.id)}
              onInterestToggle={() => handleInterestToggle(event.id)}
            />
          ))
        ) : (
          <p className="text-xl text-gray-600">
            No events found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}

