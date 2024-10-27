import { getByText, getAllByText, render } from "@testing-library/react";
import AdoptionCard from "@/app/(webapp)/adoption/AdoptionCard";
import React from "react";

describe('AdoptionCard', () => {
  it('should render', async () => {
    const { container } = render(<AdoptionCard detail={{
      id: 0,
      pet: {
        name: 'Jim',
        imageurl: 'https://via.placeholder.com/150',
        sex: 'Male',
        color: 'Black',
        species: 'Dog',
        weight: 10,
      },
      description: 'Test Description',
    }} />);

    expect(container).toBeInTheDocument();
    // Check for pet name to be displayed
    expect(getAllByText(container, 'Jim')[0]).toBeInTheDocument();
    // Check for pet sex to be displayed
    expect(getByText(container, 'Male')).toBeInTheDocument();
    // Check for pet color to be displayed
    expect(getByText(container, 'Black')).toBeInTheDocument();
    // Check for pet species to be displayed
    expect(getByText(container, 'Dog')).toBeInTheDocument();
    // Check for pet weight to be displayed
    expect(getByText(container, '10 kg')).toBeInTheDocument();
    // Check for pet description to be displayed
    expect(getByText(container, 'Test Description')).toBeInTheDocument();
  });
});