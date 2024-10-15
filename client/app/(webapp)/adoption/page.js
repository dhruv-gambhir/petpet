"use client";

import useSWR from "swr";
import AdoptionCard from "./AdoptionCard";
import { getAdoptions } from "./adoptions";

const commonAnimals = ["🐱 Cat", "🐶 Dog", "🐢 Turtle", "🐹 Hams", "🐰 Rabbit"];

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


export default function AdoptionPage() {

  const { data: adoptionData, isLoading } = useSWR("adoption_listings", getAdoptions);
  // const adoptionData = staticAdoptionData;

  return (
    <div className="flex-initial self-stretch w-[83.3%] mx-auto">
      <form className="flex m-4 h-8">
        <input
          className="flex-1 mr-2 w-[40rem] px-2"
          type="text"
          placeholder="Pets available for adoption"
        />
        <div className="flex gap-2">
          {commonAnimals.map((animal, index) => {
            return (
              <button key={index} className="px-2 rounded bg-white shadow-sm">
                {animal}
              </button>
            );
          })}
        </div>
      </form>


      {isLoading && <div>Loading...</div>}

      <div className="flex flex-col items-start gap-4 m-2 mt-8">
        {adoptionData?.map((detail, index) => (
          <AdoptionCard detail={detail} key={index} />
        ))}
      </div>
    </div>
  );
}
