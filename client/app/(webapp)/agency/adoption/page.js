"use client";

import AdoptionCard from "../../adoption/AdoptionCard";
import { ADOPTION_BY_USER_PATH } from "../../adoption/adoptions";
import PreviewForm from "./PreviewForm";
import useStore from "@/app/store";
import useSWR from "swr";
import { getAdoptionByUser } from "../../adoption/adoptions";

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
            value=""
          >
            <option value="" disabled hidden>Sex</option>
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
        <div className="basis-32 flex flex-row gap-8">
          <textarea type='text' placeholder='Description' className='border border-gray-300 rounded-md p-2 resize-none flex-auto' />
          <PreviewForm className="basis-1/3" />
        </div>
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
        {adoptionData?.map((detail, index) => (
          <AdoptionCard detail={detail} key={index} isOrganizer={true} />
        ))}
      </div>
    </div>
  )
}
