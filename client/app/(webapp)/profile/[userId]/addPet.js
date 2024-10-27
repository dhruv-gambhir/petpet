import React, { useState } from "react";
import useStore from "@/app/store"; 


const petOptions = [
  { value: "Dog", label: "Dog" },
  { value: "Cat", label: "Cat" },
  { value: "Bird", label: "Bird" },
  { value: "Turtle", label: "Turtle" },
  { value: "Snake", label: "Snake" },
  { value: "Hamster", label: "Hamster" },
  { value: "Frog", label: "Frog" },
  { value: "Rabbit", label: "Rabbit" },
];

const AddPetPopup = () => {
    const { zId, zLogout } = useStore(); 

  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    sex: "",
    color: "",
    weight: "",
    imageurl: "",
    ownerid: zId,
  });

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      petName: "",
      species: "",
      breed: "",
      age: "",
      sex: "",
      colour: "",
      weight: "",
      imageurl: "",
      ownerid: zId,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Success:", result);
      setShowModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="relative w-full pt-5">
      <button
        className="w-full bg-mybutton text-black font-bold py-2 rounded shadow hover:bg-mypurple-dark transition duration-300"
        onClick={() => setShowModal(true)}
      >
        Add Pet
      </button>

      {showModal ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg w-2/3 h-[600px] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500 text-3xl p-2 border-gray-300 rounded-full bg-white hover:bg-gray-100 hover:text-black transition duration-300"
              onClick={handleClose}
            >
              &times;
            </button>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Pet Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
                    placeholder="Enter your pet's name"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Pet Type</label>
                  <select
                    name="species"
                    value={formData.species}
                    onChange={handleChange}
                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
                    required
                  >
                    <option value="" disabled>Select your pet's type</option>
                    {petOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Breed</label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
                    placeholder="Enter the breed"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Age (years)</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
                    placeholder="Enter the age"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Sex</label>
                  <input
                    type="text"
                    name="sex"
                    value={formData.sex}
                    onChange={handleChange}
                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
                    placeholder="Enter the sex"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
                    placeholder="Enter the color"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Weight</label>
                  <input
                    type="text"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
                    placeholder="Enter the weight"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="h-14 w-36 bg-mybutton text-black font-bold px-4 mt-5 rounded shadow"
                >
                  Add Pet
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg w-1/3 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Successfully Added!
            </h2>
            <button
              className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition duration-300"
              onClick={closeSuccessModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPetPopup;
