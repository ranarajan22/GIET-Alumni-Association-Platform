const Contact = require('../Models/contact');

// Submit contact form
const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate all fields
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new contact message
    const newContact = new Contact({
      name,
      email,
      phone,
      subject,
      message
    });

    await newContact.save();

    console.log(`New contact message from ${name} (${email})`);
    return res.status(201).json({
      message: 'Thank you for reaching out! We will contact you soon.',
      contact: newContact
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'Error submitting form', error: error.message });
  }
};

// Get all contact messages (admin only)
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ submittedAt: -1 });
    
    // Count by status
    const newCount = contacts.filter(c => c.status === 'new').length;
    const readCount = contacts.filter(c => c.status === 'read').length;
    const respondedCount = contacts.filter(c => c.status === 'responded').length;

    res.status(200).json({
      total: contacts.length,
      stats: { new: newCount, read: readCount, responded: respondedCount },
      contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
};

// Get unread contact messages (admin only)
const getUnreadContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ status: 'new' }).sort({ submittedAt: -1 });
    res.status(200).json({
      count: contacts.length,
      contacts
    });
  } catch (error) {
    console.error('Error fetching unread contacts:', error);
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
};

// Update contact status (admin only)
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'responded'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Status updated', contact });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

// Delete contact message (admin only)
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Error deleting contact', error: error.message });
  }
};

module.exports = {
  submitContactForm,
  getAllContacts,
  getUnreadContacts,
  updateContactStatus,
  deleteContact
};
