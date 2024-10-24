import React, { useState, useEffect } from "react";
import useStore from "@/app/store"; 


const sittingType = [
  { value: "dog_walking", label: "Dog Walking" },
  { value: "day_boarding", label: "Day Boarding" },
  { value: "house_sitting", label: "House Sitting" },
  { value: "home_visits", label: "Home Visits" },

];

const PopupForm = () => {
  const { zId, zLogout } = useStore(); 

  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    ownerName: "",
    petNames: [], // This will hold the selected pet IDs
    startDate: "",
    endDate: "",
    sittingType: "",
    description: "",
    payPerHour: "",
    location: "",
  });
  const [pets, setPets] = useState([]);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handlePetSelection = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const petNames = checked
        ? [...prevData.petNames, value] // Add pet ID if checked
        : prevData.petNames.filter((id) => id !== value); // Remove pet ID if unchecked

      return { ...prevData, petNames }; // Update formData with new petNames
    });
  };

  const fetchPets = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pets/user/${zId}`);
      if (response.ok) {
        const data = await response.json();
        setPets(data);
      } else {
        console.error("Failed to fetch pets data");
      }
    } catch (error) {
      console.error("Error fetching pets data:", error);
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchPets();
    }
  }, [showModal]);


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare the form data to match the API requirements
    const selectedPetDetails = pets.filter(pet => formData.petNames.includes(pet.id));
  
    // Format the start and end dates to 'YYYY-MM-DD HH:MM:SS'
    const formattedStartDate = new Date(formData.startDate).toISOString().slice(0, 19).replace('T', ' ');
    const formattedEndDate = new Date(formData.endDate).toISOString().slice(0, 19).replace('T', ' ');
  
    const requestData = {
      userid: zId, // Assuming zId is the user ID
      pets: selectedPetDetails.map(pet => ({
        id: pet.id,
        age: pet.age,
        breed: pet.breed,
        color: pet.color,
        imageurl: pet.imageurl,
        name: pet.name,
        ownerid: pet.ownerid,
        sex: pet.sex,
        species: pet.species,
        weight: pet.weight,
      })), // Use full pet details
      startdate: formattedStartDate, // Formatted start date
      enddate: formattedEndDate, // Formatted end date
      pay: formData.payPerHour, // Add pay per hour
      description: formData.description,
      status: "pending", // You can set a default status if needed
      tasktype: formData.sittingType, // Add the sitting type
      location: formData.location, // Add location
    };
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sitting_requests`, { // Ensure this URL matches your endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData), // Send the formatted data
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

        className="absolute right-5 mx-10 justify-end bg-mybutton text-black font-bold px-4 py-2 rounded shadow"

        onClick={() => setShowModal(true)}
      >
        New Sitting Request
      </button>

      {showModal && (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg w-2/3 h-[600px] overflow-y-auto relative">

            <button
              className="absolute top-3 right-3 text-gray- text-2xl p-2 rounded-full hover:bg-gray-200 transition duration-300"
              onClick={handleClose}
            >
              &times;
            </button>


            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Multi-select for Pets using Checkboxes */}
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Select Pets</label>
                  <div className="flex flex-col">
                    {pets.map((pet) => (
                      <label key={pet.id} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          value={pet.id}
                          checked={formData.petNames.includes(pet.id)}
                          onChange={handlePetSelection}
                          className="mr-2"
                        />
                        <span>
                          {pet.name} ({pet.species}, {pet.sex}, {pet.age} years)
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Other fields */}
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Sitting Type</label>
                  <select
                    name="sittingType"
                    value={formData.sittingType}
                    onChange={handleChange}
                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
                    required
                  >
                    <option value="" disabled>Select the sitting type required</option>
                    {sittingType.map((option) => (
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

                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
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

                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Pay/hour</label>
                  <input
                    type="text"
                    name="payPerHour"
                    value={formData.payPerHour}
                    onChange={handleChange}
                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
                    placeholder="Enter pay per hour"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
                    placeholder="Enter location"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-gray-700 font-bold mb-1">Description</label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}

                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"

                    placeholder="Description of the job"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="h-14 w-36 bg-mybutton text-black font-bold px-4 py-2 rounded shadow"

                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSuccessModal && (

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg w-1/3 text-center">
            <h2 className="text-2xl font-bold text-black-600 mb-4">
              Successfully Submitted!
            </h2>
            <button
              className="bg-mybutton text-black font-bold py-2 px-4 rounded-full"

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

