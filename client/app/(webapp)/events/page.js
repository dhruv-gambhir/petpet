import EventCard from "./EventCard";
import { getEvents, unpacker } from "./events";

export default async function EventsPage() {
  const events = await unpacker(() => getEvents());

  return (
    <div className="flex-initial self-stretch w-[83.3%] mx-auto">
      <form className="flex m-4 h-8">
        <input
          className="flex-1 mr-2 w-[40rem] px-2"
          type="text"
          placeholder="Pet Events"
        />
        <div className="flex gap-2">
          <input className="px-2" type="text" placeholder="Location" />
          <input className="px-2" type="text" placeholder="Animal Type" />
          <input className="px-2" type="date" />
        </div>
      </form>
      <div className="relative flex flex-col items-start gap-4 m-2 mt-8">
        <div className="absolute top-0 right-0">
          <a
            className="mx-2 p-2 bg-mypurple hover:underline text-white rounded-md block"
            href="/events/me"
          >
            My Events
          </a>
        </div>
        {events?.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>
    </div>
  );
}
