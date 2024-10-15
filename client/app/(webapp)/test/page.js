"use client";

import { useState } from 'react';
import { uploadFile } from '../../lib/uploadFile';

export default function Home() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const url = await uploadFile(file);
      setImageUrl(url);
      alert('File uploaded successfully!');
    } catch (error) {
      alert(`Upload failed: ${error.message}`);
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
