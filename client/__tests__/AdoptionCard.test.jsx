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
    expect(getAllByText(container, 'Jim')[0]).toBeInTheDocument();
    expect(getByText(container, 'Male')).toBeInTheDocument();
    expect(getByText(container, 'Black')).toBeInTheDocument();
    expect(getByText(container, 'Dog')).toBeInTheDocument();
    expect(getByText(container, '10 kg')).toBeInTheDocument();
    expect(getByText(container, 'Test Description')).toBeInTheDocument();
  });
});