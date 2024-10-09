import React, { useState } from 'react';

const petOptions = [
  { value: 'dog', label: 'Dog' },
  { value: 'cat', label: 'Cat' },
  { value: 'bird', label: 'Bird' },
  { value: 'fish', label: 'Fish' },
];

const PopupForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: '',
    petName: '',
    petType: '',
    startDate: '',
    endDate: '',
    description: '',
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

  // Mock API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Success:', result);
      setShowModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="relative w-full pt-5">
      <button
        className="absolute right-5 h-14 w-48 border border-black rounded-full mx-10 hover:bg-gray-300 transition duration-300"
        onClick={() => setShowModal(true)}
      >
        New Sitting Request
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500 text-3xl p-2 rounded-full hover:bg-gray-200 transition duration-300"
              onClick={handleClose}
            >
              &times;
            </button>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <h2 className="text-3xl font-bold text-center mb-6">New Sitting Request</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Owner Name</label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Pet Name</label>
                  <input
                    type="text"
                    name="petName"
                    value={formData.petName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your pet's name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Pet Type</label>
                  <select
                    name="petType"
                    value={formData.petType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="" disabled>
                      Select your pet's type
                    </option>
                    {petOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">End Date</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the job"
                    required
                    rows="5"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  className="h-14 w-40 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Successfully Submitted!
            </h2>
            <button
              className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition duration-300"
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

