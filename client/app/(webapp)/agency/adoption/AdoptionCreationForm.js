"use client";

import PreviewForm from "./PreviewForm";
import { uploadFile } from "@/app/lib/uploadFile";
import useStore from "@/app/store";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { createAdoption } from "../../adoption/adoptions";

export default function AdoptionCreationForm() {
  const {
    register,
    handleSubmit,
    formState: {  },
  } = useForm();

  const userId = useStore(state => state.zId);
  const [file, setFile] = useState(null);

  const submitAction = async (data) => {
    const pet = {
      name: data.petName,
      agentid: userId,
      breed: data.breed,
      species: data.breed,
      color: data.color,
      sex: data.sex.toLowerCase(),
      weight: data.weight,
    }

    const adoptionData = {
      pet, file,
      agentid: userId,
      description: data.description,
    }

    let url = "";
    try {
      url = await uploadFile(file);
    } catch (error) {
      console.error(error);
      return;
    }

    pet["imageurl"] = url;

    try {
      await createAdoption(adoptionData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="flex flex-col p-4 gap-4 border border-mypurple m-4 rounded" onSubmit={handleSubmit(submitAction)}>
        <label className="text-lg font-semibold">List a pet for adoption</label>
        <div className="flex flex-row gap-8">
          <input
            type="text"
            placeholder="Pet Name"
            className="border border-gray-300 rounded-md p-2 flex-1"
            {...register("petName", { required: true })}
          />
          <select
            className="border border-gray-300 rounded-md p-2 flex-1"
            defaultValue=""
            {...register("sex", { validate: (value) => value !== "" })}
          >
            <option value="" disabled hidden>Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="text"
            placeholder="Color"
            className="border border-gray-300 rounded-md p-2 flex-1"
            {...register("color", { required: true })}
          />
          <input
            type="text"
            placeholder="Breed"
            className="border border-gray-300 rounded-md p-2 flex-1"
            {...register("breed", { required: true })}
          />
          <input
            type="number"
            placeholder="Weight (in kg)"
            className="border border-gray-300 rounded-md p-2 flex-1"
            {...register("weight", { required: true })}
          />
        </div>
        <div className="basis-32 flex flex-row gap-8">
          <textarea type='text' placeholder='Description' className='border border-gray-300 rounded-md p-2 resize-none flex-auto' {...register("description", { required: true })} />
          <PreviewForm className="basis-1/3" registerFile={setFile}  />
        </div>
        <button type="submit" className='bg-mypurple text-white rounded-md p-2 self-center w-80 hover:underline'>Submit</button>
      </form>
  )
}