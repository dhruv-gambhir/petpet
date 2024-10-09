"use client";

import useSWR from "swr";
import EventCard from "../EventCard";
import { getEventsBy } from "../events";
import EventCreationForm from "./EventCreationForm";

export default function MyEventsPage() {
  const userId = "a2b88379-aa4e-420b-a442-1bbeea9bb7f6";

  const { data: events, isLoading } = useSWR(["events/user", userId], ([_, args]) => getEventsBy(args));

  return (
    <div className='flex flex-col self-stretch w-[83.3%] mx-auto'>
      <h1 className='text-2xl font-bold text-center py-4'>My Events</h1>

      <EventCreationForm />

      <div className="relative flex flex-col items-start gap-4 m-2 mt-8">
        {events?.map((event) => (
          <EventCard key={event.id} event={event} organizerView={true} />
        ))}
      </div>
    </div>
  );
}
