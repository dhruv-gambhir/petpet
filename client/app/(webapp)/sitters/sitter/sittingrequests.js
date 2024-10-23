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
 * Fetches a user by their userid from the backend.
 * @param {string} userid The userid of the user to fetch.
 * @returns {Promise<User>} Returns the user data.
 */
 export const getUserById = async (userid) => {
    const response = await fetcher(`users/${userid}`);
    return await response.json();
  };


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

/**
 * Geocodes an address or postal code and returns its coordinates (lat, lng).
 * @param {string} postalCode The postal code to geocode.
 * @returns {Promise<{lat: number, lng: number} | null>} Returns latitude and longitude.
 */
 export const geocodeAddress = async (postalCode) => {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${postalCode}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY2}`;
    const response = await fetch(geocodeUrl);
    const data = await response.json();
  
    if (data.status === "OK") {
      const location = data.results[0].geometry.location;
      return location; // { lat: <latitude>, lng: <longitude> }
    } else {
      console.error("Geocoding failed:", data.status);
      return null;
    }
  };
  