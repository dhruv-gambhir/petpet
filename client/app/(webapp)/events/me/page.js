
import EventCard from '../EventCard';

const staticEvents = [
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


export default async function MyEventsPage() {
  const events = staticEvents;

  return (
    <div className='flex flex-col self-stretch'>
      <h1 className='text-2xl font-bold text-center py-4'>My Events</h1>

      <form className='flex flex-col p-4 gap-4 border border-mypurple m-4 rounded'>
        <label className='text-lg font-semibold'>Create an event</label>
        <div className='flex flex-row gap-8'>
          <input type='text' placeholder='Event Name' className='border border-gray-300 rounded-md p-2 flex-1' />
          <input type='date' placeholder='Date' className='border border-gray-300 rounded-md p-2 flex-1' />
          <input type='time' placeholder='Time' className='border border-gray-300 rounded-md p-2 flex-1' />
          <input type='text' placeholder='Location' className='border border-gray-300 rounded-md p-2 flex-1' />
        </div>
        <textarea type='text' placeholder='Description' className='border border-gray-300 rounded-md p-2 resize-none basis-32' />
        <button className='bg-mypurple text-white rounded-md p-2 self-center w-80'>Create</button>
      </form>

      <div className="relative flex flex-col items-start gap-4 m-2 mt-8">
        {events.map((event) => (
          <EventCard key={event.id} event={event} organizerView={true} />
        ))}
      </div>
    </div>
  )
}