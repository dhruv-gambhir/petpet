const fetcher = async (url, options) => await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`, options)

export const getAdoptions = async () => {
  const response = await fetcher('adoption_listings')
  return await response.json()
};

export const ADOPTION_BY_USER_PATH = 'adoption_listings'
export const getAdoptionByUser = async ([_, userId]) => {
  const response = await fetcher(`${ADOPTION_BY_USER_PATH}/${userId}`)
  return await response.json()
};

export const registerInterestInAdoption = async (adoptionId, userId) => {
  const response = await fetcher(`adoption_listings/${adoptionId}`, {
    method: 'POST',
    body: JSON.stringify({ 
      userid: userId,
    })
  })

  return response.ok
}

export const unregisterInterestInAdoption = async (adoptionId) => {
  const response = await fetcher(`adoption_listings/${adoptionId}`, {
    method: 'DELETE',
  })

  return response.ok
}