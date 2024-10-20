"use client";

import useSWR from "swr";
import EventCard from "../../events/EventCard.js";
import { fetcher } from "@/app/lib/fetcher.js";
import useStore from "@/app/store.js";

export default function EventsPage() {
  const userId = useStore((state) => state.zId);
  const { data: events } = useSWR(() => "event_interests/user/" + userId, fetcher);

  return (
    <>
      <h1 className="text-2xl font-bold text-center py-4">Events</h1>

      <div className="flex flex-col items-start gap-4 m-2 mt-8 self-stretch">
        {events?.map((event) => (
          <EventCard event={event} key={event.id} userId={userId} />
        ))}
      </div>
    </>
  );
}
