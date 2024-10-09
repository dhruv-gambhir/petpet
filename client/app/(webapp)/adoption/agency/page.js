import AdoptionCard from "../AdoptionCard";
import PreviewForm from "./PreviewForm";

// const commonAnimals = ["🐱 Cat", "🐶 Dog", "🐢 Turtle", "🐹 Hamster", "🐰 Rabbit"];

const staticAdoptionData = [
  {
    name: "Lulia",
    sex: "Male",
    color: "Black",
    breed: "Labrador",
    weight: 20,
    age: 3,
    vaccinationStatus: "Up-to-date",
    goodWithKids: true,
    agency: "Good Boy Agency",
    location: "Bukit Batok",
    description: "Lulia is a friendly Labrador looking for a loving home.",
    photo: "https://images.dog.ceo/breeds/labrador/n02099712_6852.jpg",
  },
  {
    name: "Buddy",
    sex: "Male",
    color: "Golden",
    breed: "Golden Retriever",
    weight: 30,
    age: 4,
    vaccinationStatus: "Up-to-date",
    goodWithKids: true,
    agency: "Ministry of Pets",
    location: "Jurong East",
    description: "Buddy loves to play fetch and is great with kids.",
    photo: "https://images.dog.ceo/breeds/retriever-golden/n02099601_3006.jpg",
  },
  {
    name: "Luna",
    sex: "Female",
    color: "White",
    breed: "Samoyed",
    weight: 22,
    age: 2,
    vaccinationStatus: "Up-to-date",
    goodWithKids: true,
    agency: "Happy Paws Shelter",
    location: "Ang Mo Kio",
    description: "Luna is a fluffy ball of joy who loves cuddles.",
    photo: "https://images.dog.ceo/breeds/samoyed/n02111889_8011.jpg",
  },
];

export default function AgencyAdoptionPage() {
  const adoptionData = staticAdoptionData;
  const agencyName = "Ministry of Pets";

  return (
    <div className="flex-initial self-stretch w-5/6 mx-auto">
      <form className="flex flex-col p-6 gap-6 border border-purple-500 m-6 rounded-lg bg-white shadow-md">
        <h2 className="text-2xl font-semibold text-purple-700">
          List a Pet for Adoption
        </h2>
        <div className="flex flex-wrap gap-6">
          <input
            type="text"
            placeholder="Pet Name"
            className="border border-gray-300 rounded-md p-3 flex-1"
          />
          <select className="border border-gray-300 rounded-md p-3 flex-1">
            <option value="" disabled selected hidden>
              Sex
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="text"
            placeholder="Color"
            className="border border-gray-300 rounded-md p-3 flex-1"
          />
          <input
            type="text"
            placeholder="Breed"
            className="border border-gray-300 rounded-md p-3 flex-1"
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            className="border border-gray-300 rounded-md p-3 flex-1"
          />
        </div>
        <div className="flex flex-wrap gap-6">
          <textarea
            placeholder="Description"
            className="border border-gray-300 rounded-md p-3 resize-none flex-1 h-32"
          />
          <PreviewForm className="flex-1" />
        </div>
        <button className="bg-purple-600 text-white rounded-md py-3 px-6 self-center w-60 hover:bg-purple-700">
          Submit
        </button>
      </form>

      <h1 className="text-3xl font-bold m-6 text-purple-700">
        Pets Listed for Adoption
      </h1>
      <form className="flex m-6">
        <input
          className="flex-1 mr-4 px-4 py-2 border border-gray-300 rounded-md"
          type="text"
          placeholder="Search for pets..."
        />
        {/* Uncomment and update if you add search functionality */}
        {/* <div className="flex gap-2">
          {commonAnimals.map((animal, index) => {
            return (
              <button
                key={index}
                className="px-3 py-1 rounded bg-white shadow-sm border border-gray-300 hover:bg-gray-100"
              >
                {animal}
              </button>
            );
          })}
        </div> */}
      </form>

      <div className="flex flex-col items-start gap-8 m-6 mt-8">
        {adoptionData.map((detail, index) => (
          <AdoptionCard detail={detail} key={index} isOrganizer={true} />
        ))}
      </div>
    </div>
  );
}

