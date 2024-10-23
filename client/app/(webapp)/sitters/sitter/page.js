'use client';
import useSWR from "swr";
import { getSittingRequests, getUserById, geocodeAddress } from "./sittingrequests";
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
  const [hoveredJobId, setHoveredJobId] = useState(null); // Track hovered job ID

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (jobsData) {
        const jobsWithUserDetails = await Promise.all(
          jobsData.map(async (job) => {
            const user = await getUserById(job.userid);
            const geocodeResult = await geocodeAddress(job.location);

            return {
              ...job,
              name: user?.name || "Unknown",
              imageurl: user?.imageurl || "",
              address: geocodeResult?.address || job.location,
              coordinates: geocodeResult?.location  || { lat: 0, lng: 0 },
            };
          })
        );
        setCombinedData(jobsWithUserDetails);
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
        <div className="flex flex-row gap-4 mt-8">
          {/* Job Cards */}
          <div className="flex flex-col flex-1 gap-4">
            {combinedData?.map((detail) => (
              <JobsCard
                key={detail.id}
                detail={detail}
                userId={userId}
                isHovered={hoveredJobId === detail.id} // Pass whether the job is hovered
                onHover={() => setHoveredJobId(detail.id)} // Handle hover to highlight
                onLeave={() => setHoveredJobId(null)} // Handle mouse leave
              />
            ))}
          </div>

          {/* Google Map */}
          <div className="flex-1 h-[500px]">
            <GoogleMapView jobsData={combinedData} hoveredJobId={hoveredJobId} setHoveredJobId={setHoveredJobId}/>
          </div>
        </div>
      </div>
    </div>
  );
}