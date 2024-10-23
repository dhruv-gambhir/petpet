import React, { useState } from "react";

const commonAnimals = [
  "🐱 Cat",
  "🐶 Dog",
  "🐢 Turtle",
  "🐹 Hamster",
  "🐰 Rabbit",
];

const PopupForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: "",
    petName: "",
    petType: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleClose = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePetTypeSelect = (pet) => {
    setFormData({ ...formData, petType: pet });
  };

  // Mock API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/submit", {
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
        className="absolute right-5 h-14 w-48 border border-black rounded-full mx-10 hover:bg-gray-100 transition duration-300"
        onClick={() => setShowModal(true)}
      >
        New Sitting Request
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
            <button
              className="absolute top-3 right-3 text-gray- text-2xl p-2 rounded-full hover:bg-gray-200 transition duration-300"
              onClick={handleClose}
            >
              &times;
            </button>

            <h2 className="text-2xl font-semibold text-center mb-6">
              New Sitting Request
            </h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-mynavbutton"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Pet Name
                  </label>
                  <input
                    type="text"
                    name="petName"
                    value={formData.petName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-"
                    placeholder="Enter your pet's name"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-medium mb-1">
                    Pet Type
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {commonAnimals.map((pet) => (
                      <button
                        key={pet}
                        type="button"
                        className={`px-4 py-2 border rounded-full focus:outline-none transition duration-300 ${
                          formData.petType === pet
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                        onClick={() => handlePetTypeSelect(pet)}
                      >
                        {pet}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full h-28 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-"
                    placeholder="Description of the job"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  className="h-12 w-40 bg-mybutton text-black rounded-full hover:bg-blue-700 transition duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-6">
              Successfully Submitted!
            </h2>
            <button
              className="h-12 w-32 bg-green-600 text-white rounded-full hover:bg-green-700 transition duration-300"
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

export default PopupForm;

