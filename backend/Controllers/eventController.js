const Event = require("../Models/event");

// Get all events
const getEvents = async (req, res) => {
  try {
    const { q = "", category, page = 1, limit = 50 } = req.query || {};
    const filter = {};
    if (q) {
      const rx = new RegExp(q, "i");
      filter.$or = [{ description: rx }, { category: rx }];
    }
    if (category) {
      filter.category = category;
    }
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);

    const total = await Event.countDocuments(filter);
    const events = await Event.find(filter)
      .populate('createdBy', 'fullName graduationYear course fieldOfStudy linkedin github profilePhoto')
      .sort({ dateTime: 1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Return shape compatible with existing clients (array) and new clients (object)
    res.json({ events, page: pageNum, total, totalPages: Math.ceil(total / limitNum) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// Get a single event by ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'fullName graduationYear course fieldOfStudy linkedin github profilePhoto');
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

// Create a new event
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      dateTime,
      endDateTime,
      mode,
      venue,
      locationLink,
      registrationRequired,
      link,
      capacity,
      bannerUrl,
      tags,
      organizerName,
      organizerContact,
      createdBy,
    } = req.body || {};

    const newEvent = new Event({
      title,
      description,
      category,
      dateTime,
      endDateTime,
      mode,
      venue,
      locationLink,
      registrationRequired,
      link,
      capacity,
      bannerUrl,
      tags,
      organizerName,
      organizerContact,
      createdBy,
    });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ error: "Failed to create event" });
  }
};

// Update an event
const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedEvent) return res.status(404).json({ error: "Event not found" });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: "Failed to update event" });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const userId = req.body?.userId || req.user?._id;
    const userRole = req.body?.userRole || req.user?.role;
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if user is admin or the creator
    if (userRole !== 'admin' && String(event.createdBy) !== String(userId)) {
      return res.status(403).json({ error: "Not authorized to delete this event" });
    }

    await Event.deleteOne({ _id: req.params.id });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};

// Toggle interested status for an event
const toggleInterested = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.body.userId; // Expect userId in request body

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Initialize interestedUsers if it doesn't exist
    if (!event.interestedUsers) {
      event.interestedUsers = [];
    }

    // Check if user is already interested
    const userIndex = event.interestedUsers.findIndex(
      (id) => id.toString() === userId.toString()
    );

    if (userIndex > -1) {
      // Remove user from interested list
      event.interestedUsers.splice(userIndex, 1);
    } else {
      // Add user to interested list
      event.interestedUsers.push(userId);
    }

    await event.save();

    res.json({
      success: true,
      isInterested: userIndex === -1,
      interestedCount: event.interestedUsers.length,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle interested status" });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleInterested,
};
