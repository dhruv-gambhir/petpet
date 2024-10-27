import { getByTestId, getByText, render } from "@testing-library/react";
import PreviewForm from "../app/(webapp)/events/me/PreviewForm";
import React from "react";
import user from '@testing-library/user-event';

describe('PreviewForm', () => {
  it('should render', async () => {
    const { container } = render(<PreviewForm registerFileHook={{
      
    }} />);
    expect(container).toBeInTheDocument();
    // Check for the initial text 'Waiting for file...' to be displayed
    expect(getByText(container, 'Waiting for file...')).toBeInTheDocument();

    const inputFile = getByTestId(container, 'image_upload');
    
    await user.upload(inputFile, new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' }));
    // Check for the text 'Loaded chucknorris.png' to be displayed
    expect(getByText(container, 'Loaded chucknorris.png')).toBeInTheDocument();
  });
});