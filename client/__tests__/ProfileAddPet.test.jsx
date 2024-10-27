import React from "react";
import { render, screen,fireEvent  } from "@testing-library/react";
import AddPetPopup from "@/app/(webapp)/profile/[userId]/addPet";

describe("AddPetPopup Component", () => {
  it("should render the Add Pet form with mock data", () => {
    const mockData = {
      name: "Jim",
      species: "Dog",
      breed: "Bulldog",
      age: "5",
      sex: "male",
      color: "Brown",
      weight: "20",
    };

    render(<AddPetPopup />);

    const addButton = screen.getByRole("button", { name: /add pet/i });
    fireEvent.click(addButton); 
   
    expect(screen.getByPlaceholderText("Enter your pet's name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter the breed")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter the age")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter the colour")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter the weight")).toBeInTheDocument();

    
  });
});
