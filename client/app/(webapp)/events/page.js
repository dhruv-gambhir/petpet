import EventCard from "./EventCard";
import { getEvents, unpacker } from "./events";

const staticEvents = [
  {
    id: 1,
    name: "Event 1",
    date: "2021-01-01",
    time: "3:00 PM",
    location: "Location 1",
    description: "This is the first event.",
    coordinator: "Coordinator 1",
    dogPhoto: "https://images.dog.ceo/breeds/pyrenees/n02111500_5225.jpg",
  },
  {
    id: 2,
    name: "Event 2",
    date: "2021-02-02",
    time: "3:00 PM",
    location: "Location 2",
    description: `abcd.`,
    coordinator: "Coordinator 1",
    dogPhoto: "https://images.dog.ceo/breeds/pyrenees/n02111500_5225.jpg",
  },
  {
    id: 3,
    name: "Event 3",
    date: "2021-03-03",
    time: "3:00 PM",
    location: "Location 3",
    description: "This is the first event.",
    coordinator: "Coordinator 1",
    dogPhoto: "https://images.dog.ceo/breeds/pyrenees/n02111500_5225.jpg",
  },
];

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
