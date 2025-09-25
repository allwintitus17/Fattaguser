const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming your user profile model name
    required: true
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },
 vehicleType: {
    type: String,
    enum: [
      'Class 1 - Car / Jeep / Van',
      'Class 2 - Light Commercial Vehicle (LCV)',
      'Class 3 - Bus / Truck (2 Axles)',
      'Class 4 - 3-Axle Commercial Vehicles',
      'Class 5 - 4 to 6 Axle Vehicles',
      'Class 6 - 7 or more Axle Vehicles',
      'Class 7 - Oversized Vehicles (Earth movers, etc.)'
    ],
    required: true
  },
  chassisNumber: {
    type: String,
    required: true,
    unique: true
  },
  engineNumber: {
    type: String,
    required: true,
    unique: true
  },
  model: {
    type: String,
    required: true
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid','CNG'],
    required: true
  },
  registrationYear: {
    type: Number,
    required: true
  },
  rcFrontUrl: String,
  rcBackUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
