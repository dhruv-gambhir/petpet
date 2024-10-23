"use client";

import useSWR from "swr";
import AdoptionCard from "./AdoptionCard";
import { getAdoptions } from "./adoptions";
import useStore from "@/app/store";
import { useMemo, useState } from "react";

const commonAnimals = ["🐱 Cat", "🐶 Dog", "🐢 Turtle", "🐹 Hams", "🐰 Rabbit"];

export default function AdoptionPage() {
  const userId = useStore((state) => state.zId);
  const { data: adoptionData, isLoading } = useSWR(
    ["adoption_listings", userId],
    getAdoptions
  );

  const [filterSettings, setFilterSettings] = useState({});

  const filteredAdoptionData = useMemo(() => {
    if (!adoptionData) return [];
    const cleanAnimal = filterSettings.animal?.replace(/[^a-zA-Z0-9]/g, "");
    return adoptionData.filter((detail) => {
      if (
        filterSettings.search &&
        !detail.pet.name.includes(filterSettings.search)
      )
        return false;
      if (cleanAnimal && !detail.pet.species.includes(cleanAnimal)) return false;
      return true;
    });
  }, [adoptionData, filterSettings]);

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header section with search form and animal filters */}
      <div className="flex-shrink-0 w-[83.3%] mx-auto p-4">
        <form className="flex h-8">
          <input
            className="flex-1 mr-2 w-[40rem] px-2"
            type="text"
            placeholder="Pets available for adoption"
            onChange={(e) =>
              setFilterSettings({ ...filterSettings, search: e.target.value })
            }
          />
          <div className="flex gap-2">
            {commonAnimals.map((animal, index) => (
              <button
                key={index}
                className={`px-2 rounded bg-white shadow-sm hover:bg-yellow-100 ${
                  animal === filterSettings.animal && "bg-yellow-200"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  const fs = { ...filterSettings, animal };
                  if (filterSettings.animal === animal) delete fs.animal;
                  setFilterSettings(fs);
                }}
              >
                {animal}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Scrollable content with restricted height */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
        <div className="flex flex-col items-start gap-4 w-[83.3%] mx-auto p-2">
          {isLoading && <div>Loading...</div>}
          {filteredAdoptionData?.map((detail) => (
            <AdoptionCard detail={detail} key={detail.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

