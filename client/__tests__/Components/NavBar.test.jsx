// __tests__/components/NavBar.test.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import NavBar from '../../app/Components/NavBar';
import useStore from '../../app/store';

// Mock the useStore hook
jest.mock('../../app/store');

// Mock the Title component
jest.mock('../../app/Components/Title', () => {
  return function MockTitle(props) {
    return <div data-testid="mock-title" {...props}>Mocked Title</div>;
  };
});

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ children, href }) {
    return <a href={href}>{children}</a>;
  };
});

describe('NavBar Component', () => {
  // Set up the mocked store before each test
  beforeEach(() => {
    useStore.mockReturnValue({ zId: 'user123' });
  });

  // Clear all mocks after each test to prevent interference
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders NavBar without crashing', () => {
    render(<NavBar />);
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();
  });

  test('renders the Title component', () => {
    render(<NavBar />);
    const titleElement = screen.getByTestId('mock-title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent('Mocked Title');
  });

  test('renders all navigation links', () => {
    render(<NavBar />);
    const sittersLink = screen.getByText('Sitters');
    const eventsLink = screen.getByText('Events');
    const adoptionLink = screen.getByText('Adoption');
    const profileLink = screen.getByText('Profile');

    expect(sittersLink).toBeInTheDocument();
    expect(eventsLink).toBeInTheDocument();
    expect(adoptionLink).toBeInTheDocument();
    expect(profileLink).toBeInTheDocument();
  });

  test('navigation links have correct href attributes', () => {
    render(<NavBar />);
    const sittersLink = screen.getByText('Sitters').closest('a');
    const eventsLink = screen.getByText('Events').closest('a');
    const adoptionLink = screen.getByText('Adoption').closest('a');
    const profileLink = screen.getByText('Profile').closest('a');

    expect(sittersLink).toHaveAttribute('href', '/sitters/owner');
    expect(eventsLink).toHaveAttribute('href', '/events');
    expect(adoptionLink).toHaveAttribute('href', '/adoption');
    expect(profileLink).toHaveAttribute('href', '/profile/user123');
  });

  test('Profile link includes zId from the store', () => {
    render(<NavBar />);
    const profileLink = screen.getByText('Profile').closest('a');
    expect(profileLink).toHaveAttribute('href', '/profile/user123');
  });

  test('matches snapshot', () => {
    const { asFragment } = render(<NavBar />);
    expect(asFragment()).toMatchSnapshot();
  });
});

