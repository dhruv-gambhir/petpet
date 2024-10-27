import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddPopup from "@/app/(webapp)/sitters/owner/NewSittingRequest";

const mockSittingRequestData = {
    ownerName: "Alice Smith",
    petNames: [
      {
        id: "1",
        name: "Buddy",
        species: "Dog",
        sex: "Male",
        age: "3",
        breed: "Golden Retriever",
        color: "Golden",
        weight: "30",
      },
    ],
    startDate: "2024-10-30T10:00:00",
    endDate: "2024-10-30T12:00:00",
    sittingType: "dog_walking",
    description: "Daily walk for Buddy.",
    payPerHour: "15",
    location: "123 Dog Street, Pet City",
};

describe("AddPopup Component", () => {
    it("should render the sitting request form with mock data", () => {
        render(<AddPopup />);

        const newSittingRequestButton = screen.getByRole('button', { name: /new sitting request/i });
        fireEvent.click(newSittingRequestButton);


        screen.getByPlaceholderText("Enter your name").value = mockSittingRequestData.ownerName;
        screen.getByPlaceholderText("Enter location").value = mockSittingRequestData.location;
        screen.getByPlaceholderText("Enter pay per hour").value = mockSittingRequestData.payPerHour;
        screen.getByPlaceholderText("Description of the job").value = mockSittingRequestData.description;

        const petCheckbox = screen.getByLabelText("Buddy (Dog, Male, 3 years)");
        fireEvent.click(petCheckbox);

        screen.getByLabelText("Start Date").value = mockSittingRequestData.startDate;
        screen.getByLabelText("End Date").value = mockSittingRequestData.endDate;

        const sittingTypeSelect = screen.getByLabelText("Sitting Type");
        sittingTypeSelect.value = mockSittingRequestData.sittingType;

        expect(screen.getByDisplayValue(mockSittingRequestData.ownerName)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockSittingRequestData.location)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockSittingRequestData.payPerHour)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockSittingRequestData.description)).toBeInTheDocument();
        expect(petCheckbox).toBeChecked();
        expect(screen.getByDisplayValue(mockSittingRequestData.startDate)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockSittingRequestData.endDate)).toBeInTheDocument();
        expect(screen.getByDisplayValue(mockSittingRequestData.sittingType)).toBeInTheDocument();
    });
});
