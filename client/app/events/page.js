import { redirect, RedirectType } from 'next/navigation';
import EventCard from './EventCard';
import EventForm from './EventSearchForm';

const staticEvents = [
  {
    id: 1,
    name: 'Event 1',
    date: '2021-01-01',
    time: '3:00 PM',
    location: 'Location 1',
    description: 'This is the first event.',
    coordinator: 'Coordinator 1',
    dogPhoto: 'https://images.dog.ceo/breeds/pyrenees/n02111500_5225.jpg',
  },
  {
    id: 2,
    name: 'Event 2',
    date: '2021-02-02',
    time: '3:00 PM',
    location: 'Location 2',
    description: `abcd.`,
    coordinator: 'Coordinator 1',
    dogPhoto: 'https://images.dog.ceo/breeds/pyrenees/n02111500_5225.jpg',
  },
  {
    id: 3,
    name: 'Event 3',
    date: '2021-03-03',
    time: '3:00 PM',
    location: 'Location 3',
    description: 'This is the first event.',
    coordinator: 'Coordinator 1',
    dogPhoto: 'https://images.dog.ceo/breeds/pyrenees/n02111500_5225.jpg',
  },
];



export default async function EventsPage( { searchParams } ) {
  // This is to mimic db call.
  // const events = await new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(staticEvents);
  //   }, 1000);
  // });

  const events = staticEvents;

  async function updateSearchParams(formData) {
    "use server";

    const params = new URLSearchParams();

    for (const key of ['title', 'location', 'animalType', 'startDate', 'endDate']) {
      const value = formData.get(key);
      if (value)
        params.set(key, value);
    }

    redirect(`events?${params.toString()}`, RedirectType.replace);
  }

  return (
    <div>
      <EventForm updateSearchParams={updateSearchParams} searchParams={searchParams} />
      <div className="relative flex flex-col items-start gap-4 m-2 mt-8">
        <div className='absolute top-2 right-10 z-50'>
          <a className='bg-mypurple rounded text-white border border-black hover:underline p-2 px-20' href='/events/me'>
            View My Events
          </a>
        </div>
        {events.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>
    </div>
  )
}