"use client";

import useStore from "@/app/store";
import useSWR from "swr";
import JobsCard from "../sitters/sitter/JobsCard";

export default function SittingPage() {
  const userId = useStore((state) => state.zId);
  const { data: sitting } = useSWR(() => "sitting_requests/user_interest/" + userId, async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sitting_requests/user_interest/` + userId);
    return await res.json();
  });
  return (
    <div className="flex flex-col self-stretch">
      <h1 className="text-2xl font-bold text-center py-4">Sitting</h1>
      <div className="flex flex-col gap-4 m-2 mt-8 w-4/5 mx-auto items-stretch">
      {
        sitting?.map((sitting) => (
          <JobsCard key={sitting.id} detail={sitting} userId={userId} />
        ))
      }
      </div>

    </div>
  );
}
