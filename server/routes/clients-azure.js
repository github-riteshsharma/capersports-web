const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { protect } = require('../middleware/auth-azure'); // Use Azure auth middleware

// Get all clients (public route)
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let query = {};
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search by name or program
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { program: { $regex: search, $options: 'i' } }
      ];
    }
    
    const clients = await Client.find(query)
      .sort({ createdAt: -1 })
      .populate('createdBy', 'name email')
      .maxTimeMS(5000); // 5 second timeout
    
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    
    // If it's a timeout or collection doesn't exist, return empty array
    if (error.message.includes('buffering timed out') || error.message.includes('does not exist')) {
      console.log('ℹ️  Clients collection not initialized yet, returning empty array');
      return res.json([]);
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single client by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).populate('createdBy', 'name email');
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new client (admin only)
router.post('/', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const { name, program, clientSince, avatar, photos, status } = req.body;
    
    // Validate required fields
    if (!name || !program || !clientSince) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: name, program, clientSince' 
      });
    }
    
    const client = new Client({
      name,
      program,
      clientSince,
      avatar: avatar || null,
      photos: photos || [],
      status: status || 'active',
      createdBy: req.user._id,
    });
    
    await client.save();
    
    const populatedClient = await Client.findById(client._id).populate('createdBy', 'name email');
    
    res.status(201).json(populatedClient);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update client (admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const { name, program, clientSince, avatar, photos, status } = req.body;
    
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    // Update fields
    if (name) client.name = name;
    if (program) client.program = program;
    if (clientSince) client.clientSince = clientSince;
    if (avatar !== undefined) client.avatar = avatar;
    if (photos) client.photos = photos;
    if (status) client.status = status;
    
    await client.save();
    
    const updatedClient = await Client.findById(client._id).populate('createdBy', 'name email');
    
    res.json(updatedClient);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete client (admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    
    await client.deleteOne();
    
    res.json({ message: 'Client deleted successfully', clientId: req.params.id });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

