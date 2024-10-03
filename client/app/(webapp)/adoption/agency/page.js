import AdoptionCard from "../AdoptionCard";

// const commonAnimals = ["🐱 Cat", "🐶 Dog", "🐢 Turtle", "🐹 Hams", "🐰 Rabbit"];

const staticAdoptionData = [
  {
    name: "Lulia",
    sex: "Male",
    color: "Black",
    breed: "Labrador",
    weight: "20",
    agency: "Good Boy Agency",
    location: "Bukit Batok",
    description: "This is the first event.",
    photo: "https://images.dog.ceo/breeds/pyrenees/n02111500_5225.jpg",
  },
];

export default function AgencyAdoptionPage() {
  const adoptionData = staticAdoptionData;
  const agencyName = "Ministry of Pets";

  return (
    <div className="flex-initial self-stretch w-[83.3%] mx-auto">
       <form className="flex flex-col p-4 gap-4 border border-mypurple m-4 rounded">
        <label className="text-lg font-semibold">List a pet for adoption</label>
        <div className="flex flex-row gap-8">
          <input
            type="text"
            placeholder="Pet Name"
            className="border border-gray-300 rounded-md p-2 flex-1"
          />
          <select
            className="border border-gray-300 rounded-md p-2 flex-1"
          >
            <option value="" disabled selected hidden>Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="text"
            placeholder="Color"
            className="border border-gray-300 rounded-md p-2 flex-1"
          />
          <input
            type="text"
            placeholder="Breed"
            className="border border-gray-300 rounded-md p-2 flex-1"
          />
          <input
            type="number"
            placeholder="Weight (in kg)"
            className="border border-gray-300 rounded-md p-2 flex-1"
          />
        </div>
        <textarea type='text' placeholder='Description' className='border border-gray-300 rounded-md p-2 resize-none basis-32' />
        <button className='bg-mypurple text-white rounded-md p-2 self-center w-80 hover:underline'>Submit</button>
      </form>

      <h1 className="text-3xl font-bold m-4">
        Pets listed for adoption:
      </h1>
      <form className="flex m-4 h-8">
        <input
          className="flex-1 mr-2 w-[40rem] px-2"
          type="text"
          placeholder="Pets listed for adoption"
        />
        {/* <div className="flex gap-2">
          {commonAnimals.map((animal, index) => {
            return (
              <button key={index} className="px-2 rounded bg-white shadow-sm">
                {animal}
              </button>
            );
          })}
        </div> */}
      </form>

      <div className="flex flex-col items-start gap-4 m-2 mt-8">
        {adoptionData.map((detail, index) => (
          <AdoptionCard detail={detail} key={index} isOrganizer={true} />
        ))}
      </div>
    </div>
  )
}
