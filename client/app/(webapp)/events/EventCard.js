
/**
 * 
 * @param {{
 *    event: import("./events").Event,
 *    organizerView?: boolean
 * }} param0
 * @returns 
 */
export default function EventCard({ event, organizerView }) {
  const isOrganizer = organizerView ?? false;

  return (
    <div className="relative bg-white rounded w-4/5 h-80 ml-8 flex flex-row p-3 gap-8 shadow-sm shadow-black">
      <div className="flex-none w-60 relative">
        <img
          className="object-scale-down mx-auto h-full aspect-auto"
          src={event.dogPhoto}
          alt="A dog photo."
        />
        <div className="absolute w-4/5 text-center bg-gray-300 px-2 py-1 rounded z-50 text-nowrap shadow-sm shadow-black bottom-[-1rem] left-[50%] translate-x-[-50%]">
          <p>{event.coordinator}</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg">{event.name}</h2>
          <p className="line-clamp-[8]">{event.description}</p>
        </div>
        <div className="flex flex-row gap-4">
          <p className="bg-gray-300 px-2 py-1 rounded text-nowrap">
            {event.date}
          </p>
          <p className="bg-gray-300 px-2 py-1 rounded text-nowrap">
            {event.time}
          </p>
          <p className="bg-gray-300 px-2 py-1 rounded text-nowrap">
            {event.location}
          </p>
        </div>
      </div>
      {isOrganizer ? (
        <div className="absolute top-2 right-2 bg-white">
          <button className="p-2 font-bold hover:underline">Remove</button>
        </div>
      ) : (
        <div className="absolute top-2 right-2 bg-white">
          <button className="p-2 font-bold hover:underline">Interested</button>
          <button className="p-2 hover:drop-shadow hover:shadow-gray-300">
            ❤️
          </button>
        </div>
      )}
    </div>
  );
}
