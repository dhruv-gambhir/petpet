"use client"
import { useEffect, useState } from "react";
import useStore from "@/app/store"; 
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { zId, zLogout } = useStore(); 
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [pets, setPets] = useState([]); 
    const router = useRouter();

    // Mock pet data
    const mockPetsData = [
        { name: "Buddy", species: "Dog", breed: "Golden Retriever", colour: "Golden", age: 3, sex: "Male", weight: "30 lbs" },
        { name: "Whiskers", species: "Cat", breed: "Tabby", colour: "Brown", age: 2, sex: "Female", weight: "10 lbs" },
        { name: "Goldie", species: "Fish", breed: "Goldfish", colour: "Orange", age: 1, sex: "N/A", weight: "0.5 oz" },
    ];
    

    useEffect(() => {
        if (!zId) {
            router.push("/login");
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${zId}`);
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    setFormData({
                        name: data.name,
                        email: data.email,
                        phonenumber: data.phonenumber,
                        bio: data.bio,
                        imageurl: data.imageurl,
                        address: data.address,
                        licensenumber: data.licensenumber,
                        isagency: data.isagency,
                    });
                } else {
                    console.error("Failed to fetch user data");
                    router.push("/login");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const fetchPets = async () => { 
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pets/${zId}`);
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

        fetchUser();
        // fetchPets(); 

    }, [zId]);

    if (!user) return (
        <div className="flex justify-center min-h-screen">
            <p className="text-xl text-gray-600 animate-pulse">Loading profile...</p>
        </div>
    );

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${zId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUser(updatedUser);
                setIsEditing(false);
            } else {
                console.error("Failed to update user data");
            }
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    };

    return (
        <main className="w-full p-8">
            <div className="relative w-full max-w-screen-xl mx-auto">
                <div className="flex justify-between mb-4">
                    <button 
                        className="bg-mybutton text-black font-bold px-4 py-2 rounded shadow"
                        onClick={() => {
                            zLogout();
                            router.push("/login");
                        }}
                    >
                        Logout
                    </button>

                    <button 
                        className="bg-mybutton text-black font-bold px-4 py-2 rounded shadow"
                        onClick={() => {
                            router.push("/interests");
                        }}
                    >
                        View Interests
                    </button>
                </div>

                <div className="flex space-x-8 mt-4 w-full">
                <div className="w-1/2 bg-white shadow-xl rounded-lg p-10 flex flex-col justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-10">User Information</h2>
                        <div className="flex">                            
                            <div className="w-1/3 flex flex-col items-center pr-4">
                                <img
                                    src={user.imageurl || "/default-avatar.jpg"}
                                    alt="User Profile"
                                    className="w-44 h-44 rounded-full shadow-md mb-6 object-cover"
                                />
                                <h1 className="text-4xl font-extrabold text-gray-800 mb-2">{user.name}</h1>
                                <p className="text-lg text-gray-500 italic mb-4">{user.bio || "No bio available."}</p>
                            </div>
                            <div className="w-2/3">
                                <div className="w-full divide-y divide-gray-200">
                                    <ProfileDetails user={user} isEditing={isEditing} formData={formData} handleChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <button 
                            className="w-full bg-mybutton text-black font-bold py-2 rounded shadow hover:bg-mypurple-dark transition duration-300"
                            onClick={handleEditToggle}
                        >
                            {isEditing ? 'Cancel' : 'Edit Details'}
                        </button>
                        {isEditing && (
                            <button 
                                className="w-full bg-green-500 text-white py-2 rounded shadow hover:bg-green-600 transition duration-300 mt-2"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        )}
                    </div>
                </div>
                <div className="w-1/2 bg-white shadow-xl rounded-lg p-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Pets Owned</h2>
                    <PetCarousel  pets={mockPetsData} />
                    <div className="mt-4">
                        <button 
                            className="w-full bg-mybutton text-black font-bold py-2 rounded shadow hover:bg-mypurple-dark transition duration-300"
                        >
                            Add Pet
                        </button>
                </div>
                </div>
                
                </div>
            </div>
        </main>
    );
}

function ProfileDetails({ user, isEditing, formData, handleChange }) {
    const details = [
        { label: "Email Address", value: user.email, name: 'email' },
        { label: "Phone Number", value: user.phonenumber, name: 'phonenumber' },
        { label: "Address", value: user.address, name: 'address' },
        { label: "Account Created", value: new Date(user.createdat).toLocaleDateString() },
        { label: "Last Updated", value: user.updatedat ? new Date(user.updatedat).toLocaleDateString() : new Date(user.createdat).toLocaleDateString() },
    ];

    if (user.isagency) {
        details.push({
            label: "License Number",
            value: user.licensenumber,
            name: 'licensenumber',
        });
    }

    return (
        <>
            {details.map((detail, index) => (
                <div key={index} className="flex justify-between py-3">
                    <span className="text-sm font-medium text-gray-600">{detail.label}:</span>
                    {isEditing && detail.name ? (
                        <input
                            type="text"
                            name={detail.name}
                            value={formData[detail.name] || ''}
                            onChange={handleChange}
                            className="text-sm text-gray-800 border rounded py-1 px-2"
                        />
                    ) : (
                        <span className={`text-sm ${!detail.value ? 'text-red-600 italic' : 'text-gray-800'}`}>
                            {detail.value || "No data provided"}
                        </span>
                    )}
                </div>
            ))}
            {user.isagency && (
                <p className="text-sm text-blue-600 py-2 text-center">Agency User: Yes</p>
            )}
        </>
    );
    
}

function PetCarousel({ pets }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % pets.length);
    };
    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + pets.length) % pets.length);
    };

    return (
        <div className="relative w-full flex justify-center items-center">
            <button 
                onClick={handlePrev} 
                className="absolute left-0 transform -translate-y-1/2 text-black p-2 "
                style={{ top: '50%' }}
            >
                &#9664;
            </button>
                <div className="w-full flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center">
                        <img
                            src={"/default-avatar.jpg"}
                            alt="Pet Profile"
                            className="w-32 h-32 rounded-full shadow-md mb-4 object-cover"
                        />
                        <h1 className="text-2xl font-extrabold text-gray-800 mb-4">{pets[currentIndex].name}</h1>
                    </div>

                    <div className="w-full bg-gray-100 rounded-lg p-6 shadow-md text-center">
                        <div className="grid grid-cols-2 gap-4">
                            <p><strong>Species:</strong> {pets[currentIndex].species}</p>
                            <p><strong>Age:</strong> {pets[currentIndex].age} years</p>
                            <p><strong>Sex:</strong> {pets[currentIndex].sex}</p>
                            <p><strong>Breed:</strong> {pets[currentIndex].breed}</p>
                            <p><strong>Color:</strong> {pets[currentIndex].colour}</p>
                            <p><strong>Weight:</strong> {pets[currentIndex].weight}</p>
                        </div>
                    </div>
                </div>
            <button 
                onClick={handleNext} 
                className="absolute right-0 transform -translate-y-1/2 text-black p-2 "
                style={{ top: '50%' }}
            >
                &#9654;
            </button>
        </div>
    );
}

