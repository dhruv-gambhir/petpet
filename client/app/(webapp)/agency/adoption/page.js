"use client";

import AdoptionCard from "../../adoption/AdoptionCard";
import { ADOPTION_BY_USER_PATH } from "../../adoption/adoptions";
import PreviewForm from "./PreviewForm";
import useStore from "@/app/store";
import useSWR from "swr";
import { getAdoptionByUser } from "../../adoption/adoptions";
import { useState } from "react";
import AdoptionCreationForm from "./AdoptionCreationForm";

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
  const zId = useStore(state => state.zId);
  console.log(useStore());
  const { data: adoptionData, isLoading } = useSWR([ADOPTION_BY_USER_PATH, zId], getAdoptionByUser);

  const [searchSettings, setSearchSettings] = useState("");

  const filteredAdoptionData = adoptionData?.filter((detail) => {
    if (searchSettings && !detail.pet.name.includes(searchSettings)) return false;
    return true;
  });
  
  return (
    <div className="flex-initial self-stretch w-[83.3%] mx-auto">
      <AdoptionCreationForm />
      <h1 className="text-3xl font-bold m-4">
        Pets listed for adoption:
      </h1>
      <form className="flex m-4 h-8">
        <input
          className="flex-1 mr-2 w-[40rem] px-2"
          type="text"
          placeholder="Pets listed for adoption"
          onChange={(e) => setSearchSettings(e.target.value)}
        />
      </form>

      <div className="flex flex-col items-start gap-4 m-2 mt-8">
        {filteredAdoptionData?.map((detail, index) => (
          <AdoptionCard detail={detail} key={index} isOrganizer={true} />
        ))}
      </div>
    </div>
  )
}
