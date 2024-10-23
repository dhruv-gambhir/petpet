"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import icon from "../../../../public/Default_profile_icon.jpeg";


export default function EditProfilePage() {
  const router = useRouter();

  // State to manage the expanded pet index
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Function to toggle the expanded index
  const toggleAccordion = (index) => {
      setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Sample user data, which you can replace with actual data from an API or props
  const [user, setUser] = useState({
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    bio: 'abc',
    address: 'abc',
    contactNumber: '+1234567890',
    pets: [
      { name: 'Bella', type: 'Dog', age: 5, breed: 'X', species: 'X' },
      { name: 'Whiskers', type: 'Cat', age: 3, breed: 'X', species: 'X' },
      { name: 'Nibbles', type: 'Rabbit', age: 2, breed: 'X', species: 'X' }
    ]
  });

  const [newPetName, setNewPetName] = useState('');
  const [selectedPetIndex, setSelectedPetIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleAddPet = () => {
    if (newPetName) {
      setUser((prevUser) => ({
        ...prevUser,
        pets: [...prevUser.pets, { name: newPetName, type: '', age: '', breed: '', species: '' }]
      }));
      setNewPetName('');
    }
  };

  const handleRemovePet = (index) => {
    setUser((prevUser) => ({
      ...prevUser,
      pets: prevUser.pets.filter((_, petIndex) => petIndex !== index)
    }));
  };

  const handleEditPet = (index, field, value) => {
    const updatedPets = [...user.pets];
    updatedPets[index] = { ...updatedPets[index], [field]: value };
    setUser((prevUser) => ({ ...prevUser, pets: updatedPets }));
  };

  const handleSave = () => {
    // Save the user data to the backend or local storage
    console.log('User data saved:', user);
    router.push('/profile'); // Redirect back to the profile page
  };

  return (
    <div className="flex flex-col items-center h-full w-full pt-8">
        <div className="w-5/6 flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

        <button
          onClick={handleSave}
          className="bg-mypurple text-white px-4 py-2 rounded shadow"
        >
          Save
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
                <input
                    type="text"
                    name="fullName"
                    value={user.fullName}
                    onChange={handleInputChange}
                    className="p-4 border rounded w-full bg-mybg shadow-md"
                />
            </div>
        
            <div className="w-full">
                <p className="text-lg font-semibold">Bio:</p>
                <textarea
                    name="bio"
                    value={user.bio}
                    onChange={handleInputChange}
                    className="p-4 border rounded w-full bg-mybg shadow-md"
                />
            </div>

            <div className="w-full">
                <p className="text-lg font-semibold">Email:</p>
                <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInputChange}
                    className="p-4 border rounded w-full bg-mybg shadow-md"
                />
            </div>

            <div className="w-full">
                <p className="text-lg font-semibold">Contact Number:</p>
                <input
                    type="text"
                    name="contactNumber"
                    value={user.contactNumber}
                    onChange={handleInputChange}
                    className="p-4 border rounded w-full bg-mybg shadow-md"
                />
            </div>

            <div className="w-full">
                <p className="text-lg font-semibold">Address:</p>
                <input
                    type="text"
                    name="address"
                    value={user.address}
                    onChange={handleInputChange}
                    className="p-4 border rounded w-full bg-mybg shadow-md"
                />
            </div>

           
        </div>

        <div className="col-span-3 flex flex-col items-center pt-10">
            <p className="text-lg font-semibold">Pets:</p>
            <div className="flex flex-col space-y-4 p-4">
                {user.pets.map((pet, index) => (
                    <div key={index} className="flex flex-col bg-mybg p-4 rounded shadow-md mb-2">
                        <div
                            onClick={() => toggleAccordion(index)}
                            className="cursor-pointer flex justify-between items-center"
                        >
                            <p className="font-semibold">Pet {index + 1}:</p>
                            <span>{expandedIndex === index ? '−' : '+'}</span>
                        </div>

                        {/* Accordion content */}
                        {expandedIndex === index && (
                            <div className="flex flex-col space-y-2 mt-2">
                                <div>
                                    <label className="font-medium">Name:</label>
                                    <input
                                        type="text"
                                        value={pet.name}
                                        onChange={(e) => handleEditPet(index, 'name', e.target.value)}
                                        className="p-2 border rounded bg-white shadow-md"
                                    />
                                </div>

                                <div>
                                    <label className="font-medium">Type:</label>
                                    <input
                                        type="text"
                                        value={pet.type}
                                        onChange={(e) => handleEditPet(index, 'type', e.target.value)}
                                        className="p-2 border rounded bg-white shadow-md"
                                    />
                                </div>

                                <div>
                                    <label className="font-medium">Age:</label>
                                    <input
                                        type="number"
                                        value={pet.age}
                                        onChange={(e) => handleEditPet(index, 'age', e.target.value)}
                                        className="p-2 border rounded bg-white shadow-md"
                                    />
                                </div>

                                <div>
                                    <label className="font-medium">Breed:</label>
                                    <input
                                        type="text"
                                        value={pet.breed}
                                        onChange={(e) => handleEditPet(index, 'breed', e.target.value)}
                                        className="p-2 border rounded bg-white shadow-md"
                                    />
                                </div>

                                <div>
                                    <label className="font-medium">Species:</label>
                                    <input
                                        type="text"
                                        value={pet.species}
                                        onChange={(e) => handleEditPet(index, 'species', e.target.value)}
                                        className="p-2 border rounded bg-white shadow-md"
                                    />
                                </div>

                                <button
                                    onClick={() => handleRemovePet(index)}
                                    className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                                >
                                    Remove Pet
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>


            {/* <input
              type="text"
              value={newPetName}
              onChange={(e) => setNewPetName(e.target.value)}
              placeholder="Add new pet"
              className="p-2 border rounded mb-2"
            />
            <button
              onClick={handleAddPet}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Pet
            </button> */}
          </div>
        </div>

        
      </div>
    
  );
}
