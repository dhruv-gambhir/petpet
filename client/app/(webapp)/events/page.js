"use client";

import useSWR from "swr";
import EventCard from "./EventCard";
import { getEvents } from "./events";
import useStore from "@/app/store";
import EventForm from "./EventSearchForm";
import { useMemo, useState } from "react";

export default function EventsPage() {
  const userId = useStore((state) => state.zId);
  const { data: events, isLoading } = useSWR(["events", userId], getEvents);

  const [filterSettings, setFilterSettings] = useState({
    title: "",
    location: "",
    startDate: "",
    endDate: "",
  });

  const eventsFiltered = useMemo(() => {
    if (!events) return [];

    const { title, location, startDate, endDate } = filterSettings;

    const lowerCaseTitle = title.trim().toLowerCase();
    const lowerCaseLocation = location.trim().toLowerCase();

    return events.filter((event) => {
      const eventName = event.event_name ? event.event_name.toLowerCase() : "";
      const eventLocation = event.location ? event.location.toLowerCase() : "";

      if (lowerCaseTitle && !eventName.includes(lowerCaseTitle)) {
        return false;
      }

      if (lowerCaseLocation && !eventLocation.includes(lowerCaseLocation)) {
        return false;
      }

      if (
        startDate &&
        new Date(Date.parse(event.startdate.replace(" ", "T"))) < new Date(startDate)
      ) {
        return false;
      }

      if (
        endDate &&
        new Date(Date.parse(event.startdate.replace(" ", "T"))) > new Date(endDate)
      ) {
        return false;
      }

      return true;
    });
  }, [events, filterSettings]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-shrink-0 p-4 w-[83.3%] mx-auto">
        <div className="flex justify-between items-center">
          <EventForm setFilterSettings={setFilterSettings} />
          <a
            className="p-2 w-64 bg-mybutton hover:underline text-center text-black rounded-md"
            href="/events/me"
          >
            My Events
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto items-center" style={{ maxHeight: "calc(100vh - 310px)" }}>
        <div className="flex flex-col items-start gap-4 w-[83.3%] mx-auto p-2">
          {isLoading && <p>Loading events...</p>}

          {eventsFiltered?.length > 0 ? (
            eventsFiltered.map((event) => (
              <EventCard event={event} key={event.id} userId={userId} />
            ))
          ) : (
            <p>No events found matching your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
}

