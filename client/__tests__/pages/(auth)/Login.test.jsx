// __tests__/pages/(auth)/Login.test.jsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../../../app/(auth)/login/page';
import useStore from '../../../app/store';
import { login } from '../../../app/Authentication/auth';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('../../../app/store');
jest.mock('next/navigation');
jest.mock('../../../app/Authentication/auth');

describe('Login Component', () => {
  // Mock functions
  const mockZLogin = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock useStore to return zLogin function
    useStore.mockReturnValue({
      zLogin: mockZLogin,
    });

    // Mock useRouter to return push function
    useRouter.mockReturnValue({
      push: mockPush,
    });

    // Mock window.alert
    window.alert = jest.fn();
  });

  test('renders the Login component correctly', () => {
    render(<Login />);
    
    // Check for heading with role 'heading' and name 'Login'
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    
    // Check for email input
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    
    // Check for password input
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    
    // Check for login button with role 'button' and name 'Login'
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    
    // Check for sign up link
    expect(screen.getByText(/New User\? Sign Up/i)).toBeInTheDocument();
  });

  test('allows user to input email and password', () => {
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    // Simulate user typing
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Assert input values
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('calls login function with correct parameters on form submission', async () => {
    // Mock successful login
    login.mockResolvedValue({ success: true });

    // Mock fetch response
    const mockUserId = 'user123';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user_id: mockUserId }),
    });

    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Simulate form submission
    fireEvent.click(loginButton);

    // Assert login function was called with correct parameters
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    // Assert fetch was called with correct URL
    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/id/email/test@example.com`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Assert zLogin was called with userId and email
    await waitFor(() => {
      expect(mockZLogin).toHaveBeenCalledWith(mockUserId, 'test@example.com');
    });

    // Assert router.push was called with correct URL
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(`/profile/${mockUserId}`);
    });

    // Clean up fetch mock
    global.fetch.mockRestore();
  });

  test('handles login failure and displays alert', async () => {
    // Mock failed login
    login.mockRejectedValue(new Error('Invalid credentials'));

    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    // Simulate form submission
    fireEvent.click(loginButton);

    // Assert login function was called with correct parameters
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('wrong@example.com', 'wrongpassword');
    });

    // Assert alert was called with error message
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Login error: Invalid credentials');
    });

    // Ensure zLogin and router.push were not called
    expect(mockZLogin).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  test('handles fetchUserId failure and displays alert', async () => {
    // Mock successful login
    login.mockResolvedValue({ success: true });

    // Mock fetch failure
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'User not found' }),
    });

    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: 'nonexistent@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Simulate form submission
    fireEvent.click(loginButton);

    // Assert login function was called with correct parameters
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('nonexistent@example.com', 'password123');
    });

    // Assert fetch was called with correct URL
    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/id/email/nonexistent@example.com`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Assert alert was called with error message
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Login error: User not found');
    });

    // Ensure zLogin and router.push were not called
    expect(mockZLogin).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();

    // Clean up fetch mock
    global.fetch.mockRestore();
  });

  test('matches snapshot', () => {
    const { asFragment } = render(<Login />);
    expect(asFragment()).toMatchSnapshot();
  });
});

