const Subscriber = require('../Models/subscriber');

// Subscribe to newsletter
const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return res.status(400).json({ message: 'You are already subscribed!' });
      } else {
        // Reactivate subscription
        existingSubscriber.isActive = true;
        await existingSubscriber.save();
        return res.status(200).json({ message: 'Welcome back! You are now subscribed.', subscriber: existingSubscriber });
      }
    }

    // Create new subscriber
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    console.log(`New subscriber: ${email}`);
    return res.status(201).json({
      message: 'Thank you for subscribing!',
      subscriber: newSubscriber
    });
  } catch (error) {
    console.error('Error subscribing:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You are already subscribed!' });
    }

    res.status(500).json({ message: 'Error subscribing to newsletter', error: error.message });
  }
};

// Unsubscribe from newsletter
const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const subscriber = await Subscriber.findOne({ email });
    if (!subscriber) {
      return res.status(404).json({ message: 'Email not found' });
    }

    subscriber.isActive = false;
    await subscriber.save();

    console.log(`Unsubscribed: ${email}`);
    res.status(200).json({ message: 'You have been unsubscribed successfully' });
  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({ message: 'Error unsubscribing', error: error.message });
  }
};

// Get all active subscribers (admin only)
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find({ isActive: true }).select('email subscribedAt');
    res.status(200).json({
      count: subscribers.length,
      subscribers
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ message: 'Error fetching subscribers', error: error.message });
  }
};

module.exports = { subscribe, unsubscribe, getSubscribers };
