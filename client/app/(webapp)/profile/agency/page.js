"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import icon from "../../../../public/Default_profile_icon.jpeg";



export default function ProfilePage() {
  // Sample user data, you can replace this with actual data from an API or props
  const user = {
    agency: 'Good Boy Agency',
    email: 'johndoe@example.com',
    bio: 'abc',
    address: 'abc',
    contactNumber: '+1234567890', 
    licenceNumber: '123'  
  };

  const [selectedPet, setSelectedPet] = useState(null);
  const router = useRouter(); 

  const handleEdit = () => {
    router.push('/edit'); 
  };


  return (
    <div className="flex flex-col justify-center items-center h-full w-full pt-8">
      <div className="w-5/6 flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Agency Profile</h2>
        <button 
          className="bg-mypurple text-white px-4 py-2 rounded shadow"
          onClick={handleEdit} 
        >
          Edit
        </button>
      </div>
      <div className="w-5/6 bg-white shadow-lg rounded-lg grid grid-cols-10 p-6 ">
        
        <div className="col-span-2 flex items-start justify-center pt-4">
          <img 
            src={icon.src}
            alt="Profile" 
            className="rounded-full w-32 h-32 object-cover" 
          />
        </div>
        
        <div className="col-span-5 flex flex-col items-start pt-4 space-y-4">
          <div className="w-full">
            <p className="text-lg font-semibold">Agency Name:</p>
            <div className="w-full bg-mybg p-4 mb-4 rounded shadow-md">          
              <p>{user.agency}</p>
            </div>
          </div>

          <div className="w-full">
            <p className="text-lg font-semibold">Bio:</p>
            <div className="w-full bg-mybg p-4 mb-4 rounded shadow-md">          
              <p>{user.bio}</p>
            </div>
          </div>

          <div className="w-full">
            <p className="text-lg font-semibold">Email:</p>
            <div className="w-full bg-mybg p-4 mb-4 rounded shadow-md">          
              <p>{user.email}</p>
            </div>
          </div>

          <div className="w-full">
            <p className="text-lg font-semibold">Contact Number:</p>
            <div className="w-full bg-mybg p-4 mb-4 rounded shadow-md">          
              <p>{user.contactNumber}</p>
            </div>
          </div>

          <div className="w-full">
            <p className="text-lg font-semibold">Address:</p>
            <div className="w-full bg-mybg p-4 mb-4 rounded shadow-md">          
              <p>{user.address}</p>
            </div>
          </div>

          <div className="w-full">
            <p className="text-lg font-semibold">License Number:</p>
            <div className="w-full bg-mybg p-4 mb-4 rounded shadow-md">          
              <p>{user.licenceNumber}</p>
            </div>
          </div>

          

        </div>        

      </div>
    </div>
  );
}
