const AdoptionTile = ({ label, content, units }) => {
  return (<div className="bg-white border w-20 h-20 flex flex-col justify-center items-center rounded text-nowrap">
      <p className="text-mypurple">{content} {units ?? ""}</p>
      <span className="text-xs">{label}</span>
  </div>)
}

export default function AdoptionCard({ detail, isOrganizer }) {
isOrganizer = isOrganizer ?? false;

return (
  <div className="relative bg-white rounded w-4/5 h-80 ml-8 flex flex-row p-3 gap-8 shadow-sm shadow-black">
    <div className="flex-none w-60 relative">
      <img className="object-scale-down mx-auto h-full aspect-auto" src={detail.photo} alt="A dog photo." />
      <div className="absolute w-4/5 text-center bg-gray-300 px-2 py-1 rounded z-50 text-nowrap shadow-sm shadow-black bottom-[-1rem] left-[50%] translate-x-[-50%]">
        <p>{detail.name}</p>
      </div>
    </div>
    <div className="flex-1 flex flex-col ">
      <h2 className="text-lg">{detail.agency}</h2>
      <div className="flex flex-row gap-4 my-4">
          <AdoptionTile content={detail.sex} label="Sex" />
          <AdoptionTile content={detail.color} label="Color" />
          <AdoptionTile content={detail.breed} label="Breed" />
          <AdoptionTile content={detail.weight} label="Weight" units="kg" />
      </div>
      <p className="text-nowrap">
          {detail.location}
      </p>
      <p className="line-clamp-[8]">{detail.description}</p>
    </div>
    {isOrganizer ? (
      <div className="absolute top-2 right-2 bg-white">
        <button className="p-2 font-bold hover:underline">Remove</button>
      </div>
    ) : (
      <div className="absolute top-2 right-2 bg-white">
        <button className="p-2 font-bold hover:underline">Interested</button>
        <button className="p-2 hover:drop-shadow hover:shadow-gray-300">
          ❤️
        </button>
      </div>
    )}
  </div>
);
}