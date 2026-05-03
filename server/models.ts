import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'agent', 'admin'], default: 'user' },
}, { timestamps: true });

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  type: { type: String, enum: ['Residential', 'Commercial', 'Plots'], required: true },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  size: { type: Number },
  amenities: [{ type: String }],
  images: [{ type: String }],
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Available', 'Sold', 'Pending'], default: 'Available' }
}, { timestamps: true });

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  message: { type: String }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Property = mongoose.model('Property', propertySchema);
export const Booking = mongoose.model('Booking', bookingSchema);
