import InterestedButton from "@/app/Components/InterestedButton";
import { registerInterestInSitting, unregisterInterestInSitting } from "./sittingrequests";

export default function JobsCard({ detail, userId }) {
  
  return (
    <div className="relative bg-white rounded w-4/5 h-40 ml-8 flex flex-row p-3 gap-8 shadow-sm shadow-black">
      <div className="flex-none w-60 relative">
      <img
          className="object-scale-down mx-auto h-full aspect-auto"
          src={detail.imageurl}
          alt="A dog photo."
        />      </div>
      <div className="flex-1 flex flex-col ">
        <h2 className="text-lg">{detail.name}'s Request</h2>
        <p className="text-nowrap">
            ${detail.pay}/hour | {detail.location}
        </p>
        <p className="line-clamp-[8]">{detail.description}</p>
      </div>
        <div className="absolute top-2 right-2 bg-white">
        <InterestedButton 
            isInterested={detail.interested}
            onInterested={() => registerInterestInSitting(detail.id, userId)} 
            onNotInterested={() => unregisterInterestInSitting(detail.id, userId)}
            />
        </div>
    </div>
  );
  }
