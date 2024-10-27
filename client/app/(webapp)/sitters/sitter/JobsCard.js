import InterestedButton from "@/app/Components/InterestedButton";
import { registerInterestInSitting, unregisterInterestInSitting } from "./sittingrequests";

export default function JobsCard({ detail, userId, onHover, onLeave, isHovered }) {
  
  const formatTaskType = (taskType) => {
    return taskType
      .toLowerCase()
      .split('_') // Split by underscore
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
      .join(' '); 
  };

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
      <div className="flex-1 flex flex-col justify-between"> 
        <div>
          <h2 className="text-lg">{detail.name}'s Request</h2>
          <p className="text-nowrap">
            ${detail.pay}/hour | {detail.location} | {formatTaskType(detail.tasktype)}
          </p>
          <p className="line-clamp-[8]">{detail.description}</p>
        </div>
        <div className="flex flex-row gap-4 mt-auto"> 
          <p className="bg-gray-300 px-1 py-1 rounded text-nowrap">
            {new Date(Date.parse(detail.startdate)).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </p>
          <a>to</a>
          <p className="bg-gray-300 px-1 py-1 rounded text-nowrap">
            {new Date(Date.parse(detail.enddate)).toLocaleTimeString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </p>
        </div>
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
