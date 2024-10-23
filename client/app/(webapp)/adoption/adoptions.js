const fetcher = async (url, options) => await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`, options)

export const getAdoptions = async ([_, userId]) => {
  const response = await fetcher('adoption_listings?userid=' + userId)
  return await response.json()
};

export const ADOPTION_BY_USER_PATH = 'adoption_listings'
export const getAdoptionByUser = async ([_, userId]) => {
  const response = await fetcher(`${ADOPTION_BY_USER_PATH}/user/${userId}`)
  return await response.json()
};

export const registerInterestInAdoption = async (adoptionId, userId) => {
  const response = await fetcher(`adoption_interests/${adoptionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      userid: userId,
    })
  })

  return response.ok
}

export const unregisterInterestInAdoption = async (adoptionId, userId) => {
  const response = await fetcher(`adoption_interests/${adoptionId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      userid: userId,
    })
  })

  return response.ok
}

export const createAdoption = async (adoptionData) => {
  const response = await fetcher('adoption_listings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(adoptionData)
  })

  return response.ok
}