import InterestedButton from "@/app/Components/InterestedButton";
import { registerInterestInEvent, unregisterInterestInEvent } from "./events";

/**
 *
 * @param {{
 *    event: import("./events").Event,
 *    organizerView?: boolean,
 *    userId: string
 * }} param0
 * @returns
 */
export default function EventCard({ event, organizerView, userId }) {
  const isOrganizer = organizerView ?? false;

  return (
    <div className="w-5/6 p-4">
      <div className="relative bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
        {/* Event Image Section */}
        <div className="flex-none w-full md:w-64 h-64 relative">
          <img
            className="object-cover object-center w-full h-full"
            src={event.imageurl}
            alt={event.name}
          />
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white px-4 py-2">
            <p className="text-sm font-semibold">{event.name}</p>
          </div>
        </div>

        {/* Event Details Section */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold mb-2">{event.event_name}</h2>
            <p className="text-gray-700 line-clamp-6">{event.description}</p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <p className="bg-gray-200 px-2 py-1 rounded text-sm">
              {new Date(Date.parse(event.startdate)).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
            <p className="bg-gray-200 px-2 py-1 rounded text-sm">
              {new Date(Date.parse(event.startdate)).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
              })}
            </p>
            <p className="bg-gray-200 px-2 py-1 rounded text-sm">{event.location}</p>
          </div>
        </div>

        {/* Interested Button or Organizer Controls */}
        {!isOrganizer && (
          <div className="absolute top-2 right-2">
            <InterestedButton
              isInterested={event.interested}
              onInterested={() => registerInterestInEvent(event.id, userId)}
              onNotInterested={() => unregisterInterestInEvent(event.id, userId)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

