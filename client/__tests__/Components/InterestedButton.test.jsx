// tests/components/InterestedButton.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InterestedButton from '@/app/Components/InterestedButton';
import '@testing-library/jest-dom';

describe('InterestedButton Component', () => {
  it('renders correctly when isInterested is true', () => {
    render(<InterestedButton isInterested={true} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByAltText('Heart filled')).toBeInTheDocument();
  });

  it('renders correctly when isInterested is false', () => {
    render(<InterestedButton isInterested={false} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(screen.getByAltText('Heart')).toBeInTheDocument();
  });

  it('calls onInterested when clicked and was not interested', async () => {
    const onInterested = jest.fn().mockResolvedValue();
    render(<InterestedButton onInterested={onInterested} />);
    const button = screen.getByRole('button');

    await userEvent.click(button);
    expect(onInterested).toHaveBeenCalledTimes(1);
    expect(screen.getByAltText('Heart filled')).toBeInTheDocument();
  });

  it('calls onNotInterested when clicked and was interested', async () => {
    const onNotInterested = jest.fn().mockResolvedValue();
    render(<InterestedButton isInterested={true} onNotInterested={onNotInterested} />);
    const button = screen.getByRole('button');

    await userEvent.click(button);
    expect(onNotInterested).toHaveBeenCalledTimes(1);
    expect(screen.getByAltText('Heart')).toBeInTheDocument();
  });

  it('handles async errors gracefully', async () => {
    const onInterested = jest.fn().mockRejectedValue(new Error('Failed to update'));
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<InterestedButton onInterested={onInterested} />);
    const button = screen.getByRole('button');

    await userEvent.click(button);
    expect(onInterested).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(new Error('Failed to update'));
    expect(screen.getByAltText('Heart')).toBeInTheDocument(); // State should not toggle

    consoleErrorSpy.mockRestore();
  });
});

