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
  const [filterSettings, setFilterSettings] = useState({});

  const eventsFiltered = useMemo(() => {
    if (!events) return [];

    const startDateFilter = filterSettings.startDate;
    const endDateFilter = filterSettings.endDate;

    return events.filter((event) => {
      if (filterSettings.title && !event.event_name.includes(filterSettings.title)) {
        return false;
      }
      if (filterSettings.location && !event.location.includes(filterSettings.location)) {
        return false;
      }
      if (startDateFilter && new Date(Date.parse(event.startdate.replace(" ", "T"))) < new Date(startDateFilter)) {
        return false;
      }
      if (endDateFilter && new Date(Date.parse(event.startdate.replace(" ", "T"))) > new Date(endDateFilter)) {
        return false
      }
      return true;
    });
  }, [events, filterSettings]);

  return (
    <div className="flex-initial self-stretch w-[83.3%] mx-auto">
      <EventForm setFilterSettings={setFilterSettings} />
      <div className="relative flex flex-col items-start gap-4 m-2 mt-8">
        <div className="absolute top-0 right-0">
          <a
            className="mx-2 p-2 bg-mypurple hover:underline text-white rounded-md block"
            href="/events/me"
          >
            My Events
          </a>
        </div>
        {eventsFiltered?.map((event) => (
          <EventCard event={event} key={event.id} userId={userId} />
        ))}
      </div>
    </div>
  );
}
