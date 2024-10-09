import InterestedButton from "@/app/Components/InterestedButton";

export default function JobsCard({ detail, isOrganizer }) {
  isOrganizer = isOrganizer ?? false;
  
  return (
    <div className="relative bg-white rounded w-4/5 h-40 ml-8 flex flex-row p-3 gap-8 shadow-sm shadow-black">
      <div className="flex-none w-60 relative">
        <img className="object-scale-down mx-auto h-full aspect-auto" src={detail.photo} alt="A dog photo." />
      </div>
      <div className="flex-1 flex flex-col ">
        <h2 className="text-lg">{detail.sittingtype} {detail.animaltype} Request</h2>
        <p className="text-nowrap">
            {detail.price} {detail.location}
        </p>
        <p className="line-clamp-[8]">{detail.description}</p>
      </div>
      {isOrganizer ? (
        <div className="absolute top-2 right-2 bg-white">
          <button className="p-2 font-bold hover:underline">Remove</button>
        </div>
      ) : (
        <div className="absolute top-2 right-2 bg-white">
            <InterestedButton/>
        </div>
      )}
    </div>
  );
  }
