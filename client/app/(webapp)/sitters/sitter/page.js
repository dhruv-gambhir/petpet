"use client";
import catBg from "../../../../public/cat_bg.png";
import { useRouter } from "next/navigation";
import JobsCard from "./JobsCard";

const staticPetsData = [
  {
    petId: 1,
    petName: "Bella",
    petType: "Dog",
    breed: "Labrador Retriever",
    age: 3,
    ownerName: "Alice Smith",
    ownerContact: "alice@example.com",
    location: "Bukit Batok",
    datesNeeded: "2023-11-20 to 2023-11-25",
    specialNeeds: "Needs medication twice a day",
    description: "Bella is a friendly Labrador who loves to play fetch.",
    photo: "/d1.jpeg",
  },
  {
    petId: 2,
    petName: "Whiskers",
    petType: "Cat",
    breed: "Persian",
    age: 2,
    ownerName: "John Doe",
    ownerContact: "john@example.com",
    location: "Jurong West",
    datesNeeded: "2023-11-22 to 2023-11-24",
    specialNeeds: "Shy, prefers quiet environments",
    description: "Whiskers is a calm Persian cat who enjoys quiet company.",
    photo: "/c3.jpeg",
  },
  {
    petId: 3,
    petName: "Max",
    petType: "Dog",
    breed: "Golden Retriever",
    age: 4,
    ownerName: "Emily Tan",
    ownerContact: "emily@example.com",
    location: "Tampines",
    datesNeeded: "2023-11-27 to 2023-12-02",
    specialNeeds: "Very energetic, needs daily walks",
    description: "Max loves outdoor activities and is very friendly.",
    photo: "/d2.jpeg",
  },
  {
    petId: 4,
    petName: "Luna",
    petType: "Cat",
    breed: "Siamese",
    age: 5,
    ownerName: "David Lee",
    ownerContact: "david@example.com",
    location: "Clementi",
    datesNeeded: "2023-12-05 to 2023-12-10",
    specialNeeds: "Requires special diet",
    description: "Luna is affectionate and enjoys being around people.",
    photo: "/c1.jpeg",
  },
  {
    petId: 5,
    petName: "Charlie",
    petType: "Dog",
    breed: "Beagle",
    age: 2,
    ownerName: "Sophia Lim",
    ownerContact: "sophia@example.com",
    location: "Woodlands",
    datesNeeded: "2023-12-12 to 2023-12-15",
    specialNeeds: "None",
    description: "Charlie is curious and loves exploring new places.",
    photo: "https://images.dog.ceo/breeds/beagle/n02088364_11136.jpg",
  },
  {
    petId: 6,
    petName: "Milo",
    petType: "Cat",
    breed: "Maine Coon",
    age: 3,
    ownerName: "Karen Ng",
    ownerContact: "karen@example.com",
    location: "Pasir Ris",
    datesNeeded: "2023-12-18 to 2023-12-22",
    specialNeeds: "Needs grooming every other day",
    description: "Milo is playful and enjoys interactive toys.",
    photo: "/c2.jpeg",
  },
];

export default function SitterPage() {
  const router = useRouter();
  const petsData = staticPetsData;

  return (
    <div>
      {/* Header Section */}
      <section className="relative w-screen h-28 bg-left flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${catBg.src})`,
            backgroundSize: "100% 150%",
            backgroundPosition: "bottom",
            opacity: "0.4",
          }}
        ></div>
        <div className="relative flex justify-between items-center w-full z-10 px-10">
          <div>
            <p className="text-xl text-black font-bold">
              Find the purrfect match for all your pet needs
            </p>
          </div>
          <div className="flex">
            <button
              className="h-14 w-36 border border-black rounded-full mx-2 hover:bg-gray-200"
              onClick={() => {
                router.push("./owner");
              }}
            >
              Owners
            </button>
            <button
              className="h-14 w-36 bg-white border border-black rounded-full mx-2 hover:bg-gray-200"
              onClick={() => {
                router.push("./sitter");
              }}
            >
              Sitters
            </button>
          </div>
        </div>
      </section>

      {/* Search and Filter Form */}
      <div className="flex-initial self-stretch w-5/6 mx-auto mt-6">
        <form className="flex flex-col md:flex-row items-center m-4">
          <input
            className="flex-1 mr-2 w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md mb-2 md:mb-0"
            type="text"
            placeholder="Location"
          />
          <div className="flex flex-col md:flex-row gap-2">
            <input
              className="px-4 py-2 border border-gray-300 rounded-md"
              type="text"
              placeholder="Pet Type"
            />
            <input
              className="px-4 py-2 border border-gray-300 rounded-md"
              type="text"
              placeholder="Breed"
            />
            <input
              className="px-4 py-2 border border-gray-300 rounded-md"
              type="date"
            />
          </div>
        </form>

        {/* Title */}
        <h2 className="text-2xl font-semibold m-4">Pets Needing Sitting</h2>

        {/* Pets List */}
        <div className="flex flex-col items-start gap-6 m-4">
          {petsData.map((pet) => (
            <JobsCard pet={pet} key={pet.petId} />
          ))}
        </div>
      </div>
    </div>
  );
}

