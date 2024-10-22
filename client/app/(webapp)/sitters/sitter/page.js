"use client";

import useSWR from "swr";
import { getSittingRequests, getUserById } from "./sittingrequests";
import useStore from "@/app/store";
import catBg from "../../../../public/cat_bg.png";
import { useRouter } from "next/navigation";
import JobsCard from "./JobsCard";
import { useState, useEffect } from "react";
import GoogleMapView from "./map";

export default function SitterPage() {
  const router = useRouter();
  const userId = useStore((state) => state.zId);
  const { data: jobsData, isLoading: isLoadingJobs } = useSWR("sitting_requests", getSittingRequests);
  const [combinedData, setCombinedData] = useState([]);
 
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (jobsData) {
        const jobsWithUserDetails = await Promise.all(
          jobsData.map(async (job) => {
            const user = await getUserById(job.userid); // Fetch user by userid
            return {
              ...job,
              name: user?.name || "Unknown",     // Add name from user data
              imageurl: user?.imageurl || "",    // Add imageurl from user data
            };
          })
        );
        setCombinedData(jobsWithUserDetails); // Set the combined data
      }
    };

    fetchUserDetails();
  }, [jobsData]);

  return (
    <div>
      <section className="relative w-screen h-28 bg-left flex flex-row items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url(${catBg.src})`,
            backgroundSize: "100% 150%",
            backgroundPosition: "bottom",
            opacity: "0.4",
          }}
        ></div>
        <div className="relative flex flex-row justify-between items-center w-full z-10">
          <div className="mx-10">
            <p className="text-xl text-black font-bold">
              Find the purrfect match for all your pet needs
            </p>
          </div>
          <div>
            <button
              className="h-14 w-36 border border-black rounded-full mx-10 justify-end"
              onClick={() => {
                router.push("./owner");
              }}
            >
              Owners
            </button>
            <button
              className="h-14 w-36 bg-white border border-black rounded-full mx-10 justify-end"
              onClick={() => {
                router.push("./sitter");
              }}
            >
              Sitters
            </button>
          </div>
        </div>
      </section>

      <div className="flex-initial self-stretch w-[83.3%] mx-auto">
        <form className="flex m-4 h-8">
          <input
            className="flex-1 mr-2 w-[40rem] px-2"
            type="text"
            placeholder="Location"
          />
          <div className="flex gap-2">
            <input className="px-2" type="text" placeholder="Sitting Type" />
            <input className="px-2" type="text" placeholder="Animal Type" />
            <input className="px-2" type="date" />
          </div>
        </form>

        <a>Sitting Requests</a>
        <div className="flex flex-row gap-4 mt-8">
          <div className="flex flex-col flex-1 gap-4">
            {combinedData?.map((detail) => (
              <JobsCard detail={detail} key={detail.id} userId={userId} />
            ))}
          </div>
          <div className="flex-1">
            <GoogleMapView />
          </div>
        </div>
      </div>
    </div>
  );
}