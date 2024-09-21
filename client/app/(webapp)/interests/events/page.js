import EventCard from "../../events/EventCard.js";

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

export default function EventsPage() {
  const events = staticEvents;

  return (
    <>
      <h1 className="text-2xl font-bold text-center py-4">Events</h1>

      <div className="flex flex-col items-start gap-4 m-2 mt-8 self-stretch">
        {events.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>
    </>
  );
}
