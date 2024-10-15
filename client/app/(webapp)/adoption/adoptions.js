const fetcher = async (url, options) => await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`, options)

export const getAdoptions = async () => {
  const response = await fetcher('adoption_listings')
  return await response.json()
};

