"use client";

import { useForm } from "react-hook-form";
import PreviewForm from "./PreviewForm";
import { uploadFile } from "@/app/lib/uploadFile";
import { createEvent } from "../events";
import useStore from "@/app/store";

export default function EventCreationForm({}) {
  const {
    register,
    handleSubmit,
    formState: {  },
  } = useForm();

  const userId = useStore(state => state.zId);

  const submitAction = async (data) => {
    const body = {
      event_name: data.eventName,
      createdby: userId,
      startdate: data.date.toString(),
      location: data.location,
      description: data.description,
    }

    const file = data.file[0];
    let url = "";
    try {
      url = await uploadFile(file);
    } catch (error) {
      console.error(error);
      return;
    }

    body["imageurl"] = url;

    try {
      await createEvent(body);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="flex flex-col p-4 gap-4 border border-mypurple m-4 rounded" onSubmit={handleSubmit(submitAction)}>
      <label className="text-lg font-semibold">Create an event</label>
      <div className="flex flex-row gap-8">
        <input
          type="text"
          placeholder="Event Name"
          className="border border-gray-300 rounded-md p-2 flex-1"
          {...register("eventName", { required: true })}
        />
        <input
          type="datetime-local"
          placeholder="Date"
          className="border border-gray-300 rounded-md p-2 flex-1"
          {...register("date", { required: true })}
        />
        <input
          type="text"
          placeholder="Location"
          className="border border-gray-300 rounded-md p-2 flex-1"
          {...register("location", { required: true })}
        />
      </div>
      <div className="basis-32 flex flex-row gap-8">
        <textarea
          type="text"
          placeholder="Description"
          className="border border-gray-300 rounded-md p-2 resize-none flex-auto"
          {...register("description")}
        />
        <PreviewForm className="basis-1/3" registerFileHook={register("file")} />
      </div>
      <button type="submit" className="bg-mypurple text-white rounded-md p-2 self-center w-80 hover:underline">
        Create
      </button>
    </form>
  );
}
