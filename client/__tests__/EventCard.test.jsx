import { getByText, render } from "@testing-library/react";
import EventCard from "@/app/(webapp)/events/EventCard";
import React from "react";

describe('EventCard', () => {
  it('should render', async () => {
    const { container } = render(<EventCard userId="0" event={{
      id: 0,
      event_name: 'Test Event',
      description: 'Test Description',
      startdate: '2022-01-01T12:00:00',
      location: 'Test Location',
      imageurl: 'https://via.placeholder.com/150',
    }} />);

    expect(container).toBeInTheDocument();
    // Check for event name to be displayed
    expect(getByText(container, 'Test Event')).toBeInTheDocument();
    // Check for event description to be displayed
    expect(getByText(container, 'Test Description')).toBeInTheDocument();
    // Check for event start date to be displayed
    expect(getByText(container, 'Jan 1, 2022')).toBeInTheDocument();
    // Check for event start time to be displayed
    expect(getByText(container, '12:00 PM')).toBeInTheDocument();
    // Check for event location to be displayed
    expect(getByText(container, 'Test Location')).toBeInTheDocument();
  });
});