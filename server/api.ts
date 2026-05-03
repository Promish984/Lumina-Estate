import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, Property, Booking } from './models';

export const apiRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Middleware to check if DB is connected
const dbCheck = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(400).json({ error: 'Database not connected', code: 'DB_UNAVAILABLE' });
  }
  next();
};

// Auth middleware
export const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Admin only middleware
export const adminOnly = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Admin only access.' });
  }
  next();
};

apiRouter.use(dbCheck);

// --- Auth Routes ---
apiRouter.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name, email, role } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Property Routes ---
apiRouter.get('/properties', async (req, res) => {
  try {
    const { type, location } = req.query;
    const filter: any = {};
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    
    const properties = await Property.find(filter).populate('agentId', 'name email');
    res.json(properties);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.get('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('agentId', 'name email');
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin only
apiRouter.post('/properties', authMiddleware, adminOnly, async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.put('/properties/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json(property);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.delete('/properties/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    res.json({ message: 'Property deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Booking Routes ---
apiRouter.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('propertyId').populate('userId', 'name email');
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post('/bookings', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Catch-all for undefined API endpoints
apiRouter.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});
