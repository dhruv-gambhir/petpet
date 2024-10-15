import React, { useState } from "react";

const petOptions = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "bird", label: "Bird" },
  { value: "fish", label: "Fish" },
];

const sittingType = [
  { value: "DW", label: "Dog Walking" },
  { value: "DIV", label: "Drop-In Pet Visits" },
  { value: "HS", label: "House Sitting" },
  { value: "OS", label: "Overnight Stays" },
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
    sittingType: "",
    description: "",
  });

  const handleClose = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //mock API call
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
        className="absolute right-5 mx-10 justify-end bg-mypurple text-white px-4 py-2 rounded shadow"
        onClick={() => setShowModal(true)}
      >
        New Sitting Request
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
                  <label className="text-gray-700 font-bold mb-1">Owner Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="p-4 border rounded w-full bg-mybg shadow-md"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Pet Name</label>
                  <input
                    type="text"
                    name="petName"
                    value={formData.petName}
                    onChange={handleChange}
                    className="p-4 border rounded w-full bg-mybg shadow-md"
                    placeholder="Enter your pet's name"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Pet Type</label>
                  <select
                    name="petType"
                    value={formData.petType}
                    onChange={handleChange}
                    className="p-4 border rounded w-full bg-mybg shadow-md"
                    required
                  >
                    <option value="" disabled>Select your pet's type</option>
                    {petOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="p-4 border rounded w-full bg-mybg shadow-md"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="p-4 border rounded w-full bg-mybg shadow-md"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Sitting Type</label>
                  <select
                    name="sittingType"
                    value={formData.sittingType}
                    onChange={handleChange}
                    className="p-4 border rounded w-full bg-mybg shadow-md"
                    required
                  >
                    <option value="" disabled>Select the sitting type required</option>
                    {sittingType.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-gray-700 font-bold mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="p-4 border rounded w-full bg-mybg shadow-md"
                    placeholder="Description of the job"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="h-14 w-36 bg-mypurple text-white px-4 py-2 rounded shadow"
                >
                  Create
                </button>
              </div>
            </form>

          </div>
        </div>
      ) : null}

      {/* check on this popup*/}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg w-1/3 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Successfully Submitted!
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

export default PopupForm;
