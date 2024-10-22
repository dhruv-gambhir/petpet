"use client";

import useSWR from "swr";
import AdoptionCard from "./AdoptionCard";
import { getAdoptions } from "./adoptions";
import useStore from "@/app/store";
import { useMemo, useState } from "react";

const commonAnimals = ["🐱 Cat", "🐶 Dog", "🐢 Turtle", "🐹 Hams", "🐰 Rabbit"];

export default function AdoptionPage() {
  const userId = useStore((state) => state.zId);
  const { data: adoptionData, isLoading } = useSWR(["adoption_listings", userId], getAdoptions);

  const [filterSettings, setFilterSettings] = useState({});

  const filteredAdoptionData = useMemo(() => {
    if (!adoptionData) return [];
    const cleanAnimal = filterSettings.animal?.replace(/[^a-zA-Z0-9]/g, '');
    return adoptionData.filter((detail) => {
      if (filterSettings.search && !detail.pet.name.includes(filterSettings.search)) return false;
      if (cleanAnimal && !detail.pet.species.includes(cleanAnimal)) return false;
      return true;
    });
  }, [adoptionData, filterSettings]);

  return (
    <div className="flex-initial self-stretch w-[83.3%] mx-auto">
      <form className="flex m-4 h-8">
        <input
          className="flex-1 mr-2 w-[40rem] px-2"
          type="text"
          placeholder="Pets available for adoption"
          onChange={(e) => setFilterSettings({ ...filterSettings, search: e.target.value })}
        />
        <div className="flex gap-2">
          {commonAnimals.map((animal, index) => {
            return (
              <button key={index} className={`px-2 rounded bg-white shadow-sm hover:bg-yellow-100 ${animal === filterSettings.animal && "bg-yellow-200"}`} onClick={(e) => {
                e.preventDefault();
                const fs = { ...filterSettings, animal };
                if (filterSettings.animal === animal) delete fs.animal;
                setFilterSettings(fs);
              }}>
                {animal}
              </button>
            );
          })}
        </div>
      </form>


      {isLoading && <div>Loading...</div>}

      <div className="flex flex-col items-start gap-4 m-2 mt-8">
        {filteredAdoptionData?.map((detail, index) => (
          <AdoptionCard detail={detail} key={index} />
        ))}
      </div>
    </div>
  );
}
