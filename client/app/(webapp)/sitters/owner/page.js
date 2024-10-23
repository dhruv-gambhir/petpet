"use client";
import catBg from "../../../../public/cat_bg.png";
import { useRouter } from "next/navigation";
import PopupForm from "./NewSittingRequest";
import { useState, useEffect } from "react";
import icon from "../../../../public/profile_icon.jpg";

export default function OwnerPage() {
  const router = useRouter();

  const [sittingRequests, setSittingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const userId = "676e94c4-aabf-4f26-b2b0-a02ab66756f0"; 

  useEffect(() => {
    const fetchSittingRequests = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sitting_requests?userid=${userId}`);
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

  const handleRequestChange = (e) => {
    const requestId = e.target.value;
    const request = sittingRequests.find((req) => req.id === requestId);
    setSelectedRequest(request);
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
                router.push("./sitters");
              }}
            >
              Sitters
            </button>
          </div>
        </div>
      </section>

      <div className="flex flex-row mt-2">
        <div className="w-1/2 p-5">
          <h2 className="text-lg font-bold mb-3 ">Select Sitting Request</h2>
          <select
            className="w-full h-10 border border-gray-300 rounded mb-5 pl-3"
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

          {selectedRequest && (
            <div>
              <h3 className="text-md font-bold">Request Details</h3>
              <div className="bg-white p-4 rounded-md shadow-md">        
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">  
                  <div className="flex flex-col">
                    <label className="text-gray-700 font-bold mb-1">Type</label>
                    <p className="p-4 border rounded w-full bg-mybg shadow-md">{selectedRequest.tasktype}</p>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-700 font-bold mb-1">Pay</label>
                    <p className="p-4 border rounded w-full bg-mybg shadow-md">${selectedRequest.pay}</p>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-700 font-bold mb-1">Start Date</label>
                    <p className="p-4 border rounded w-full bg-mybg shadow-md">{selectedRequest.startdate}</p>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-700 font-bold mb-1">End Date</label>
                    <p className="p-4 border rounded w-full bg-mybg shadow-md">{selectedRequest.enddate}</p>
                  </div>
                  <div className="flex flex-col col-span-2">
                    <label className="text-gray-700 font-bold mb-1">Description</label>
                    <p className="p-4 border rounded w-full bg-mybg shadow-md">{selectedRequest.description}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-md font-bold mt-3">Interested Users</h3>
              <div className="grid grid-cols-1 gap-4">
                {selectedRequest.interestedUsers && selectedRequest.interestedUsers.map((user) => (
                  <div key={user.id} className="bg-white p-4 rounded-md shadow-md flex items-center">
                    <img
                      src={icon.src} 
                      alt="Profile Icon"
                      className="w-32 h-32 rounded-full mr-4" 
                    />
                    <div className="flex-grow">
                      <h4 className="font-bold">{user.name} (ID: {user.id})</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <div className="flex flex-col">
                          <span className="font-semibold">Location:</span>
                          <p>{user.location}</p>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold">Phone:</span>
                          <p>{user.phone}</p>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold">Email:</span>
                          <p>{user.email}</p>
                        </div>
                        <div className="flex flex-col col-span-2">
                          <span className="font-semibold">Description:</span>
                          <p>{user.description}</p>
                        </div>
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
        </div>
      </div>
    </div>
  );
}
