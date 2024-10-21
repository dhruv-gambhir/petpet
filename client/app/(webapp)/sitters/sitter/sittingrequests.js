const fetcher = async (url, options) => await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`, options)

/**
 * @typedef {Object} SittingRequest
 * @property {string} id
 * @property {string} userid
 * @property {string} pay
 * @property {string} startdate
 * @property {string} enddate
 * @property {string} description
 * @property {string} location
 * @property {string} status
 * @property {string} createdat
 */

/**
 * Unpacks a throwable function and returns its value or null if an error occurs.
 * @template T Return value type
 * @param {() => T} throwable 
 * @returns {Promise<Awaited<T | null>>}
 */
export const unpacker = async (throwable) => {
  try {
    return await throwable();
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Fetches a list of sitting requests from the backend.
 * @returns {Promise<SittingRequest[]>} Returns a list of sitting requests.
 */
export const getSittingRequests = async () => {
  const response = await fetcher('sitting_requests')
  return await response.json()
}

/**
 * Fetches a list of sitting requests by user 'id' from the backend.
 * @param {string} id User UUID
 * @returns {Promise<SittingRequest[]>} Returns a list of sitting requests.
 */
export const getSittingRequestsBy = async (id) => {
  const response = await fetcher(`sitting_requests/user/${id}`)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}


export const registerInterestInSitting = async (sittingId, userId) => {
  console.log('registerInterestInSitting', sittingId, userId)
  const response = await fetcher(`sitter_interests/${sittingId}`, {
    method: 'POST',
    body: JSON.stringify({
      sittingrequestid: sittingId,
      userid: userId
    })
  });

  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

export const unregisterInterestInSitting = async (sittingId, userId) => {
  const response = await fetcher(`sitter_interests/${sittingId}`, {
    method: 'DELETE',
    body: JSON.stringify({
      sittingrequestid: sittingId,
      userid: userId
    })
  });

  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}