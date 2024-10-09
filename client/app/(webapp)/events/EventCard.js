// EventCard.js
import React, { useState } from "react";
import InterestedButton from "../../Components/InterestedButton"; // Adjust the path if necessary

export default function EventCard({ event }) {
  const [isInterested, setIsInterested] = useState(false);

  const handleInterestClick = () => {
    setIsInterested(!isInterested);
    // Optional: Add functionality to save the user's interest in the event
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
      {/* Event Image */}
      <div className="md:w-1/3">
        <img
          className="object-cover w-full h-48 md:h-full"
          src={event.image}
          alt={event.name}
        />
      </div>

      {/* Event Details */}
      <div className="p-6 flex flex-col justify-between md:w-2/3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{event.name}</h2>
          <p className="text-gray-600 mt-2">
            <strong>Date:</strong> {event.date}
          </p>
          <p className="text-gray-600">
            <strong>Location:</strong> {event.location}
          </p>
          {/* Display Animal Type */}
          <p className="text-gray-600">
            <strong>Animal Type:</strong> {event.animalType}
          </p>
          <p className="text-gray-700 mt-4 line-clamp-3">
            {event.description}
          </p>
        </div>
        <div className="mt-4 flex items-center">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-4">
            Learn More
          </button>
          <InterestedButton isInterested={isInterested} onClick={handleInterestClick} />
        </div>
      </div>
    </div>
  );
}

