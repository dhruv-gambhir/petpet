"use client";

import useSWR from "swr";
import useStore from "@/app/store.js";
import { fetcher } from "@/app/lib/fetcher";

export default function AdoptionPage() {
  const userId = useStore((state) => state.zId);
  const { data: dogs } = useSWR(() => "adoption_interests/user/" + userId, fetcher);

  return (
    <div className="flex flex-col self-stretch">
      <h1 className="text-2xl font-bold text-center py-4">Adoption</h1>

      <div className="relative flex flex-col items-start gap-4 m-2 mt-8">
        {dogs?.map((dog) => (
          <DogCard key={dog.id} dog={dog} />
        ))}
      </div>
    </div>
  );
}
