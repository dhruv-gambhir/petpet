"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import icon from "../../../../public/Default_profile_icon.jpeg";



export default function ProfilePage() {
  // Sample user data, you can replace this with actual data from an API or props
  const user = {
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    bio: 'abc',
    address: 'abc',
    contactNumber: '+1234567890',
    pets: [
      { name: 'Bella', type: 'Dog', age: 5, breed : 'X', species: 'X' },
      { name: 'Whiskers', type: 'Cat', age: 3, breed : 'X', species: 'X' },
      { name: 'Nibbles', type: 'Rabbit', age: 2, breed : 'X', species: 'X' }
    ]
  };

  const [selectedPet, setSelectedPet] = useState(null);
  const router = useRouter(); 

  const handleEdit = () => {
    router.push('/edit'); 
  };


  return (
    <div className="flex flex-col  items-center h-full w-full pt-8">
      <div className="w-5/6 flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">User Profile</h2>
        <button 
          className="bg-mypurple text-white px-4 py-2 rounded shadow"
          onClick={handleEdit} // Add onClick handler
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
            <p className="text-lg font-semibold">Full Name:</p>
            <div className="w-full bg-mybg p-4 mb-4 rounded shadow-md">          
              <p>{user.fullName}</p>
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
          <p className="text-lg font-semibold">Pets:</p>
            <div className="flex flex-row space-x-4 p-4">
              {user.pets.map((pet, index) => (
                <div
                  key={index}
                  className="cursor-pointer bg-mybg p-2 border rounded shadow-md text-black hover:bg-gray-200"
                  onClick={() => setSelectedPet(pet)}
                >
                  {pet.name}
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="col-span-3 flex flex-col items-center pt-10">
          {selectedPet ? (
            <div className="w-3/4 bg-mybg p-4 rounded shadow-md">
              <p className="text-lg font-semibold">Pet Information:</p>
              <p><strong>Name:</strong> {selectedPet.name}</p>
              <p><strong>Type:</strong> {selectedPet.type}</p>
              <p><strong>Age:</strong> {selectedPet.age} years</p>
              <p><strong>Breed:</strong> {selectedPet.breed}</p>
              <p><strong>Species:</strong> {selectedPet.species}</p>
            </div>
          ) : (
            <p></p>
          )}
        </div>

      </div>
    </div>
  );
}
