"use client";

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      alert('File uploaded successfully!');
      setImageUrl(result.url); // Set the image URL
    } else {
      alert(`Upload failed: ${result.error}`);
    }
  };

  return (
    <div>
      <h1>Upload a File to Azure Blob Storage</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {imageUrl && (
        <div>
          <h2>Uploaded Image:</h2>
          <img src={imageUrl} alt="Uploaded Image" style={{ maxWidth: '100%' }} />
          <p>Access URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a></p>
        </div>
      )}
    </div>
  );
}

