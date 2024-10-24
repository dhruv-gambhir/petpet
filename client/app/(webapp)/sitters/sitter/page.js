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

  const { data: jobsData, isLoading: isLoadingJobs } = useSWR(["sitting_requests", userId], getSittingRequests);
  const [combinedData, setCombinedData] = useState([]);
  const [hoveredJobId, setHoveredJobId] = useState(null); // Track hovered job ID

  // Filter states
  const [selectedTaskType, setSelectedTaskType] = useState(''); // Task type filter
  const [selectedStartDate, setSelectedStartDate] = useState(''); // Start date filter
  const [selectedEndDate, setSelectedEndDate] = useState(''); // End date filter

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (jobsData) {
        const jobsWithUserDetails = await Promise.all(
          jobsData.map(async (job) => {
            const user = await getUserById(job.userid);
            const coordinates = await geocodeAddress(job.location); // Geocode location

            return {
              ...job,
              name: user?.name || "Unknown",
              imageurl: user?.imageurl || "",
              coordinates: coordinates || { lat: 0, lng: 0 },
            };
          })
        );
        setCombinedData(jobsWithUserDetails);
      }
    };

    fetchUserDetails();
  }, [jobsData]);

  // Filter jobs based on task type, start date, and end date
  const filteredJobs = combinedData.filter((job) => {
    const taskTypeMatch = selectedTaskType ? job.tasktype === selectedTaskType : true;
    const startDateMatch = selectedStartDate ? new Date(job.startdate) >= new Date(selectedStartDate) : true;
    const endDateMatch = selectedEndDate ? new Date(job.enddate) <= new Date(selectedEndDate) : true;

    return taskTypeMatch && startDateMatch && endDateMatch;
  });

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


      <div className="flex-initial self-stretch w-[95%] mx-auto">
        <div className="flex flex-row gap-4 mt-8">

          {/* Job Cards */}
          <div className="flex flex-col flex-1 gap-4 h-[430px] overflow-y-auto">
            {/* Filter UI */}
            <div className="flex flex-row gap-4">
              <select
                value={selectedTaskType}
                onChange={(e) => setSelectedTaskType(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded"
              >
                <option value="">All Task Types</option>
                <option value="dog_walking">Dog Walking</option>
                <option value="home_visits">Home Visits</option>
                <option value="day_boarding">Day Boarding</option>
                <option value="doggy_day_care">Doggy Day Care</option>
                <option value="house_sitting">House Sitting</option>
              </select>

              <input
                type="date"
                value={selectedStartDate}
                onChange={(e) => setSelectedStartDate(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded"
                placeholder="Start Date"
              />

              <input
                type="date"
                value={selectedEndDate}
                onChange={(e) => setSelectedEndDate(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded"
                placeholder="End Date"
              />
            </div>
            <div className="flex flex-col flex-1 gap-4 h-[430px] overflow-y-auto">
            {filteredJobs?.map((detail) => (
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
          </div>

          {/* Google Map */}
          <div className="flex-1 h-[500px]">
            <GoogleMapView jobsData={filteredJobs} hoveredJobId={hoveredJobId} setHoveredJobId={setHoveredJobId} />
          </div>
        </div>
      </div>
    </div>
  );
}
