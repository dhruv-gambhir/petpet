"use client";

import { useState } from 'react';

export default function PreviewForm({ className }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  }

  return (
    <div className={`flex flex-row p-2 border border-gray-300 rounded-md bg-white gap-4 ${className}`}>
      <label htmlFor="image_upload" className='px-4 py-10 border rounded cursor-pointer flex-initial'>Choose images to upload.</label>
      <input onChange={handleFileChange} id="image_upload" type="file" accept="image/*" className="invisible absolute"/>
      <div className='px-4 py-10 border rounded flex-auto'>
        {
          file ? <>
            Loaded {file.name}
          </> : <>
            Waiting for file...
          </>
        }
      </div>
    </div>
  )
}