


export const fetcher = async (url) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
};