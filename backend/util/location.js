const axios = require('axios');

// const HttpError = require('../../aertherher/models/http-error');

const API_KEY = 'AIzaSyBvvO6sRd5iA4ngPK56mfkldPt8ApDAzvs';

async function getCoordsForAddress(address) {

  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === 'ZERO_RESULTS') {
    const error = 'Could not find location for the specified address.'
    // const error = new HttpError(
    //   'Could not find location for the specified address.',
    //   422
    // );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
