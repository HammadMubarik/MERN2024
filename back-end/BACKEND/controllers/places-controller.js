const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const mongoose = require('mongoose');

// Get a place by ID
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  console.log(`[INFO] Received request for Place ID: ${placeId}`);

  let place;
  try {
    place = await Place.findById(placeId);
    if (!place) {
      console.log(`[INFO] No place found for ID: ${placeId}`);
      return next(new HttpError('Could not find a place for the provided id.', 404));
    }
  } catch (err) {
    console.error(`[ERROR] Failed to fetch place for ID: ${placeId}`, err);
    return next(new HttpError('Something went wrong, please try again later.', 500));
  }

  console.log(`[INFO] Successfully fetched place: ${JSON.stringify(place)}`);
  res.json({ place: place.toObject({ getters: true }) });
};

// Get places by user ID
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: userId });
    if (!places || places.length === 0) {
      return next(new HttpError('Could not find places for the provided user id.', 404));
    }
  } catch (err) {
    return next(new HttpError('Fetching places failed, please try again later.', 500));
  }

  res.json({ places: places.map(place => place.toObject({ getters: true })) });
};

// Create a place
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const defaultImage = 'https://www.findingtheuniverse.com/wp-content/uploads/2020/07/Empire-State-Building-view-from-uptown_by_Laurence-Norah-2.jpg';

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: defaultImage, // Assign the default image here
    creator
  });

  let user;
  try {
    user = await User.findById(creator);
    if (!user) {
      return next(new HttpError('Could not find user with provided ID.', 404));
    }

    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError('Creating place failed, please try again.', 500));
  }

  res.status(201).json({ place: createdPlace });
};

// Update a place
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
    if (!place) {
      return next(new HttpError('Could not find a place for the provided id.', 404));
    }

    place.title = title;
    place.description = description;

    await place.save();
    res.status(200).json({ place: place.toObject({ getters: true }) });
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update the place.', 500));
  }
};

// Delete a place
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  console.log(`[INFO] Received request to delete Place ID: ${placeId}`);

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
    if (!place) {
      console.log(`[INFO] No place found for ID: ${placeId}`);
      return next(new HttpError('Could not find a place for the provided id.', 404));
    }
  } catch (err) {
    console.error(`[ERROR] Failed to find place for ID: ${placeId}`, err);
    return next(new HttpError('Something went wrong, could not delete place.', 500));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    
    // Replace `remove()` with `deleteOne()` for Mongoose 6+
    await place.deleteOne({ session: sess });
    
    // Remove the place from the user's places array
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    
    // Commit the transaction
    await sess.commitTransaction();
    
    console.log(`[INFO] Successfully deleted place with ID: ${placeId}`);
  } catch (err) {
    console.error(`[ERROR] Failed to delete place for ID: ${placeId}`, err);
    return next(new HttpError('Something went wrong, could not delete place.', 500));
  }

  res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
