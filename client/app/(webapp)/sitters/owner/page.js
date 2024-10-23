"use client";
import catBg from "../../../../public/cat_bg.png";
import { useRouter } from "next/navigation";
import PopupForm from "./NewSittingRequest";
import { useState, useEffect } from "react";
import useStore from "@/app/store"; 

export default function OwnerPage() {
  const router = useRouter();
  const { zId, zLogout } = useStore(); 

  const [sittingRequests, setSittingRequests] = useState([]);
  const [selectedRequestDetails, setSelectedRequestDetails] = useState(null);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [userData, setUserData] = useState({});
  const [pets, setPets] = useState([]);

  const userId = zId; 
  const sittingType = [
    { value: "dog_walking", label: "Dog Walking" },
    { value: "day_boarding", label: "Day Boarding" },
    { value: "house_sitting", label: "House Sitting" },
    { value: "home_visits", label: "Home Visits" },
  ];

  useEffect(() => {
    const fetchSittingRequests = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sitting_requests/user/${zId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSittingRequests(data); 
      } catch (error) {
        console.error("Failed to fetch sitting requests:", error);
      }
    };

    fetchSittingRequests();
  }, [userId]);

  const handleRequestChange = async (e) => {
    const requestId = e.target.value;

    if (requestId) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sitting_requests/${requestId}?userid=${zId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch request details');
        }
        const requestDetails = await response.json();
        setSelectedRequestDetails(requestDetails.sitting_request);
        setPets(requestDetails.pets);

        const interestsResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sitter_interests/sittingrequest/${requestId}`);
        if (!interestsResponse.ok) {
          throw new Error('Failed to fetch interested users');
        }
        const interestedUsersData = await interestsResponse.json();
        setInterestedUsers(interestedUsersData);

        for (const user of interestedUsersData) {
          await fetchUserData(user.userid);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      setSelectedRequestDetails(null);
      setInterestedUsers([]);
      setPets([]);  
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${zId}`);
      if (response.ok) {
        const user = await response.json();
        setUserData((prevData) => ({ ...prevData, [userId]: user })); 
      } else {
        console.error("Failed to fetch user data for user ID:", userId);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  

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
              className="h-14 w-36 bg-white border border-black rounded-full mx-10 justify-end"
              onClick={() => {
                router.push("./owner");
              }}
            >
              Owners
            </button>
            <button
              className="h-14 w-36 border border-black rounded-full mx-10 justify-end"
              onClick={() => {
                router.push("./sitter");
              }}
            >
              Sitters
            </button>
          </div>
        </div>
      </section>

      <div className="flex flex-row mt-2">
  <div className="w-1/2 p-5">
    <h2 className="text-lg font-bold mb-3">Select Sitting Request</h2>
    <select
      className="w-full h-10 border border-gray-300 rounded mb-5 pl-3 bg-mybutton"
      onChange={handleRequestChange}
      defaultValue=""
    >
      <option value="" disabled>
        -- Select a request --
      </option>
      {sittingRequests.map((request) => (
        <option key={`Sitting Request ${request.id}`} value={request.id}>
          Sitting Request #{request.id}
        </option>
      ))}
    </select>

    {sittingRequests.length === 0 ? ( 
      <p className="italic text-gray-500">No sitting requests</p> 
    ) : selectedRequestDetails && (
      <div>
        <h3 className="text-md font-bold mt-3 mb-3">Request Details</h3>
        <div className="bg-white p-4 rounded-md shadow-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-700 font-bold mb-1">Requester Name</label>
              <p className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md">{selectedRequestDetails.name}</p>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-bold mb-1">Sitting Type</label>
              <p className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md">
                {
                  sittingType.find(type => type.value === selectedRequestDetails.tasktype)?.label || 'N/A'
                }
              </p>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-bold mb-1">Start Date</label>
              <p className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md">{selectedRequestDetails.startdate}</p>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-bold mb-1">End Date</label>
              <p className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md">{selectedRequestDetails.enddate}</p>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-bold mb-1">Pay/hour</label>
              <p className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md">${selectedRequestDetails.pay}</p>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 font-bold mb-1">Location</label>
              <p className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md">{selectedRequestDetails.location}</p>
            </div>
            <div className="flex flex-col col-span-2">
              <label className="text-gray-700 font-bold mb-1">Description</label>
              <p className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md">{selectedRequestDetails.description}</p>
            </div>
            <div className="col-span-2 text-right mt-2">
              <p className="text-gray-500 text-sm italic">
                Created on: {new Date(selectedRequestDetails.createdat).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-md font-bold mt-3 mb-3">Pets Details</h3>
        <div className="grid grid-cols-1 gap-4">
          {pets.map((pet) => (
            <div key={pet.id} className="flex bg-white p-3 rounded-md shadow-md" style={{ width: '750px', height: '200px' }}>
              <div className="w-1/3 flex flex-col items-center pr-3">
                <img
                  src={pet.imageurl || "/default-avatar.jpg"}
                  alt={pet.name}
                  className="w-24 h-24 rounded-full shadow-md mb-4 object-cover"
                />
                <h1 className="text-lg font-bold text-gray-800">{pet.name}</h1>
                <p className="text-sm text-gray-500 italic">{pet.species}</p>
              </div>

              <div className="w-2/3">
                <div className="w-full divide-y divide-gray-200">
                  {Object.entries(pet).map(([key, value]) => (
                    key !== 'id' && key !== 'name' && key !== 'species' && key !== 'imageurl' && (
                      <div key={key} className="py-1">
                        <p className="text-sm"><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value || 'N/A'}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>

  <div className="w-1/2 p-5">
    <PopupForm />
    
    {selectedRequestDetails && (
      <div>
    <h3 className="text-md font-bold mt-24 mb-3">Interested Users</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {interestedUsers.map((user) => (
    <div key={user.id} className="bg-white p-4 rounded-md shadow-md flex flex-col items-center">
      <div className="flex flex-col items-center mb-4">
        <img
          src={user.imageurl || "/default-avatar.jpg"} 
          alt="Profile Icon"
          className="w-32 h-32 rounded-full shadow-md object-cover"
        />
        <h4 className="text-2xl font-extrabold text-gray-800 mt-3">{user.name}</h4>
      </div>
      <div className="w-full  bg-mybutton bg-opacity-35 rounded-lg p-4 shadow-md text-center">
        <div className="grid grid-cols-2 gap-2"> 
          {userData[user.userid] && (
            <>
              <div className="flex flex-col">
                <span className="font-semibold">Email:</span>
                <span className={`text-sm ${!userData[user.userid].email ? 'text-gray-800 italic' : 'text-gray-800'}`}>
                  {userData[user.userid].email || "not provided"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Phone:</span>
                <span className={`text-sm ${!userData[user.userid].phone ? 'text-gray-800 italic' : 'text-gray-800'}`}>
                  {userData[user.userid].phone || "not provided"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Location:</span>
                <span className={`text-sm ${!userData[user.userid].location ? 'text-gray-800 italic' : 'text-gray-800'}`}>
                  {userData[user.userid].location || "not provided"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">Bio:</span>
                <span className={`text-sm ${!userData[user.userid].bio ? 'text-gray-800 italic' : 'text-gray-800'}`}>
                  {userData[user.userid].bio || "not provided"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  ))}
</div>
   </div> )}


    
  </div>
</div>

    </div>
  );
}
