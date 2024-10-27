const fetcher = async (url, options) => await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${url}`, options)

/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} event_name
 * @property {string} description
 * @property {string} createdby
 * @property {string} startdate
 * @property {string} createdat
 * @property {string} status
 * @property {string} location
 * @property {string} cost
 * @property {string} imageurl
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
 * Fetches a list of events from the backend.
 * @returns {Promise<Event[]>} Returns a list of events.
 */
export const getEvents = async ([_, userId]) => {
  const response = await fetcher('events?userid=' + userId)
  return await response.json()
}

/**
 * Fetches a list of events by user 'id' from the backend.
 * @param {string} id User UUID
 * @returns {Promise<Event[]>} Returns a list of events.
 */
export const getEventsBy = async (id) => {
  const response = await fetcher(`events/user/${id}`)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

export const createEvent = async (event) => {
  const response = await fetcher('events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

export const updateEvent = async (event) => {
  const response = await fetcher(`events/${event.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event)
  })
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

export const registerInterestInEvent = async (eventId, userId) => {
  const response = await fetcher(`event_interests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      eventid: eventId,
      userid: userId
    })
  });

  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}

export const unregisterInterestInEvent = async (eventId, userId) => {
  const response = await fetcher(`event_interests/${eventId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      eventid: eventId,
      userid: userId
    })
  });

  if (!response.ok) {
    throw new Error(response.statusText)
  }
  return response.json()
}