import EventCard from "../EventCard";
import EventCreationForm from "./EventCreationForm";

const staticEvents = [
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
// need query by user id
export default async function MyEventsPage() {
  const events = staticEvents;

  return (
    <div className='flex flex-col self-stretch w-[83.3%] mx-auto'>
      <h1 className='text-2xl font-bold text-center py-4'>My Events</h1>

      <EventCreationForm />

      <div className="relative flex flex-col items-start gap-4 m-2 mt-8">
        {events.map((event) => (
          <EventCard key={event.id} event={event} organizerView={true} />
        ))}
      </div>
    </div>
  );
}
