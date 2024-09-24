export async function uploadFile(file) {
  if (!file) {
    throw new Error('No file provided');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'File upload failed');
  }

  return result.url;
}
