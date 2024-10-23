"use client";

import useSWR from "swr";
import useStore from "@/app/store.js";
import { fetcher } from "@/app/lib/fetcher";
import AdoptionCard from "../adoption/AdoptionCard";

export default function AdoptionPage() {
  const userId = useStore((state) => state.zId);
  const { data: details } = useSWR(() => "adoption_listings/user_interest/" + userId, fetcher);

  return (
    <div className="flex flex-col self-stretch">
      <h1 className="text-2xl font-bold text-center py-4">Adoption</h1>

      <div className="relative flex flex-col items-start gap-4 m-2 mt-8">
        {details?.map((detail) => (
          <AdoptionCard key={detail.id} detail={detail}/>
        ))}
      </div>
    </div>
  );
}
