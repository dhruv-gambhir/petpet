import { getByText, render, fireEvent } from "@testing-library/react";
import JobsCard from "@/app/(webapp)/sitters/sitter/JobsCard";
import React from "react";

describe('JobsCard', () => {
  it('should render and display job details', () => {
    const mockOnHover = jest.fn();
    const mockOnLeave = jest.fn();
    const { container } = render(
      <JobsCard
        userId="1"
        detail={{
          id: 1,
          name: 'Buddy',
          description: 'Looking for someone to take care of Buddy while I am away.',
          pay: 15,
          location: 'New York',
          tasktype: 'DOG_WALKING',
          imageurl: 'https://via.placeholder.com/150',
          startdate: '2024-10-27T10:00:00',
          enddate: '2024-10-27T14:00:00',
          interested: false,
        }}
        onHover={mockOnHover}
        onLeave={mockOnLeave}
        isHovered={false}
      />
    );

    expect(container).toBeInTheDocument();

    // Check for job name to be displayed
    expect(getByText(container, "Buddy's Request")).toBeInTheDocument();
    // Check for job description to be displayed
    expect(getByText(container, 'Looking for someone to take care of Buddy while I am away.')).toBeInTheDocument();
    // Check for pay and location to be displayed
    expect(getByText(container, '$15/hour | New York | Dog Walking')).toBeInTheDocument();
    // Check for formatted start date to be displayed
    expect(getByText(container, 'Oct 27, 2024, 10:00 AM')).toBeInTheDocument();
    // Check for formatted end date using a function matcher
    expect(getByText(container, (content) => content.includes('2:00 PM'))).toBeInTheDocument();

    // Simulate hover and leave actions
    fireEvent.mouseEnter(container.firstChild);
    expect(mockOnHover).toHaveBeenCalled();

    fireEvent.mouseLeave(container.firstChild);
    expect(mockOnLeave).toHaveBeenCalled();
  });
});
