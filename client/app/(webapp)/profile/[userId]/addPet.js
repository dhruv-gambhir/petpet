import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useStore from "@/app/store";
import { uploadFile } from "@/app/lib/uploadFile";

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
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      species: "",
      breed: "",
      age: "",
      sex: "",
      color: "",
      weight: "",
      imageurl: "",
      ownerid: zId,
    },
  });
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const onSubmit = async (data) => {
    const body = {
      name: data.name,
      species: data.species,
      breed: data.breed,
      age: data.age,
      sex: data.sex,
      color: data.color,
      weight: data.weight,
      ownerid: zId,
    };

    const file = data.image[0];
    let url = "";
    try {
      url = await uploadFile(file);
      console.log("Uploaded Image bruhh URL:", url)
    } catch (error) {
      console.error(error);
      return;
    }

    body["imageurl"] = url;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();
      console.log("Success:", result);
      setShowModal(false);
      setShowSuccessModal(true);
      reset();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    reset();
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg w-2/3 h-[600px] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-500 text-3xl p-2 border-gray-300 rounded-full bg-white hover:bg-gray-100 hover:text-black transition duration-300"
              onClick={handleClose}
            >
              &times;
            </button>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Pet Name</label>
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
                    placeholder="Enter your pet's name"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Pet Type</label>
                  <select
                    {...register("species", { required: true })}
                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
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
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Breed</label>
                  <input
                    type="text"
                    {...register("breed", { required: true })}
                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
                    placeholder="Enter the breed"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Age (years)</label>
                  <input
                    type="number"
                    {...register("age", { required: true })}
                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
                    placeholder="Enter the age"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Sex</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register("sex", { required: true })}
                        value="male"
                        className="mr-2"
                      />
                      Male
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register("sex", { required: true })}
                        value="female"
                        className="mr-2"
                      />
                      Female
                    </label>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Color</label>
                  <input
                    type="text"
                    {...register("color", { required: true })}
                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
                    placeholder="Enter the colour"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Weight</label>
                  <input
                    type="number"
                    {...register("weight", { required: true })}
                    className="p-4 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
                    placeholder="Enter the weight"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-gray-700 font-bold mb-1">Upload Image</label>
                  <input
                    type="file"
                    {...register("image", { required: true })}
                    className="p-2 border rounded w-full bg-mybutton bg-opacity-35 shadow-md"
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

export default AddPetPopup;
