import EventCard from "./EventCard";

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
    // This is to mimic db call.
    // const events = await new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve(staticEvents);
    //   }, 1000);
    // });

    const events = staticEvents;

    return (
        <div className="flex-initial">
            <form className="flex m-4 h-8">
                <input
                    className="flex-1 mr-2 w-[40rem] px-2"
                    type="text"
                    placeholder="Pet Events"
                />
                <div className="flex gap-2">
                    <input
                        className="px-2"
                        type="text"
                        placeholder="Location"
                    />
                    <input
                        className="px-2"
                        type="text"
                        placeholder="Animal Type"
                    />
                    <input className="px-2" type="date" />
                </div>
            </form>
            <div className="flex flex-col items-start gap-4 m-2 mt-8">
                {events.map((event) => (
                    <EventCard event={event} key={event.id} />
                ))}
            </div>
        </div>
    );
}
