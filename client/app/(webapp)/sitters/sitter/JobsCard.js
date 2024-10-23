import InterestedButton from "@/app/Components/InterestedButton";
import { registerInterestInSitting, unregisterInterestInSitting } from "./sittingrequests";

export default function JobsCard({ detail, userId, onHover, onLeave, isHovered }) {
  
  return (
    <div
      className={`relative bg-white rounded h-40 flex flex-row p-3 shadow-sm shadow-black ${
        isHovered ? 'border-2 border-blue-500' : ''
      }`}
      onMouseEnter={onHover} // Call onHover when the job card is hovered
      onMouseLeave={onLeave} // Call onLeave when the mouse leaves the card
    >
      <div className="flex-none w-40 relative">
        <img
          className="object-scale-down mx-auto h-full aspect-auto"
          src={detail.imageurl}
          alt="A pet photo."
        />
      </div>
      <div className="flex-1 flex flex-col">
        <h2 className="text-lg">{detail.name}'s Request</h2>
        <p className="text-nowrap">
          ${detail.pay}/hour | {detail.address}
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
